// ==========================================================================
// weatherFallback.js — 실시간 날씨 폴백 (일반 스크립트)
//   @목적 과제 제출용 모듈(type="module")은 로컬 서버에서만 동작하는데,
//         교수님이 파일을 브라우저로 직접 열(file://) 경우 모듈이 차단되므로
//         그때만 이 일반 스크립트가 대신 날씨를 표시한다.
//   @주의 서버(Live Server 등)에서는 realtimeInfo.js 모듈이 먼저 실행되어
//         window.__weatherReady 를 세팅하므로, 여기서는 아무 것도 하지 않는다.
// ==========================================================================
(function () {
    'use strict';

    function init() {
        if (window.__weatherReady) return;   // 모듈이 이미 처리함(서버 환경)

        var select = document.getElementById('citySelect');
        var box = document.getElementById('weatherBox');
        var resetBtn = document.getElementById('weatherReset');
        if (!select || !box) return;

        var PLACEHOLDER = '<p class="info-card__placeholder">도시를 선택하면 날씨가 표시됩니다.</p>';

        // Open-Meteo 무료 API 비동기 호출 (weatherAPI.js와 동일 로직)
        async function getWeather(lat, lon) {
            var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat
                    + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m';
            var res = await fetch(url);
            if (!res.ok) throw new Error('날씨 데이터를 불러오지 못했습니다. (' + res.status + ')');
            var data = await res.json();
            var cur = data.current || {};
            var u = data.current_units || {};
            return {
                temperature: cur.temperature_2m,
                humidity: cur.relative_humidity_2m,
                tUnit: u.temperature_2m || '°C',
                hUnit: u.relative_humidity_2m || '%'
            };
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                select.selectedIndex = 0;
                box.innerHTML = PLACEHOLDER;
                resetBtn.hidden = true;
            });
        }

        select.addEventListener('change', async function () {
            var option = select.options[select.selectedIndex];
            var cityName = option.textContent.trim();
            var parts = select.value.split(',');
            var lat = parts[0], lon = parts[1];
            if (resetBtn) resetBtn.hidden = false;

            box.innerHTML =
                '<p class="weather__city">' + cityName + '</p>'
                + '<p class="weather__coord">위도 ' + lat + ' · 경도 ' + lon + '</p>'
                + '<p class="weather__loading">로딩 중… ⏳</p>';

            try {
                var w = await getWeather(lat, lon);
                box.innerHTML =
                    '<p class="weather__city">' + cityName + '</p>'
                    + '<p class="weather__coord">위도 ' + lat + ' · 경도 ' + lon + '</p>'
                    + '<div class="weather__now">'
                    +   '<div class="weather__metric"><span class="weather__value">' + w.temperature + w.tUnit + '</span><span class="weather__label">현재 기온</span></div>'
                    +   '<div class="weather__metric"><span class="weather__value">' + w.humidity + w.hUnit + '</span><span class="weather__label">습도</span></div>'
                    + '</div>';
            } catch (err) {
                box.innerHTML =
                    '<p class="weather__city">' + cityName + '</p>'
                    + '<p class="weather__coord">위도 ' + lat + ' · 경도 ' + lon + '</p>'
                    + '<p class="weather__error">⚠️ ' + err.message + '</p>';
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
