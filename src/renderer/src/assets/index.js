const profile_img = 'my_images/rihanna-anti.jpg'

// album images
const album0 = 'my_images/music-albums/Yeezus_album_cover.png'
const album1 = 'my_images/music-albums/d7jftn7-7792e018-bd14-4cec-b7d6-fd86117ef173.jpg'
const album2 = 'my_images/music-albums/desktop-wallpaper-eminem-kamikaze-eminem-album-cover-thumbnail.jpg'
const album3 = 'my_images/music-albums/donda-1068x1068-1-900x900.jpg'
const album4 = 'my_images/music-albums/eminem-26011-1920x1080.jpg'
const album5 = 'my_images/music-albums/eminem-rap-nadpis-chernyy-fon.jpg'
const album6 = 'my_images/music-albums/eminem-the-best-rapper-086skjct0fxtuy9h.jpg'
const album7 = 'my_images/music-albums/k1.jpg'
const album8 = 'my_images/music-albums/mybeautifuldarktwistedfantasy.png'
const album9 = 'my_images/music-albums/rafael-gobira-eminem-rap-god-wallpaper-by-rafaelgobira-d8eufgr.jpg'

// albums
const astroworld_path = 'songs/ASTROWORLD/'
const album_names = [
    '01. Travis Scott - STARGAZING.mp3',
    '03. Travis Scott - SICKO MODE.mp3',
    '04. Travis Scott - R.I.P. SCREW.mp3',
    '05. Travis Scott - STOP TRYING TO BE GOD.mp3',
    '06. Travis Scott - NO BYSTANDERS.mp3',
    '02. Travis Scott - CAROUSEL.mp3',
    '07. Travis Scott - SKELETONS.mp3',
    '08. Travis Scott - WAKE UP.mp3',
    '11. Travis Scott - ASTROTHUNDER.mp3',
    '15. Travis Scott - BUTTERFLY EFFECT.mp3'
];
const astroworld = album_names.map(song => {
    const title = song.split(' - ')[1].split('.mp3')[0];
    return { title, url: astroworld_path + song };
})

// music svgs
const music_svgs = {
    play: 'icons/circle-play.svg',
    pause: 'icons/circle-pause.svg',
    forward: 'icons/forward.svg',
    backward: 'icons/backward.svg',
    bars: 'icons/bars.svg',
    x_mark: 'icons/xmark.svg',
    rotate: 'icons/rotate.svg',
    shuffle: 'icons/shuffle.svg'
}

export { profile_img, album0, album1, album2, album3, album4,
    album5, album6, album7, album8, album9, music_svgs,
    astroworld}