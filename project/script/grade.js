// ==========================================================================
// grade.js — 성적 계산기
// @과제 7. JavaScript 기초 · 성적 계산기
//   [필수] calcGrade(): subjects 배열 · total 변수 · for 반복 prompt 입력
//          · 평균/합격여부 · alert 출력 (그대로 보존, '직접 입력' 버튼으로 실행)
//   [꾸미기] '계산 시작' → 과목별 점수 드롭다운 → '확인' 시 결과 렌더
// ==========================================================================

// @필수 과목 이름 배열
var subjects = ['HTML', 'CSS', 'JavaScript'];

// ---------------------------------------------------------------------------
// @필수 과제 조건 그대로 (prompt 방식) — '직접 입력' 버튼으로 실행됨
// ---------------------------------------------------------------------------
function calcGrade() {
    var total = 0;                               // @필수 총점 변수
    var scores = [];
    var canceled = false;

    // @필수 for문으로 배열 길이만큼 prompt 입력받아 total 누적
    for (var i = 0; i < subjects.length; i++) {
        var input = prompt(subjects[i] + ' 점수를 입력하세요. (0~100)');
        if (input === null) { canceled = true; break; }

        var score = Number(input);
        if (!Number.isFinite(score) || score < 0 || score > 100) {
            alert('0부터 100 사이의 점수를 입력해주세요.');
            i--;
            continue;
        }
        scores.push(score);
        total += score;
    }
    if (canceled) return;

    // @필수 평균 계산 후 60점 이상 합격 / 미만 불합격
    var average = total / subjects.length;
    var passed = average >= 60;

    // @필수 결과를 alert 로 표시
    alert('총점: ' + total + '점, 평균: ' + average.toFixed(1)
        + ', 등급: ' + gradeOf(average) + ', 결과: ' + (passed ? '합격입니다!' : '불합격입니다.'));

    renderGrade(scores, total);
}

// ---------------------------------------------------------------------------
// @꾸미기 '계산 시작' → 과목별 점수 선택 드롭다운 열기
// ---------------------------------------------------------------------------
function startGradeForm() {
    var form = document.getElementById('gradeForm');
    var wrap = document.getElementById('gradeInputs');
    var result = document.getElementById('gradeResult');
    if (!form || !wrap) return;

    if (result) { result.classList.remove('is-shown'); result.innerHTML = ''; }

    // 0~100 점수 옵션 (스크롤 선택)
    var opts = '<option value="" selected disabled>점수</option>';
    for (var v = 100; v >= 0; v--) opts += '<option value="' + v + '">' + v + '</option>';

    wrap.innerHTML = subjects.map(function (s, i) {
        return '<label class="grade-input">'
            +    '<span class="grade-input__name">' + s + '</span>'
            +    '<select class="grade-input__select" data-subj="' + i + '" aria-label="' + s + ' 점수">' + opts + '</select>'
            +  '</label>';
    }).join('');

    form.hidden = false;
}

// @꾸미기 '확인' → 선택값으로 성적 계산 후 렌더
function confirmGrade() {
    var selects = document.querySelectorAll('#gradeInputs select');
    if (!selects.length) return;

    var scores = [], total = 0;
    for (var i = 0; i < selects.length; i++) {
        if (selects[i].value === '') { alert('모든 과목의 점수를 선택해주세요.'); return; }
        var sc = Number(selects[i].value);
        scores.push(sc);
        total += sc;
    }
    renderGrade(scores, total);
}

// ---------------------------------------------------------------------------
// 공통: 등급 계산 / 결과 렌더 (과목별 막대 + 평균 게이지)
// ---------------------------------------------------------------------------
function gradeOf(avg) {
    return avg >= 90 ? 'A' : avg >= 80 ? 'B' : avg >= 70 ? 'C' : avg >= 60 ? 'D' : 'F';
}

function renderGrade(scores, total) {
    var result = document.getElementById('gradeResult');
    if (!result) return;

    var average = total / subjects.length;
    var passed = average >= 60;
    var grade = gradeOf(average);

    var rows = subjects.map(function (s, idx) {
        var sc = scores[idx];
        var pass = sc >= 60;
        return '<li class="grade-row">'
            +    '<span class="grade-row__name">' + s + '</span>'
            +    '<span class="grade-row__bar"><i style="width:' + sc + '%" class="' + (pass ? '' : 'is-low') + '"></i></span>'
            +    '<b class="grade-row__score">' + sc + '</b>'
            +  '</li>';
    }).join('');

    result.innerHTML =
        '<ul class="grade-list">' + rows + '</ul>'
        + '<div class="grade-gauge">'
        +   '<div class="grade-gauge__track"><i style="width:' + average + '%" class="' + (passed ? 'is-pass' : 'is-fail') + '"></i>'
        +     '<span class="grade-gauge__mark" style="left:60%" title="합격 기준 60"></span></div>'
        +   '<div class="grade-gauge__meta">'
        +     '<span class="info-result__badge ' + (passed ? 'is-win' : 'is-fail') + '">' + grade + ' · ' + (passed ? '합격' : '불합격') + '</span>'
        +     '총점 <b>' + total + '</b> · 평균 <b>' + average.toFixed(1) + '</b>'
        +   '</div>'
        + '</div>';
    result.classList.add('is-shown');
}

// @동작 입력 폼 열기/닫기 토글
function toggleGradeForm() {
    var form = document.getElementById('gradeForm');
    var btn = document.getElementById('startGrade');
    var result = document.getElementById('gradeResult');
    if (!form) return;

    if (!form.hidden) {                            // 열려 있으면 닫기
        form.hidden = true;
        if (result) { result.classList.remove('is-shown'); result.innerHTML = ''; }
        if (btn) btn.textContent = '계산 시작';
    } else {                                       // 닫혀 있으면 폼 열기
        startGradeForm();
        if (btn) btn.textContent = '계산 닫기';
    }
}

var gradeBtn = document.getElementById('startGrade');
if (gradeBtn) gradeBtn.addEventListener('click', toggleGradeForm);

var gradeConfirmBtn = document.getElementById('gradeConfirm');
if (gradeConfirmBtn) gradeConfirmBtn.addEventListener('click', confirmGrade);

var gradePromptBtn = document.getElementById('gradePrompt');
if (gradePromptBtn) gradePromptBtn.addEventListener('click', calcGrade);
