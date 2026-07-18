// ==========================================================================
// music-continue.js — 다른 페이지 하단 플레이어 (방식 3: localStorage 이어재생)
// @동작 우측 벽에 붙어 튀어나온 "LP 판"(앨범아트=중앙 라벨, 금테). 재생 중이면 판이 돈다.
//       마우스를 올리면 왼쪽으로 늘어나며 재생바(음량 포함) 조작 UI가 펼쳐진다.
// @동작 메인 화면(page-index): 타이틀 전환 후 LP가 등장하며 시그니처 곡이 페이드인 자동재생,
//       "노래가 자동 재생됩니다" 말풍선을 잠깐 띄운다. (window.skalaStartMain)
// @주의 음악 페이지(page-music)엔 자체 플레이어가 있어 동작 안 함. 스타일은 직접 주입.
// ==========================================================================
(function () {
    'use strict';
    if (document.body && document.body.classList.contains('page-music')) return;
    var isIndex = document.body && document.body.classList.contains('page-index');

    // @확장 메인 화면 고정 곡(사용자 지정). 파일 바꾸면 여기 경로만 교체.
    var MAIN = {
        name: 'Everything Happens to Me', album: 'Everything happens to me', artist: 'Chet Baker',
        cover: 'media/music/Everything%20happens%20to%20me/Everyhting%20hanppens%20to%20me.jpg',
        src: 'media/music/Everything%20happens%20to%20me/Everything%20happens%20to%20me.mp3'
    };

    var KEY = 'skalaMusic';
    var state; try { state = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { state = null; }
    // @동작 전체 앨범 카탈로그(myMusic이 저장) → 다음 앨범 이동에 필요
    var catalog; try { catalog = JSON.parse(localStorage.getItem('skalaCatalog') || 'null'); } catch (e) { catalog = null; }

    var tracks, idx, meta, autoNow, waitMain, albumIdx = -1;
    // @동작 MAIN이 속한 앨범 전체로 확장(카탈로그 있을 때) → 메인/기본 LP도 다음곡/앨범/전체반복 동작
    function expandMain() {
        if (!(catalog && catalog.length)) return;
        var ai = -1;
        for (var k = 0; k < catalog.length; k++) { if (catalog[k].title === MAIN.album) { ai = k; break; } }
        if (ai < 0) return;
        albumIdx = ai; tracks = catalog[ai].tracks; idx = 0;
        for (var j = 0; j < tracks.length; j++) { if (tracks[j].src === MAIN.src) { idx = j; break; } }
        meta = { album: catalog[ai].title, artist: catalog[ai].artist, cover: catalog[ai].cover };
    }
    // @동작 저장된 곡이 있으면 어느 페이지든 표시(재생 중이면 이어재생, 정지여도 LP는 항상 표시).
    //       저장곡이 없으면 시그니처 곡을 '정지 상태'로 항상 표시 → 노래가 멈춰도 미니 LP는 늘 위치함.
    if (state && state.src) {
        tracks = Array.isArray(state.tracks) && state.tracks.length ? state.tracks : [{ name: state.name, src: state.src }];
        idx = (typeof state.index === 'number' && tracks[state.index] && tracks[state.index].src === state.src) ? state.index
            : Math.max(0, tracks.findIndex(function (t) { return t.src === state.src; }));
        meta = { album: state.album, artist: state.artist, cover: state.cover };
        albumIdx = (typeof state.albumIndex === 'number') ? state.albumIndex : -1;
        autoNow = !!state.playing; waitMain = false;
    } else if (isIndex) {
        tracks = [{ name: MAIN.name, src: MAIN.src, dur: '' }]; idx = 0;
        meta = { album: MAIN.album, artist: MAIN.artist, cover: MAIN.cover };
        autoNow = false; waitMain = true; expandMain();
    } else {
        tracks = [{ name: MAIN.name, src: MAIN.src, dur: '' }]; idx = 0;
        meta = { album: MAIN.album, artist: MAIN.artist, cover: MAIN.cover };
        autoNow = false; waitMain = false; expandMain();
    }
    var shuffleOn = state ? !!state.shuffle : false;
    // @동작 반복재생 4단계: off → 1곡(one) → 앨범(album) → 전체(all). (myMusic과 동일)
    var repeatMode = (state && state.repeatMode) ? state.repeatMode : ((state && state.repeat) ? 'album' : 'off');
    var REPEAT_ORDER = ['off', 'one', 'album', 'all'];
    var RLOOP = '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>';
    function repeatSVG(m) {
        if (m === 'all') {   // @동작 전체 반복: 반복 루프 없이 A + 아래에 오른쪽 화살표(→)
            return '<svg viewBox="0 0 24 24">'
                + '<text x="12" y="12" text-anchor="middle" font-size="11.5" font-weight="800" fill="currentColor" stroke="none">A</text>'
                + '<path d="M6.5 17.5 H16 M13.3 15 L16 17.5 L13.3 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
                + '</svg>';
        }
        var mk = '';
        if (m === 'one')   mk = '<text x="12" y="15.7" text-anchor="middle" font-size="9.5" font-weight="800" fill="currentColor" stroke="none">1</text>';
        if (m === 'album') mk = '<text x="12" y="15.7" text-anchor="middle" font-size="9" font-weight="800" fill="currentColor" stroke="none">A</text>';
        return '<svg viewBox="0 0 24 24">' + RLOOP + mk + '</svg>';
    }
    function canAlbum() { return catalog && catalog.length && albumIdx >= 0; }

    // --- 스타일 주입 ---
    var css = ''
      + '.mc{position:fixed;right:20px;bottom:24px;z-index:130;display:flex;align-items:center;flex-direction:row-reverse;'
      + 'font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;'
      + 'transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .4s ease;}'
      + '.mc.mc--hidden{transform:translateX(150%);opacity:0;pointer-events:none;}'
      // 홀더(회전 X) — 말풍선 앵커용 투명 래퍼
      + '.mc__holder{position:relative;flex:0 0 auto;display:grid;place-items:center;}'
      // LP 판 — 원형 금테(원래대로), 프레임 안에서 회전. 오른쪽 잘리지 않게 화면 안에 위치
      + '.mc__disc{position:relative;width:74px;height:74px;border-radius:50%;cursor:pointer;padding:0;appearance:none;-webkit-appearance:none;'
      + 'background:radial-gradient(circle at 50% 50%, #2a2630 0 16%, #0c0b0f 16% 19%, #1a181f 19% 100%);'
      + 'border:3px solid #c6a582;'
      + 'box-shadow:0 10px 26px #000000b3, inset 0 0 0 1px #00000080, 0 0 0 1px #e0c8a166;display:grid;place-items:center;}'
      + '.mc__disc::after{content:"";position:absolute;width:8px;height:8px;border-radius:50%;background:#c6a582;z-index:2;box-shadow:0 0 0 2px #00000066;}'
      + '.mc__label{width:44px;height:44px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 1px #00000099;}'
      + '.mc.is-playing .mc__disc{animation:mcspin 3.4s linear infinite;}'
      + '@keyframes mcspin{to{transform:rotate(360deg);}}'
      // 말풍선 — 홀더(회전 X)에 붙여서 LP와 같이 돌지 않음
      + '.mc__bubble{position:absolute;right:6px;top:-10px;transform:translateY(-100%);background:#fbf8f2;color:#241f18;'
      + 'font-size:12px;font-weight:700;line-height:1.35;padding:9px 12px;border-radius:12px;white-space:nowrap;'
      + 'box-shadow:0 10px 26px #00000073;opacity:0;pointer-events:none;transition:opacity .35s ease,transform .35s ease;z-index:3;}'
      + '.mc__bubble::after{content:"";position:absolute;right:22px;bottom:-7px;border:7px solid transparent;border-top-color:#fbf8f2;border-bottom:0;}'
      + '.mc__bubble.is-on{opacity:1;transform:translateY(-100%) translateY(-2px);}'
      // @동작 "맨 위로" 버튼이 LP와 안 겹치게 LP 위쪽으로 올림
      + '.totop{bottom:118px !important;}'
      // 펼쳐지는 패널
      + '.mc__panel{display:flex;align-items:center;gap:10px;max-width:0;opacity:0;overflow:hidden;'
      + 'margin-right:0;padding:0;border-radius:14px;background:#221f2aee;border:1px solid #ffffff26;'
      + 'backdrop-filter:blur(16px);box-shadow:0 18px 44px #000000a6;'
      + 'transition:max-width .45s cubic-bezier(.22,1,.36,1),opacity .35s ease,padding .45s ease,margin-right .45s ease;}'
      + '.mc:hover .mc__panel,.mc:focus-within .mc__panel{max-width:560px;opacity:1;padding:10px 14px;margin-right:12px;}'
      + '.mc__meta{min-width:96px;max-width:140px;}'
      + '.mc__track{font-size:13px;font-weight:700;color:#f2f0ec;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
      + '.mc__album{font-size:11px;color:#9a958c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
      + '.mc__ctrl{display:flex;align-items:center;gap:3px;}'
      + '.mc__btn{width:32px;height:32px;border-radius:50%;border:none;cursor:pointer;display:inline-flex;'
      + 'align-items:center;justify-content:center;color:#f2f0ec;background:transparent;transition:background .2s,color .2s;}'
      + '.mc__btn:hover{background:#ffffff1a;}'
      + '.mc__btn.mc__play{background:#c6a582;color:#17140f;}.mc__btn.mc__play:hover{background:#e0c8a1;}'
      + '.mc__btn.is-on{background:#c6a582;color:#17140f;}'
      + '.mc__btn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}'
      + '.mc__btn svg polygon,.mc__btn svg rect{fill:currentColor;stroke:none;}'
      + '.mc__bar{flex:1;min-width:80px;height:6px;background:#ffffff1f;border-radius:6px;overflow:hidden;cursor:pointer;}'
      + '.mc__fill{display:block;height:100%;width:0;background:#c6a582;pointer-events:none;}'
      + '.mc__vol{display:flex;align-items:center;gap:5px;}'
      + '.mc__vrange{width:60px;height:4px;-webkit-appearance:none;appearance:none;border-radius:4px;cursor:pointer;background:linear-gradient(to right,#c6a582 0 var(--fill,100%),#ffffff33 var(--fill,100%) 100%);}'
      + '.mc__vrange::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#c6a582;cursor:pointer;}'
      + '.mc__vrange::-moz-range-thumb{width:12px;height:12px;border:none;border-radius:50%;background:#c6a582;cursor:pointer;}'
      + '.mc__vrange::-moz-range-progress{height:4px;border-radius:4px;background:#c6a582;}'
      + '.mc__vrange::-moz-range-track{height:4px;border-radius:4px;background:#ffffff33;}'
      + '.mc__closebtn{display:none;}'
      // @동작 모바일(≤768): LP 탭 = 패널 열기(mc--open 클래스), 재생/정지는 패널 버튼으로.
      //        디스크 위치 고정 + 얇은 패널(제목+컨트롤만), 진행바·앨범명 숨김,
      //        음량은 스피커 버튼으로 슬라이더 토글, ✕ 닫기는 패널 우상단.
      + '@media (max-width:768px){'
      + '.mc{right:12px;bottom:18px;align-items:flex-end;}'
      + '.mc__disc{width:62px;height:62px;}'
      + '.mc__label{width:36px;height:36px;}'
      // @주의 모바일 브라우저는 탭 후 :hover가 남아 패널이 다시 열림 → hover/focus 무력화, mc--open으로만 여닫음
      + '.mc:hover .mc__panel,.mc:focus-within .mc__panel{max-width:0;opacity:0;padding:0;margin-right:0;}'
      + '.mc.mc--open .mc__panel{max-width:calc(100vw - 104px);opacity:1;flex-wrap:wrap;row-gap:6px;padding:8px 30px 8px 10px;margin-right:12px;position:relative;overflow:visible;}'
      + '.mc__album{display:none;}'
      + '.mc__bar{display:none;}'
      + '.mc__meta{min-width:0;max-width:calc(100vw - 190px);}'
      + '.mc__btn{width:29px;height:29px;}'
      + '.mc__closebtn{display:inline-flex;position:absolute;top:2px;right:2px;width:26px;height:26px;font-size:12px;}'
      // @동작 음량: 스피커 버튼 위로 세로 슬라이더(재생바 위로 넘어감), 조절 후 자동 닫힘
      + '.mc__vol{position:relative;}'
      + '.mc__vol .mc__vrange{display:none;}'
      + '.mc__vol.is-open .mc__vrange{display:block;position:absolute;left:50%;bottom:calc(100% + 40px);width:68px;transform:translateX(-50%) rotate(-90deg);}'
      + '}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var I = {
        shuffle: '<svg viewBox="0 0 24 24"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>',
        prev: '<svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',
        next: '<svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
        repeat: '<svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
        play: '<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20"/></svg>',
        pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
        vol: '<svg viewBox="0 0 24 24"><polygon points="4 9 4 15 8 15 13 19 13 5 8 9"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>',
        mute: '<svg viewBox="0 0 24 24"><polygon points="4 9 4 15 8 15 13 19 13 5 8 9"/><path d="M22 9 L16 15 M16 9 L22 15"/></svg>'
    };

    var box = document.createElement('div');
    // @동작 메인 화면에선 항상 숨김으로 시작 → 타이틀 전환(skalaStartMain) 후 등장 (이어재생 중이어도 동일)
    box.className = 'mc' + (isIndex ? ' mc--hidden' : '');
    box.innerHTML =
        '<div class="mc__holder">'
      +   '<span class="mc__bubble">🎵 눌러서 재생</span>'
      +   '<button type="button" class="mc__disc" title="재생/일시정지" aria-label="재생/일시정지"><img class="mc__label" alt=""></button>'
      + '</div>'
      + '<div class="mc__panel">'
      +   '<div class="mc__meta"><p class="mc__track"></p><p class="mc__album"></p></div>'
      +   '<div class="mc__ctrl">'
      +     '<button class="mc__btn mc__shuffle" type="button" aria-label="셔플">' + I.shuffle + '</button>'
      +     '<button class="mc__btn mc__prev" type="button" aria-label="이전 곡">' + I.prev + '</button>'
      +     '<button class="mc__btn mc__play mc__toggle" type="button" aria-label="재생/일시정지"></button>'
      +     '<button class="mc__btn mc__next" type="button" aria-label="다음 곡">' + I.next + '</button>'
      +     '<button class="mc__btn mc__repeat" type="button" aria-label="반복">' + I.repeat + '</button>'
      +   '</div>'
      +   '<div class="mc__bar"><span class="mc__fill"></span></div>'
      +   '<div class="mc__vol">'
      +     '<button class="mc__btn mc__mute" type="button" aria-label="음소거">' + I.vol + '</button>'
      +     '<input class="mc__vrange" type="range" min="0" max="1" step="0.01" value="1" aria-label="음량">'
      +   '</div>'
      +   '<button class="mc__btn mc__closebtn" type="button" aria-label="재생바 닫기">&#10005;</button>'
      + '</div>';
    document.body.appendChild(box);

    var audio = new Audio();
    var labelImg = box.querySelector('.mc__label');
    var trackEl = box.querySelector('.mc__track');
    var albumEl = box.querySelector('.mc__album');
    var toggle = box.querySelector('.mc__toggle');
    var fill = box.querySelector('.mc__fill');
    var bar = box.querySelector('.mc__bar');
    var shBtn = box.querySelector('.mc__shuffle');
    var rpBtn = box.querySelector('.mc__repeat');
    var muteBtn = box.querySelector('.mc__mute');
    var vrange = box.querySelector('.mc__vrange');
    var bubble = box.querySelector('.mc__bubble');
    labelImg.src = meta.cover;
    albumEl.textContent = (meta.album || '') + (meta.artist ? ' · ' + meta.artist : '');
    shBtn.classList.toggle('is-on', shuffleOn);
    rpBtn.innerHTML = repeatSVG(repeatMode);
    rpBtn.classList.toggle('is-on', repeatMode !== 'off');
    toggle.innerHTML = I.play;
    trackEl.textContent = tracks[idx].name;

    // --- 음량 + 페이드인 ---
    // @동작 저장된 음량 복원(페이지 넘어가도 유지) — 음악 페이지와 'skalaVol' 키 공유
    var userVol = parseFloat(localStorage.getItem('skalaVol')); if (isNaN(userVol)) userVol = 0.5;   // @값 기본 음량 50%
    var muted = false, fadeTimer = null;
    vrange.value = userVol;
    function applyVol() {
        audio.volume = muted ? 0 : userVol;
        muteBtn.innerHTML = (muted || userVol === 0) ? I.mute : I.vol;
        vrange.style.setProperty('--fill', userVol * 100 + '%');   // @동작 볼륨 위치까지 왼쪽 채움 색
    }
    vrange.addEventListener('input', function () {
        userVol = parseFloat(vrange.value); muted = false; applyVol(); localStorage.setItem('skalaVol', userVol);
        // @동작 모바일: 조절 멈추고 1.2초 뒤 세로 음량바 자동 닫힘
        if (window.innerWidth <= 768) {
            clearTimeout(vrange._auto);
            vrange._auto = setTimeout(function () { vrange.parentElement.classList.remove('is-open'); }, 1200);
        }
    });
    vrange.addEventListener('change', function () {
        if (window.innerWidth <= 768) { clearTimeout(vrange._auto); vrange.parentElement.classList.remove('is-open'); }
    });
    muteBtn.addEventListener('click', function () {
        // @동작 모바일: 스피커 버튼은 음량 슬라이더 열기/닫기 (음소거 대신)
        if (window.innerWidth <= 768) { muteBtn.parentElement.classList.toggle('is-open'); return; }
        muted = !muted; applyVol();
    });
    // @동작 ✕ 닫기(모바일): 패널 접기 — mc--open 해제 + 포커스 해제(focus-within 방지)
    var closeBtn = box.querySelector('.mc__closebtn');
    if (closeBtn) closeBtn.addEventListener('click', function () {
        box.classList.remove('mc--open');
        box.querySelector('.mc__vol').classList.remove('is-open');
        setTimeout(function () { if (document.activeElement && box.contains(document.activeElement)) document.activeElement.blur(); }, 0);
    });
    applyVol();   // 초기 채움 반영
    function fadeIn() {
        clearInterval(fadeTimer);
        var target = muted ? 0 : userVol;
        if (target <= 0) { audio.volume = 0; return; }
        var v = 0; audio.volume = 0;
        var step = target / 31;   // @동작 첫 재생 페이드: 30% 더 길게 (약 0.9s → 1.18s)
        fadeTimer = setInterval(function () { v = Math.min(target, v + step); audio.volume = v; if (v >= target) clearInterval(fadeTimer); }, 38);
    }

    function sync() { toggle.innerHTML = audio.paused ? I.play : I.pause; box.classList.toggle('is-playing', !audio.paused); }
    function save() {
        var t = tracks[idx];
        localStorage.setItem(KEY, JSON.stringify({
            src: t.src, name: t.name, album: meta.album, artist: meta.artist, cover: meta.cover,
            time: audio.currentTime, playing: !audio.paused, leftAt: Date.now(),
            shuffle: shuffleOn, repeat: repeatMode !== 'off', repeatMode: repeatMode, tracks: tracks, index: idx, albumIndex: albumIdx
        }));
    }
    // @동작 다음/이전 앨범으로 전환 (커버·제목·트랙목록 갱신)
    function loadAlbum(ai, autoplay) {
        if (!catalog || !catalog.length) { load(nextIndex(), autoplay); return; }
        albumIdx = ((ai % catalog.length) + catalog.length) % catalog.length;
        var al = catalog[albumIdx];
        tracks = al.tracks;
        meta = { album: al.title, artist: al.artist, cover: al.cover };
        labelImg.src = meta.cover;
        albumEl.textContent = (meta.album || '') + (meta.artist ? ' · ' + meta.artist : '');
        load(0, autoplay);
    }
    function nextIndex() {
        if (shuffleOn && tracks.length > 1) { var r; do { r = Math.floor(Math.random() * tracks.length); } while (r === idx); return r; }
        return (idx + 1) % tracks.length;
    }
    function load(i, autoplay, resumeAt) {
        idx = (i % tracks.length + tracks.length) % tracks.length;
        var t = tracks[idx];
        audio.src = t.src; trackEl.textContent = t.name;
        // @동작 이어재생: 시크(위치 맞추기) 후 재생 → 처음부터 잠깐 재생되는 깜빡임 방지
        if (resumeAt != null) {
            audio.addEventListener('loadedmetadata', function once() {
                audio.removeEventListener('loadedmetadata', once);
                try { audio.currentTime = resumeAt; } catch (e) {}
                if (autoplay) audio.play().then(sync).catch(sync);
            });
        } else if (autoplay) { audio.play().then(sync).catch(sync); }
        save();
    }

    audio.addEventListener('play', function () { sync(); save(); bubble.classList.remove('is-on'); });
    audio.addEventListener('pause', function () { sync(); save(); });
    audio.addEventListener('timeupdate', function () {
        if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
        save();
    });
    audio.addEventListener('ended', function () {
        var last = idx === tracks.length - 1;
        if (repeatMode === 'one') { load(idx, true); return; }                 // @동작 1곡 반복
        if (shuffleOn) { load(nextIndex(), true); return; }
        if (repeatMode === 'album') { load(last ? 0 : idx + 1, true); return; }              // @동작 앨범 반복: 끝이면 처음, 아니면 다음
        if (repeatMode === 'all') {                                            // @동작 전체 반복: 끝이면 다음 앨범
            if (!last) { load(idx + 1, true); return; }
            if (canAlbum()) { loadAlbum(albumIdx + 1, true); return; }
            load(0, true); return;
        }
        // @동작 반복 off: 곡이 끝나면 다음 곡으로 넘어가지 않고 그 자리에서 정지
        audio.pause(); audio.currentTime = 0; fill.style.width = '0%'; sync(); save();
    });
    // @동작 재생/일시정지: 하단 버튼 + 돌아가는 LP판 둘 다로 조작
    function togglePlay() {
        if (audio.paused) { fadeIn(); audio.play().then(sync).catch(sync); }
        else audio.pause();
    }
    toggle.addEventListener('click', togglePlay);
    var discBtn = box.querySelector('.mc__disc');
    if (discBtn) discBtn.addEventListener('click', function () {
        // @동작 모바일: LP 탭 = 재생바 열기만 (재생/정지는 패널의 ▶ 버튼으로, 닫기는 ✕)
        if (window.innerWidth <= 768) { box.classList.add('mc--open'); return; }
        togglePlay();
        // @동작 데스크톱: 클릭 후 잠시 뒤 포커스 해제 → focus-within으로 펼쳐진 재생바가 접힘
        clearTimeout(discBtn._collapse);
        discBtn._collapse = setTimeout(function () { discBtn.blur(); }, 1800);
    });
    box.querySelector('.mc__prev').addEventListener('click', function () { load((idx - 1 + tracks.length) % tracks.length, true); });
    box.querySelector('.mc__next').addEventListener('click', function () {
        if (shuffleOn) { load(nextIndex(), true); return; }
        if (repeatMode === 'album') { load((idx + 1) % tracks.length, true); return; }   // @동작 앨범 반복: 앨범 안에서 순환
        if (idx < tracks.length - 1) { load(idx + 1, true); return; }
        if (canAlbum()) { loadAlbum(albumIdx + 1, true); return; }              // @동작 앨범 끝 → 다음 앨범
        load(0, true);
    });
    shBtn.addEventListener('click', function () { shuffleOn = !shuffleOn; shBtn.classList.toggle('is-on', shuffleOn); save(); });
    rpBtn.addEventListener('click', function () {
        repeatMode = REPEAT_ORDER[(REPEAT_ORDER.indexOf(repeatMode) + 1) % REPEAT_ORDER.length];
        rpBtn.innerHTML = repeatSVG(repeatMode);
        rpBtn.classList.toggle('is-on', repeatMode !== 'off');
        save();
    });

    function seekAt(clientX) {
        if (!audio.duration) return;
        var r = bar.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        audio.currentTime = p * audio.duration; fill.style.width = (p * 100) + '%';
    }
    var dragging = false;
    bar.addEventListener('pointerdown', function (e) { dragging = true; bar.setPointerCapture(e.pointerId); seekAt(e.clientX); });
    bar.addEventListener('pointermove', function (e) { if (dragging) seekAt(e.clientX); });
    bar.addEventListener('pointerup', function () { dragging = false; });
    window.addEventListener('pagehide', save);

    function showBubble() {
        bubble.classList.add('is-on');
        setTimeout(function () { bubble.classList.remove('is-on'); }, 4200);
    }

    // @동작 메인 화면: 타이틀 전환 전에는 무조건 무음(볼륨 0) → 전환되면 LP 등장 + 소리 페이드인
    if (isIndex) {
        window.skalaStartMain = function () {
            box.classList.remove('mc--hidden');
            if (!audio.paused) fadeIn();          // 이어재생 중이던 소리를 0 → 설정 음량으로 페이드인
            else showBubble();                    // 정지 상태면 "눌러서 재생" 안내
        };
    }
    if (autoNow) {
        var resumeAt = state.time || 0;   // @동작 앞으로 점프 보정 제거 → 끊긴 지점 그대로 이어재생(자연스럽게)
        load(idx, true, resumeAt);
        if (isIndex) audio.volume = 0;    // @동작 타이틀 전환 전까지 무음으로 재생 (전환 시 fadeIn)
    } else {
        // @동작 정지 상태 준비: 오디오만 로드(저장 위치로 시크), 재생은 사용자가 판을 눌러 시작
        load(idx, false, (state && state.src) ? (state.time || 0) : null);
    }
})();
