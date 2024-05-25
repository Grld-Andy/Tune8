import { Song } from "../data"

// profile placeholder
export const profile : string = '/my_images/profile.jpg'

// music placeholder
export const music1 : string = '/placeholders/music1.jpg'
export const music2 : string = '/placeholders/music2.jpg'
export const music3 : string = '/placeholders/music3.jpg'
export const music4 : string = '/placeholders/music4.jpg'

export const song1: Song = {
    tag: {
        tags: {
            title: 'Stronger than I was',
            artist: 'Eminem',
            album: 'The Marshall Mathers LP 2',
            year: 2013,
        },
    },
    imageSrc: music1,
    duration: '03:30',
}
const song2: Song = {
    tag: {
        tags: {
            title: 'DNA',
            artist: 'Kendrick Lamar',
            album: 'DAMN',
            year: 2017,
        },
    },
    imageSrc: music2,
    duration: '03:30',
}
const song3: Song = {
    tag: {
        tags: {
            title: 'Til Further Notice(Ft. 21 Savage & James Blake)',
            artist: 'Travis Scott',
            album: 'UTOPIA',
            year: 2022,
        },
    },
    imageSrc: music3,
    duration: '03:30',
}
const song4: Song = {
    tag: {
        tags: {
            title: 'Claustrophobic',
            artist: 'Future',
            album: `We don't trust you`,
            year: 2023,
        },
    },
    imageSrc: music4,
    duration: '03:30',
}
const song5: Song = {
    tag: {
        tags: {
            title: 'Amari',
            artist: 'J. Cole',
            album: 'The Off-Season',
            year: 2021,
        },
    },
    imageSrc: music1,
    duration: '03:30',
}
const song6: Song = {
    tag: {
        tags: {
            title: 'Calling For You',
            artist: 'Drake',
            album: 'For All The Dogs',
            year: 2024,
        },
    },
    imageSrc: music2,
    duration: '03:30',
}
const song7: Song = {
    tag: {
        tags: {
            title: 'Isis',
            artist: 'Joyner Lucas',
            album: 'ADHD',
            year: 2019,
        },
    },
    imageSrc: music3,
    duration: '03:30',
}
const song8: Song = {
    tag: {
        tags: {
            title: 'Jesus Walks',
            artist: 'Kanye West',
            album: 'The College Dropout(Explicit)',
            year: 2004,
        },
    },
    imageSrc: music4,
    duration: '03:30',
}
const song9: Song = {
    tag: {
        tags: {
            title: 'Day N Night',
            artist: 'Kid Cudi',
            album: 'Unknown Album',
            year: 2009,
        },
    },
    imageSrc: music1,
    duration: '03:30',
}
const song10: Song = {
    tag: {
        tags: {
            title: 'Beautiful Pain',
            artist: 'Eminem',
            album: 'The Marshall Mathers LP 2',
            year: 2013,
        },
    },
    imageSrc: music2,
    duration: '03:30',
}
const song11: Song = {
    tag: {
        tags: {
            title: 'Hurricane',
            artist: 'Kanye West',
            album: 'Donda',
            year: 2019,
        },
    },
    imageSrc: music3,
    duration: '02:14',
}

export const songs: Song[] = [song1, song2, song3, song4, song5, song6, song7, song8, song9, song10, song11]