import { v1 } from "uuid"
import { PlaylistInterface, Song } from "../data"

// profile placeholder
export const profile : string = '/my_images/profile.jpg'

export const image1 : string = '/placeholders/music1.jpg'
export const image2 : string = '/placeholders/music2.jpg'
export const image3 : string = '/placeholders/music3.jpg'
export const image4 : string = '/placeholders/music4.jpg'
export const placeholderSongImages: Array<string> = [image1, image2, image3, image4]

// music placeholder
export const crown : string = '/my_images/music_cover/crown.jpg'
export const fearless : string = '/my_images/music_cover/fearless.jpg'
export const giants : string = '/my_images/music_cover/giants.jpg'
export const headspace : string = '/my_images/music_cover/headspace.jpg'
export const kami : string = '/my_images/music_cover/kami.jpg'
export const rare : string = '/my_images/music_cover/rare.jpg'
export const light_of_the_sun : string = '/my_images/music_cover/light_of_the_sun.jpg'
export const the_search : string = '/my_images/music_cover/the_search.jpg'
export const when_i_grow_up : string = '/my_images/music_cover/when_i_grow_up.jpg'

export const songPaths = [
    '/tune8/Deep Thoughts   NEFFEX.mp3',
    '/tune8/Fearless-Lost_Sky.mp3',
    '/tune8/HEADSPACE FT. POORSTACY (feat. POORSTACY) - Fame on Fire.m4a',
    '/tune8/I m Not Worth It - Neffex.m4a',
    '/tune8/NEFFEX - Fight Back 6vfP_4u7zik.m4a',
    '/tune8/NEFFEX - Greatest.mp3',
    '/tune8/NEFFEX_-_Rumors(playmus.cc).mp3',
    '/tune8/NEFFEX_Crown_Copyright_Free.m4a',
    '/tune8/neffex-rare.m4a',
    '/tune8/NEFFEX-We_Could_Do_It_All.mp3'
    ]
export const song1: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Crown',
            artist: 'Neffex',
            album: 'Neffex 1',
            year: 2013,
            genre: 'rap'
        },
    },
    imageSrc: crown,
    duration: '02:17',
    isFavorite: false,
    src: './public/tune 8/NEFFEX_Crown_Copyright_Free.m4a'
}
const song2: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Fearless',
            artist: 'Lost Sky',
            album: 'Lost',
            year: 2017,
            genre: 'rap'
        },
    },
    imageSrc: fearless,
    duration: '02:48',
    isFavorite: false,
    src: './public/tune 8/Fearless-Lost_Sky.mp3'
}
const song3: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Giants',
            artist: 'True Damage',
            album: 'League of Legends',
            year: 2022,
            genre: 'rap'
        },
    },
    imageSrc: giants,
    duration: '03:30',
    isFavorite: false,
    src: './public/tune 8/League Of Legends (ft. Becky G, Keke Palmer, SOYEON, DUCKWRT.mp3'
}
const song4: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Kami',
            artist: 'Rustage',
            album: `Rustage 1`,
            year: 2023,
            genre: 'rap'
        },
    },
    imageSrc: kami,
    duration: '03:30',
    isFavorite: false,
    src: './public/tune 8/Rustage - Kami.m4a'
}
const song5: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Rare',
            artist: 'Neffex',
            album: '2 Neffex',
            year: 2021,
            genre: 'rap'
        },
    },
    imageSrc: rare,
    duration: '02:30',
    isFavorite: false,
    src: './public/tune 8/neffex-rare.m4a'
}
const song6: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Light of the Sun',
            artist: 'Rustage',
            album: 'Rustage 1',
            year: 2023,
            genre: 'rap'
        },
    },
    imageSrc: light_of_the_sun,
    duration: '03:06',
    isFavorite: false,
    src: './public/tune 8/rustage-sun-wukong-rap-light-of-the-sun-rustage-ft-johnald.m4a'
}
const song7: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'The Search',
            artist: 'NF',
            album: 'The Search Tour',
            year: 2019,
            genre: 'rap'
        },
    },
    imageSrc: the_search,
    duration: '03:30',
    isFavorite: false,
    src: './public/tune 8/The search.mp3'
}
const song8: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'When I Grow Up',
            artist: 'NF',
            album: 'The Search Tour',
            year: 2019,
            genre: 'rap'
        },
    },
    imageSrc: when_i_grow_up,
    duration: '02:00',
    isFavorite: false,
    src: './public/tune 8/when i grow up.mp3'
}
const song9: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Headspace',
            artist: 'Fame on Fire',
            album: 'Flame',
            year: 2019,
            genre: 'rap'
        },
    },
    imageSrc: headspace,
    duration: '02:00',
    isFavorite: false,
    src: './public/tune 8/HEADSPACE FT. POORSTACY (feat. POORSTACY) - Fame on Fire.m4a'
}
const playlist1: PlaylistInterface = {
    name: 'random_1',
    songs: [song1, song2, song3, song4]
}
const playlist2: PlaylistInterface = {
    name: '1st playlist',
    songs: [song7]
}
const playlist3: PlaylistInterface = {
    name: 'Some_songs',
    songs: [song2, song5]
}
export const currentPlaylists: Array<PlaylistInterface> = [playlist1, playlist2, playlist3]

export const currentSongs: Song[] = [song1, song2, song3, song4, song5, song6, song7, song8, song9]