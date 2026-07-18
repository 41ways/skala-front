// ==========================================================================
// bag.js — 내 가방 보기
// @과제 7. JavaScript 기초 · 내 가방 보기
//   [필수] myBag 객체 배열 · 반복문으로 출력하는 showMyBag()
//   [꾸미기] 아이콘 카드 + 아이템에 마우스 올리면 실제 사진 미리보기
// ==========================================================================

// @필수 소지품 객체(소지품 명 + 수). @꾸미기: 아이콘·사진 필드 추가
var myBag = [
    { name: '노트북', count: 1, icon: '💻', imgs: ['media/home/bag/laptop.webp'] },
    { name: '이어폰', count: 1, icon: '🎧', imgs: ['media/home/bag/airpods.jpeg'] },
    { name: '텀블러', count: 1, icon: '🥤', imgs: ['media/home/bag/tumbler.jpg'] },
    { name: '충전기', count: 2, icon: '🔌', imgs: ['media/home/bag/charger-macbook.webp', 'media/home/bag/charger-lightning.jpeg'] },
    { name: '펜', count: 3, icon: '🖊️', imgs: ['media/home/bag/pen-3color.webp', 'media/home/bag/pen-jetstream.jpg', 'media/home/bag/pen-name.jpg'] },
    { name: '수첩', count: 1, icon: '📓', imgs: ['media/home/bag/notepad.jpeg'] },
];

// @필수 반복문을 통해 소지품 객체를 출력하는 showMyBag()
function showMyBag() {
    var lines = [];
    for (var i = 0; i < myBag.length; i++) {
        console.log(myBag[i].name + ' - ' + myBag[i].count + '개');   // @필수 반복 출력
        lines.push(myBag[i]);
    }

    var result = document.getElementById('bagResult');
    if (!result) return;

    var items = lines.map(function (it, idx) {
        return '<li class="bag-item" data-idx="' + idx + '">'
            +    '<span class="bag-item__icon">' + (it.icon || '🎒') + '</span>'
            +    '<span class="bag-item__name">' + it.name + '</span>'
            +    '<span class="bag-item__count">×' + it.count + '</span>'
            +  '</li>';
    }).join('');
    var totalCount = myBag.reduce(function (sum, it) { return sum + it.count; }, 0);
    result.innerHTML =
        '<ul class="bag-list">' + items + '</ul>'
        + '<p class="bag-total">🎒 총 <b>' + myBag.length + '</b>종 · <b>' + totalCount + '</b>개</p>';
    result.classList.add('is-shown');

    attachHoverPreview();
}

// @꾸미기 아이템에 마우스 올리면 실제 사진 미리보기(플로팅 툴팁)
function attachHoverPreview() {
    var pop = document.getElementById('bagPop');
    if (!pop) {
        pop = document.createElement('div');
        pop.id = 'bagPop';
        pop.className = 'bag-pop';
        document.body.appendChild(pop);
    }

    document.querySelectorAll('#bagResult .bag-item').forEach(function (li) {
        var item = myBag[Number(li.dataset.idx)];
        if (!item || !item.imgs || !item.imgs.length) return;   // 사진 없으면 미리보기 없음
        li.classList.add('has-preview');

        li.addEventListener('mouseenter', function () {
            pop.innerHTML = item.imgs.map(function (src) {
                return '<img src="' + src + '" alt="' + item.name + '" loading="lazy">';
            }).join('');
            pop.classList.add('is-on');
            positionPop(li, pop);
        });
        li.addEventListener('mousemove', function () { positionPop(li, pop); });
        li.addEventListener('mouseleave', function () { pop.classList.remove('is-on'); });
    });
}

function positionPop(li, pop) {
    var r = li.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = r.left + r.width / 2 - pw / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - pw - 10));   // 화면 밖 방지
    var top = r.top - ph - 10;
    if (top < 10) top = r.bottom + 10;                                  // 위 공간 없으면 아래로
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
}

// @동작 열기/닫기 토글: 열려 있으면 닫고 버튼 문구도 바꿈
function toggleBag() {
    var result = document.getElementById('bagResult');
    var btn = document.getElementById('showBag');
    if (!result) return;

    if (result.classList.contains('is-shown')) {   // 닫기
        result.classList.remove('is-shown');
        if (btn) btn.textContent = '가방 열기';
        var pop = document.getElementById('bagPop');
        if (pop) pop.classList.remove('is-on');
    } else {                                        // 열기
        showMyBag();
        if (btn) btn.textContent = '가방 닫기';
    }
}

var bagBtn = document.getElementById('showBag');
if (bagBtn) bagBtn.addEventListener('click', toggleBag);
