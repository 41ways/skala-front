// ==========================================================================
// albums-data.js — 앨범/트랙 공용 데이터 (myMusic 페이지 + 미니 LP가 함께 사용)
// @주의 앨범 추가/수정은 여기 한 곳에서만
// ==========================================================================
window.SKALA_ALBUMS = [
    // @실제 앨범: Everything happens to me (media/music/Everything happens to me/) · 메인 화면 시그니처 곡
    { title: 'Everything happens to me', artist: 'Chet Baker', cover: 'media/music/Everything%20happens%20to%20me/Everyhting%20hanppens%20to%20me.jpg', tracks: [
        { name: 'Everything Happens to Me', dur: '6:47', src: 'media/music/Everything%20happens%20to%20me/Everything%20happens%20to%20me.mp3' } ] },
    // @실제 앨범: Jane & The Boy — Starry Eyed (media/music/Starry Eyed/)
    { title: 'Starry Eyed', artist: 'Jane & The Boy', cover: 'media/music/Starry%20Eyed/Starry%20Eyed.jpg', tracks: [
        { name: 'Starry Eyed',         dur: '3:06', src: 'media/music/Starry%20Eyed/Jane%20%20The%20Boy%20-%20Starry%20Eyed.mp3' },
        { name: 'Wonderstruck',        dur: '2:38', src: 'media/music/Starry%20Eyed/Jane%20%20The%20Boy%20-%20Wonderstruck.mp3' },
        { name: 'Miss You Missing Me', dur: '2:44', src: 'media/music/Starry%20Eyed/Jane%20%20The%20Boy%20-%20Miss%20You%20Missing%20Me.mp3' },
        { name: 'Save Myself',         dur: '3:19', src: 'media/music/Starry%20Eyed/Jane%20%20The%20Boy%20-%20Save%20Myself.mp3' },
        { name: 'Backwards',           dur: '3:05', src: 'media/music/Starry%20Eyed/Jane%20%20The%20Boy%20-%20Backwards.mp3' } ] },
    // @실제 앨범: FLAMEBOY — Echo (media/music/Echo/)
    { title: 'Echo', artist: 'FLAMEBOY', cover: 'media/music/Echo/Echo.jpg', tracks: [
        { name: 'Echo',      dur: '2:18', src: 'media/music/Echo/FLAMEBOY%20-%20Echo.mp3' },
        { name: 'DROP',      dur: '2:17', src: 'media/music/Echo/FLAMEBOY%20-%20DROP.mp3' },
        { name: 'Machine',   dur: '2:03', src: 'media/music/Echo/FLAMEBOY%20-%20Machine.mp3' },
        { name: 'Send It',   dur: '2:10', src: 'media/music/Echo/FLAMEBOY%20-%20Send%20It.mp3' },
        { name: 'Get Up Go', dur: '2:00', src: 'media/music/Echo/FLAMEBOY%20-%20Get%20Up%20Go.mp3' },
        { name: '1V1',       dur: '1:58', src: 'media/music/Echo/FLAMEBOY%20-%201V1.mp3' } ] },
    // @실제 앨범: Ziggy — Last Train to Nowhere (media/music/Last Train to Nowhere/)
    { title: 'Last Train to Nowhere', artist: 'Ziggy', cover: 'media/music/Last%20Train%20to%20Nowhere/Last%20Train%20to%20Nowhere.jpg', tracks: [
        { name: 'Last Train to Nowhere', dur: '2:37', src: 'media/music/Last%20Train%20to%20Nowhere/Ziggy%20-%20Last%20Train%20to%20Nowhere.mp3' },
        { name: 'Starlight Reflection',  dur: '2:43', src: 'media/music/Last%20Train%20to%20Nowhere/Ziggy%20-%20Starlight%20Reflection.mp3' },
        { name: 'Walk the Walk',         dur: '2:23', src: 'media/music/Last%20Train%20to%20Nowhere/Ziggy%20-%20Walk%20the%20Walk.mp3' } ] },
    // @실제 앨범: Yarin Primak — 5 to 9 (media/music/5 to 9/)
    { title: '5 to 9', artist: 'Yarin Primak', cover: 'media/music/5%20to%209/5%20to%209.jpg', tracks: [
        { name: '5 to 9',                  dur: '2:18', src: 'media/music/5%20to%209/Yarin%20Primak%20-%205%20to%209.mp3' },
        { name: '5 to 9 (No Lead Vocals)', dur: '2:18', src: 'media/music/5%20to%209/Yarin%20Primak%20-%205%20to%209%20-%20No%20Lead%20Vocals.mp3' } ] },
    // @실제 앨범: Paradise Husky — Electric Cantina (media/music/Electric Cantina/)
    { title: 'Electric Cantina', artist: 'Paradise Husky', cover: 'media/music/Electric%20Cantina/Electric%20Cantina.avif', tracks: [
        { name: 'Dr Funkstein',  dur: '2:50', src: 'media/music/Electric%20Cantina/Paradise%20Husky%20-%20Dr%20Funkstein.mp3' },
        { name: 'El Camión',     dur: '2:08', src: 'media/music/Electric%20Cantina/Paradise%20Husky%20-%20El%20Cami%C3%B3n.mp3' },
        { name: 'Gin and Tonic', dur: '1:52', src: 'media/music/Electric%20Cantina/Paradise%20Husky%20-%20Gin%20and%20Tonic.mp3' } ] },
    // @실제 앨범: Alex Hager — RUN (media/music/RUN/)
    { title: 'RUN', artist: 'Alex Hager', cover: 'media/music/RUN/RUN.jpg', tracks: [
        { name: 'Run',                dur: '2:44', src: 'media/music/RUN/Alex%20Hager%20-%20Run.mp3' },
        { name: 'Run (Instrumental)', dur: '2:44', src: 'media/music/RUN/Alex%20Hager%20-%20Run%20-%20Instrumental%20version.mp3' } ] },
    // @실제 앨범: messwave — lost in the right direction (media/music/lost in the right direction/)
    { title: 'lost in the right direction', artist: 'messwave', cover: 'media/music/lost%20in%20the%20right%20direction/lost%20in%20the%20right%20direction.jpeg', tracks: [
        { name: 'lost in the right direction',                dur: '2:47', src: 'media/music/lost%20in%20the%20right%20direction/messwave%20-%20lost%20in%20the%20right%20direction.mp3' },
        { name: 'lost in the right direction (Instrumental)', dur: '2:45', src: 'media/music/lost%20in%20the%20right%20direction/messwave%20-%20lost%20in%20the%20right%20direction%20-%20Instrumental%20version.mp3' } ] }
];
