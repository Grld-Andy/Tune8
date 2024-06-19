import { v1 } from "uuid"
import { PlaylistInterface, Song } from "../data"
import { L_crown, L_deep_thoughts, L_rumors,
    L_fight_back, L_greatest, L_im_not_worth_it,
    L_rare, L_fearless } from "./lyrics"

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
export const deep_thoughts : string = '/my_images/music_cover/deep_thoughts.jpg'
export const im_not_worth_it : string = '/my_images/music_cover/im_not_worth_it.jpg'
export const rare : string = '/my_images/music_cover/rare.jpg'
export const fight_back : string = '/my_images/music_cover/fight_back.jpg'
export const greatest : string = '/my_images/music_cover/greatest.jpg'
export const rumors : string = '/my_images/music_cover/rumors.jpg'

export const song1: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Crown',
            artist: 'Neffex',
            album: 'Fight Back: The Collection',
            year: 2018,
            genre: 'Hip-Hop/Rap'
        },
    },
    imageSrc: crown,
    duration: '03:55',
    isFavorite: false,
    src: '/tune 8/NEFFEX_Crown_Copyright_Free.m4a',
    lyrics: L_crown
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
    duration: '03:14',
    isFavorite: false,
    src: '/tune 8/Fearless-Lost_Sky.mp3',
    lyrics: L_fearless
}
const song3: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Deep Thoughts',
            artist: 'Neffex',
            album: 'Destiny: The Collection',
            year: 2019,
            genre: 'rap'
        },
    },
    imageSrc: deep_thoughts,
    duration: '03:05',
    isFavorite: false,
    src: '/tune 8/Deep Thoughts   NEFFEX.mp3',
    lyrics: L_deep_thoughts
}
const song4: Song = {
    id: v1(),
    tag: {
        tags: {
            title: `I'm Not Worth It`,
            artist: 'Neffex & ZAXX',
            album: `Neffex`,
            year: 2020,
            genre: 'rap'
        },
    },
    imageSrc: im_not_worth_it,
    duration: '03:12',
    isFavorite: false,
    src: '/tune 8/I m Not Worth It - Neffex.m4a',
    lyrics: L_im_not_worth_it
}
const song5: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Rare',
            artist: 'Neffex',
            album: 'CEO',
            year: 2023,
            genre: 'Rap'
        },
    },
    imageSrc: rare,
    duration: '03:55',
    isFavorite: false,
    src: '/tune 8/neffex-rare.m4a',
    lyrics: L_rare
}
const song6: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Fight Back',
            artist: 'Neffex',
            album: 'Fight Back: The Collection',
            year: 2018,
            genre: 'Hip-Hop/Rap'
        },
    },
    imageSrc: fight_back,
    duration: '03:20',
    isFavorite: false,
    src: '/tune 8/NEFFEX - Fight Back 6vfP_4u7zik.m4a',
    lyrics: L_fight_back
}
const song7: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Greatest',
            artist: 'Neffex',
            album: 'Fight Back: The Collection',
            year: 2018,
            genre: 'rap'
        },
    },
    imageSrc: greatest,
    duration: '02:56',
    isFavorite: false,
    src: '/tune 8/NEFFEX - Greatest.mp3',
    lyrics: L_greatest
}
const song8: Song = {
    id: v1(),
    tag: {
        tags: {
            title: 'Rumors',
            artist: 'Neffex',
            album: 'Neffex',
            year: 2017,
            genre: 'rap'
        },
    },
    imageSrc: rumors,
    duration: '03:26',
    isFavorite: false,
    src: '/tune 8/NEFFEX_-_Rumors(playmus.cc).mp3',
    lyrics: L_rumors
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

export const currentSongs: Song[] = [song1, song2, song3, song4, song5, song6, song7, song8]