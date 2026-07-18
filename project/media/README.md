# 미디어 폴더 가이드

파일은 **"어느 페이지에서 쓰는가(페이지별)"** 로 먼저 나누고, 한 페이지 안에서 쓰임이 여러 개면 **용도별 하위 폴더**로 다시 나눕니다.
새 파일을 넣을 때도 이 규칙만 따르면 됩니다. 파일 이름은 **영문/숫자**로 짓습니다(한글·공백은 경로 오류의 원인).

```
media/
├─ home/            홈(index.html) 4분할 메뉴 아이콘
│                   idx-profile.svg / idx-class.svg / idx-album.svg / idx-holiday.svg
│
├─ profile/         소개(myProfile.html)
│  ├─ food/         좋아하는 음식 영상 (burger·food2·coke1·coke2·strawberry1·strawberry2)
│  └─ words/        나를 설명하는 단어 플립카드 앞면 (word-run.jpg·word-smile.jpg)
│
├─ album/           앨범(myTrip.html)
│  ├─ covers/       4개 타일/배경 커버 (photo.jpg·music.jpg·video.jpg·etc.jpg)
│  └─ sample/       영상·오디오 자리표시 (video1.mp4·video1_poster.jpg·track1.mp3)
│
├─ photos/          사진 갤러리(myPhotos.html) — 도시별 사진 (paris1.jpg, jeju1.jpg …)
│
├─ videos/          영상 갤러리(myVideo.html) — 스톡 영상
│  └─ thumbs/       각 영상의 썸네일 이미지 (파일명은 영상과 동일, 확장자만 .jpg)
│
├─ music/           음악(myMusic.html) — 앨범별 폴더. 폴더 안에 커버(jpg) + 곡(mp3)
│  └─ <앨범명>/     예) "Starry Eyed/Starry Eyed.jpg" + 곡 mp3들
│
└─ holiday/         (현재 페이지에 연결 안 된 여행 소재 보관)
   ├─ photos/       trip-cebu / trip-hokkaido / trip-lijiang 사진
   └─ songs/        trip-song-*.wav
```

## 파일 추가 예시
- 소개 페이지에 음식 영상 추가 → `media/profile/food/` 에 넣고 myProfile.html의 `<source src="media/profile/food/파일.mp4">` 만 바꾸기
- 사진 갤러리에 도시 추가 → `media/photos/` 에 `도시이름1.jpg` 형식으로 넣기
- 음악 추가 → `media/music/새앨범/` 폴더 만들어 커버.jpg + 곡.mp3 넣기

## 규칙 요약
1. 페이지별 폴더 → 필요하면 용도별 하위 폴더
2. 파일명은 영문/숫자 (한글·공백 금지)
3. 썸네일은 원본과 같은 이름, `videos/thumbs/` 에
