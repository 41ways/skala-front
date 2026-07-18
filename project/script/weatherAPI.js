// ==========================================================================
// weatherAPI.js — 데이터 담당 모듈
// @과제 8. JavaScript 심화 · 실시간 날씨(모듈분리)
// Open-Meteo 무료 API에서 현재 온도/습도를 비동기로 가져와 반환한다.
// ==========================================================================

// @동작 fetch + async/await 로 Open-Meteo 서버에 날씨 데이터를 요청한다.
export async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
              + `&current=temperature_2m,relative_humidity_2m`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('날씨 데이터를 불러오지 못했습니다. (' + res.status + ')');

    const data = await res.json();
    const cur = data.current || {};
    // @반환 화면(realtimeInfo.js)이 그리기 좋은 형태로 정리해서 넘긴다.
    return {
        temperature: cur.temperature_2m,          // 섭씨 온도
        humidity: cur.relative_humidity_2m,       // 상대 습도(%)
        units: {
            temperature: (data.current_units && data.current_units.temperature_2m) || '°C',
            humidity: (data.current_units && data.current_units.relative_humidity_2m) || '%',
        },
    };
}
