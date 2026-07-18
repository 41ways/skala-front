// ==========================================================================
// realtimeInfo.js — 화면(DOM) 담당 모듈  <script type="module">
// @과제 8. JavaScript 심화 · 실시간 날씨 (DOM/이벤트 → 비동기 → 모듈분리)
// weatherAPI.js 로부터 getWeather 를 import 하여 처리한다.
// ==========================================================================
import { getWeather } from './weatherAPI.js';

// 모듈이 정상 실행됐음을 표시 → 폴백(weatherFallback.js)이 중복 동작하지 않게 함
window.__weatherReady = true;

const select = document.getElementById('citySelect');
const box = document.getElementById('weatherBox');
const resetBtn = document.getElementById('weatherReset');
const PLACEHOLDER = '<p class="info-card__placeholder">도시를 선택하면 날씨가 표시됩니다.</p>';

// @동작 닫기: 날씨 표시를 지우고 선택을 초기화
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (select) select.selectedIndex = 0;
        if (box) box.innerHTML = PLACEHOLDER;
        resetBtn.hidden = true;
    });
}

if (select && box) {
    // @동작 사용자가 도시를 바꿀 때마다(change 이벤트) 실행
    select.addEventListener('change', async () => {
        const option = select.options[select.selectedIndex];
        const cityName = option.textContent.trim();
        const [lat, lon] = select.value.split(',');
        if (resetBtn) resetBtn.hidden = false;   // 도시 선택되면 닫기 버튼 노출

        // 1) 먼저 도시 이름과 위도/경도를 DOM(innerHTML)으로 즉시 표시
        box.innerHTML = `
            <p class="weather__city">${cityName}</p>
            <p class="weather__coord">위도 ${lat} · 경도 ${lon}</p>
            <p class="weather__loading">로딩 중… ⏳</p>
        `;

        // 2) 비동기로 실제 날씨를 받아와 온도·습도를 그린다.
        try {
            const w = await getWeather(lat, lon);
            box.innerHTML = `
                <p class="weather__city">${cityName}</p>
                <p class="weather__coord">위도 ${lat} · 경도 ${lon}</p>
                <div class="weather__now">
                    <div class="weather__metric">
                        <span class="weather__value">${w.temperature}${w.units.temperature}</span>
                        <span class="weather__label">현재 기온</span>
                    </div>
                    <div class="weather__metric">
                        <span class="weather__value">${w.humidity}${w.units.humidity}</span>
                        <span class="weather__label">습도</span>
                    </div>
                </div>
            `;
        } catch (err) {
            box.innerHTML = `
                <p class="weather__city">${cityName}</p>
                <p class="weather__coord">위도 ${lat} · 경도 ${lon}</p>
                <p class="weather__error">⚠️ ${err.message}</p>
            `;
        }
    });
}
