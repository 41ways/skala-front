// ==========================================================================
// upDown.js — Up-Down 숫자 맞추기 게임
// @과제 7. JavaScript 기초 · Up-Down 게임
//   [필수] 아래 playUpDown()에 과제 조건을 그대로 보존:
//   1~50 무작위 생성 · prompt 입력 · while 반복 · Up!/Down! alert · 정답 축하 alert
//   [꾸미기] 그 위에 1~50 버튼 그리드(startBoard)를 얹어 클릭으로도 즐길 수 있게 함.
// ==========================================================================

// ---------------------------------------------------------------------------
// @필수 과제 조건 그대로 (prompt 방식) — '직접 입력' 버튼으로 실행됨
// ---------------------------------------------------------------------------
function playUpDown() {
    var computerNum = Math.floor(Math.random() * 50) + 1;   // @필수 1~50 무작위
    var tries = 0, cleared = false;
    var low = 1, high = 50;                                 // 좁혀진 범위

    while (true) {                                          // @필수 while 반복
        var input = prompt('숫자를 입력하세요. (남은 범위 ' + low + ' ~ ' + high + ')');
        if (input === null) break;
        var guess = Number(input);
        if (!Number.isInteger(guess) || guess < 1 || guess > 50) {
            alert('1부터 50 사이의 정수를 입력해주세요.');
            continue;
        }
        // @동작 이미 지난 범위를 입력하면 다른 안내 (시도로 세지 않음)
        if (guess < low) {
            alert('이미 지난 범위예요. ' + (low - 1) + ' 초과인 숫자를 입력하세요! ⬆️');
            continue;
        }
        if (guess > high) {
            alert('이미 지난 범위예요. ' + (high + 1) + ' 미만인 숫자를 입력하세요! ⬇️');
            continue;
        }
        tries++;
        if (guess > computerNum) { alert('Down! ⬇️'); high = guess - 1; }        // @필수
        else if (guess < computerNum) { alert('Up! ⬆️'); low = guess + 1; }      // @필수
        else { alert('축하합니다! ' + tries + '번 만에 맞추셨습니다.'); cleared = true; break; }
    }
    showResult(cleared, computerNum, tries);
}

// ---------------------------------------------------------------------------
// @꾸미기 1~50 버튼 그리드 게임
//   업(Up) = 정답이 더 큼 → 고른 수 이하 비활성화
//   다운(Down) = 정답이 더 작음 → 고른 수 이상 비활성화
// ---------------------------------------------------------------------------
function startBoard() {
    var answer = Math.floor(Math.random() * 50) + 1;
    var low = 1, high = 50, tries = 0;
    var hasUp = false, hasDown = false;   // 아래/위 경계 표시 여부

    var game = document.getElementById('upDownGame');
    var grid = document.getElementById('upDownGrid');
    var status = document.getElementById('upDownStatus');
    var result = document.getElementById('upDownResult');
    if (!game || !grid || !status) return;

    if (result) { result.classList.remove('is-shown'); result.innerHTML = ''; }
    game.hidden = false;
    grid.innerHTML = '';
    setStatus('1부터 50까지, 아무 숫자나 골라보세요. 🎯');

    var buttons = [];
    for (var n = 1; n <= 50; n++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ud-cell';
        b.textContent = n;
        b.dataset.n = n;
        b.addEventListener('click', onPick);
        grid.appendChild(b);
        buttons.push(b);
    }

    function setStatus(html, tone) {
        status.className = 'ud-status' + (tone ? ' is-' + tone : '');
        status.innerHTML = html;
    }

    function onPick(e) {
        var n = Number(e.currentTarget.dataset.n);
        if (e.currentTarget.disabled) return;
        tries++;

        if (n === answer) {                                // 정답
            e.currentTarget.classList.add('is-correct');
            buttons.forEach(function (b) { b.disabled = true; });
            setStatus('정답! 🎉 <b>' + answer + '</b> · <b>' + tries + '</b>번 만에 맞췄어요.', 'win');
            showResult(true, answer, tries);
            return;
        }

        if (n < answer) {                                  // Up: 정답이 더 큼
            low = Math.max(low, n + 1); hasUp = true;
            setStatus('<b>' + n + '</b> → Up! ⬆️ 더 큰 수. (남은 범위 <b>' + low + '~' + high + '</b>)', 'up');
        } else {                                           // Down: 정답이 더 작음
            high = Math.min(high, n - 1); hasDown = true;
            setStatus('<b>' + n + '</b> → Down! ⬇️ 더 작은 수. (남은 범위 <b>' + low + '~' + high + '</b>)', 'down');
        }
        // 범위 밖 숫자는 선택 불가로 잠금 + 표시 초기화
        buttons.forEach(function (b) {
            var v = Number(b.dataset.n);
            var out = v < low || v > high;
            b.disabled = out;
            b.classList.remove('is-picked', 'is-out');
            if (out) b.classList.add('is-out');
        });
        // @꾸미기 경계 두 개만 색으로 표시: 아래쪽(low-1) 하나, 위쪽(high+1) 하나
        markBoundary(hasUp ? low - 1 : 0);
        markBoundary(hasDown ? high + 1 : 0);
    }

    function markBoundary(v) {
        if (v < 1 || v > 50) return;
        var b = buttons[v - 1];
        if (b) { b.classList.remove('is-out'); b.classList.add('is-picked'); }
    }
}

// ---------------------------------------------------------------------------
// 공통: 카드 하단 결과 뱃지
// ---------------------------------------------------------------------------
function showResult(cleared, answer, tries) {
    var result = document.getElementById('upDownResult');
    if (!result) return;
    if (cleared) {
        result.innerHTML = '<span class="info-result__badge is-win">CLEAR</span>'
            + '정답 <b>' + answer + '</b> · <b>' + tries + '</b>번 만에 성공!';
        result.classList.add('is-shown');
    } else if (tries > 0) {
        result.innerHTML = '<span class="info-result__badge">중단</span>'
            + '정답은 <b>' + answer + '</b> 이었습니다.';
        result.classList.add('is-shown');
    }
}

// @동작 게임 열기/닫기 토글
function toggleBoard() {
    var game = document.getElementById('upDownGame');
    var btn = document.getElementById('startUpDown');
    var result = document.getElementById('upDownResult');
    if (!game) return;

    if (!game.hidden) {                             // 열려 있으면 닫기
        game.hidden = true;
        if (result) { result.classList.remove('is-shown'); result.innerHTML = ''; }
        if (btn) btn.textContent = '게임 시작';
    } else {                                        // 닫혀 있으면 새 게임 시작
        startBoard();
        if (btn) btn.textContent = '게임 닫기';
    }
}

var startBtn = document.getElementById('startUpDown');
if (startBtn) startBtn.addEventListener('click', toggleBoard);

var promptBtn = document.getElementById('upDownPrompt');
if (promptBtn) promptBtn.addEventListener('click', playUpDown);
