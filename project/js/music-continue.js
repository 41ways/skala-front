// ==========================================================================
// music-continue.js — 페이지 이동 후에도 음악 이어 재생 (방식 3: localStorage)
// @동작 음악 페이지(myMusic.html)에서 저장한 재생 상태를 읽어, 다른 페이지에서도
//       하단에 미니 플레이어를 띄우고 그 지점부터 이어 재생. 앨범 트랙 목록도 저장돼
//       있어 이전/다음/셔플/반복/타임라인 이동까지 모두 조작 가능.
// @주의 음악 페이지(page-music)에는 자체 플레이어가 있으므로 여기서는 동작하지 않음.
//       스타일은 이 파일이 직접 주입 → 공용 style.css를 건드리지 않음(충돌 방지).
// ==========================================================================
(function () {
    'use strict';
    if (document.body && document.body.classList.contains('page-music')) return;

    var KEY = 'skalaMusic';
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    if (!s || !s.playing || !s.src) return;

    var tracks = Array.isArray(s.tracks) && s.tracks.length ? s.tracks : [{ name: s.name, src: s.src }];
    var idx = (typeof s.index === 'number' && s.index >= 0) ? s.index : 0;
    if (!tracks[idx] || tracks[idx].src !== s.src) {
        var found = tracks.findIndex(function (t) { return t.src === s.src; });
        idx = found >= 0 ? found : 0;
    }
    var shuffleOn = !!s.shuffle, repeatOn = !!s.repeat;

    // --- 스타일 주입 ---
    var css = ''
      + '.mc-player{position:fixed;left:50%;bottom:18px;transform:translateX(-50%) translateY(160%);'
      + 'width:min(560px,94vw);z-index:130;display:grid;grid-template-columns:46px minmax(0,1fr) auto auto;'
      + 'align-items:center;gap:12px;padding:10px 14px;border-radius:14px;background:#221f2ae6;'
      + 'border:1px solid #ffffff26;backdrop-filter:blur(16px);box-shadow:0 18px 44px #000000a6;'
      + 'transition:transform .5s cubic-bezier(.22,1,.36,1);font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;}'
      + '.mc-player.is-on{transform:translateX(-50%) translateY(0);}'
      + '.mc-player a.mc-cover{display:block;width:46px;height:46px;border-radius:8px;overflow:hidden;}'
      + '.mc-player a.mc-cover img{width:100%;height:100%;object-fit:cover;display:block;}'
      + '.mc-meta{min-width:0;}'
      + '.mc-track{font-size:13px;font-weight:700;color:#f2f0ec;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
      + '.mc-album{font-size:11px;color:#9a958c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
      + '.mc-ctrl{display:flex;align-items:center;gap:4px;}'
      + '.mc-btn{width:34px;height:34px;border-radius:50%;border:none;cursor:pointer;display:inline-flex;'
      + 'align-items:center;justify-content:center;color:#f2f0ec;background:transparent;transition:background .2s,color .2s;}'
      + '.mc-btn:hover{background:#ffffff1a;}'
      + '.mc-btn.mc-play{background:#c6a582;color:#17140f;}.mc-btn.mc-play:hover{background:#e0c8a1;}'
      + '.mc-btn.is-on{background:#c6a582;color:#17140f;}'
      + '.mc-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}'
      + '.mc-btn svg polygon,.mc-btn svg rect{fill:currentColor;stroke:none;}'
      + '.mc-btn.mc-close svg{stroke:currentColor;}'
      + '.mc-bar{grid-column:1/-1;height:6px;background:#ffffff1f;border-radius:6px;overflow:hidden;margin-top:4px;cursor:pointer;}'
      + '.mc-fill{display:block;height:100%;width:0;background:#c6a582;pointer-events:none;}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var I = {
        shuffle: '<svg viewBox="0 0 24 24"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>',
        prev: '<svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',
        next: '<svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
        repeat: '<svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
        play: '<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20"/></svg>',
        pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
        close: '<svg viewBox="0 0 24 24"><path d="M6 6 L18 18 M18 6 L6 18"/></svg>'
    };

    var box = document.createElement('div');
    box.className = 'mc-player';
    box.innerHTML =
        '<a class="mc-cover" href="myMusic.html" title="음악 페이지로"><img alt=""></a>'
      + '<div class="mc-meta"><p class="mc-track"></p><p class="mc-album"></p></div>'
      + '<div class="mc-ctrl">'
      +   '<button class="mc-btn mc-shuffle" type="button" aria-label="셔플">' + I.shuffle + '</button>'
      +   '<button class="mc-btn mc-prev" type="button" aria-label="이전 곡">' + I.prev + '</button>'
      +   '<button class="mc-btn mc-play mc-toggle" type="button" aria-label="재생/일시정지"></button>'
      +   '<button class="mc-btn mc-next" type="button" aria-label="다음 곡">' + I.next + '</button>'
      +   '<button class="mc-btn mc-repeat" type="button" aria-label="반복">' + I.repeat + '</button>'
      + '</div>'
      + '<button class="mc-btn mc-close" type="button" aria-label="닫기">' + I.close + '</button>'
      + '<div class="mc-bar"><span class="mc-fill"></span></div>';
    document.body.appendChild(box);

    var audio = new Audio();
    var coverImg = box.querySelector('.mc-cover img');
    var trackEl = box.querySelector('.mc-track');
    var albumEl = box.querySelector('.mc-album');
    var toggle = box.querySelector('.mc-toggle');
    var fill = box.querySelector('.mc-fill');
    var bar = box.querySelector('.mc-bar');
    var shBtn = box.querySelector('.mc-shuffle');
    var rpBtn = box.querySelector('.mc-repeat');
    coverImg.src = s.cover;
    albumEl.textContent = (s.album || '') + ' · ' + (s.artist || '');
    shBtn.classList.toggle('is-on', shuffleOn);
    rpBtn.classList.toggle('is-on', repeatOn);

    var firstLoad = true;
    function load(i, autoplay, resumeAt) {
        idx = (i % tracks.length + tracks.length) % tracks.length;
        var t = tracks[idx];
        audio.src = t.src;
        trackEl.textContent = t.name;
        audio.addEventListener('loadedmetadata', function once() {
            audio.removeEventListener('loadedmetadata', once);
            if (resumeAt) { try { audio.currentTime = resumeAt; } catch (e) {} }
        });
        if (autoplay) audio.play().then(sync).catch(sync);
        save();
    }
    function sync() { toggle.innerHTML = audio.paused ? I.play : I.pause; }
    function save() {
        var t = tracks[idx];
        localStorage.setItem(KEY, JSON.stringify({
            src: t.src, name: t.name, album: s.album, artist: s.artist, cover: s.cover,
            time: audio.currentTime, playing: !audio.paused, leftAt: Date.now(),
            shuffle: shuffleOn, repeat: repeatOn, tracks: tracks, index: idx
        }));
    }
    function nextIndex() {
        if (shuffleOn && tracks.length > 1) { var r; do { r = Math.floor(Math.random() * tracks.length); } while (r === idx); return r; }
        return (idx + 1) % tracks.length;
    }

    audio.addEventListener('play', function () { sync(); save(); });
    audio.addEventListener('pause', function () { sync(); save(); });
    audio.addEventListener('timeupdate', function () {
        if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
        save();
    });
    audio.addEventListener('ended', function () {
        var last = idx === tracks.length - 1;
        if (shuffleOn) { load(nextIndex(), true); return; }
        if (!last) { load(idx + 1, true); return; }
        if (repeatOn) { load(0, true); return; }
        audio.pause(); audio.currentTime = 0; fill.style.width = '0%'; sync(); save();
    });

    toggle.addEventListener('click', function () { if (audio.paused) audio.play(); else audio.pause(); });
    box.querySelector('.mc-prev').addEventListener('click', function () { load((idx - 1 + tracks.length) % tracks.length, true); });
    box.querySelector('.mc-next').addEventListener('click', function () { load(nextIndex(), true); });
    shBtn.addEventListener('click', function () { shuffleOn = !shuffleOn; shBtn.classList.toggle('is-on', shuffleOn); save(); });
    rpBtn.addEventListener('click', function () { repeatOn = !repeatOn; rpBtn.classList.toggle('is-on', repeatOn); save(); });
    box.querySelector('.mc-close').addEventListener('click', function () {
        audio.pause();
        localStorage.setItem(KEY, JSON.stringify(Object.assign({}, s, { playing: false })));
        box.classList.remove('is-on');
    });

    // @동작 타임라인 클릭/드래그로 이동
    function seekAt(clientX) {
        if (!audio.duration) return;
        var r = bar.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        audio.currentTime = p * audio.duration;
        fill.style.width = (p * 100) + '%';
    }
    var dragging = false;
    bar.addEventListener('pointerdown', function (e) { dragging = true; bar.setPointerCapture(e.pointerId); seekAt(e.clientX); });
    bar.addEventListener('pointermove', function (e) { if (dragging) seekAt(e.clientX); });
    bar.addEventListener('pointerup', function () { dragging = false; });

    window.addEventListener('pagehide', save);

    // 저장된 위치 + 이동에 걸린 시간만큼 앞으로 → 자연스럽게 이어짐
    var resumeAt = (s.time || 0) + (s.leftAt ? (Date.now() - s.leftAt) / 1000 : 0);
    requestAnimationFrame(function () { box.classList.add('is-on'); });
    load(idx, true, resumeAt);
})();
