// profile placeholder
export const profile : string = 'my_images/profile.jpg'

// music placeholder
export const music1 : string = 'placeholders/music1.jpg'
export const music2 : string = 'placeholders/music2.jpg'
export const music3 : string = 'placeholders/music3.jpg'
export const music4 : string = 'placeholders/music4.jpg'

// songs
interface Song {
    title:string,
    artist: string,
    album: string,
    image: string,
    time: string
}
const song1: Song = {title: 'Stronger than I was', artist: 'Eminem', album: 'The Marshall Mathers LP 2', image: music1, time: '03: 30'}
const song2: Song = {title: 'DNA', artist: 'Kendrick Lamar', album: 'DAMN', image: music2, time: '03: 30'}
const song3: Song = {title: 'Til Further Notice(Ft. 21 Savage & James Blake)', artist: 'Travis Scott', album: 'UTOPIA', image: music3, time: '03: 30'}
const song4: Song = {title: 'Claustrophobic', artist: 'Future', album: `We don't trust you`, image: music4, time: '03: 30'}
const song5: Song = {title: 'Amari', artist: 'J. Cole', album: 'The Off-Season', image: music1, time: '03: 30'}
const song6: Song = {title: 'Calling For You', artist: 'Drake', album: 'For All The Dogs', image: music2, time: '03: 30'}
const song7: Song = {title: 'Isis', artist: 'Joyner Lucas', album: 'ADHD', image: music3, time: '03: 30'}
const song8: Song = {title: 'Jesus Walks', artist: 'Kanye West', album: 'The College Dropout(Explicit)', image: music4, time: '03: 30'}
const song9: Song = {title: 'Day N Night', artist: 'Kid Cudi', album: 'Unknown Album', image: music1, time: '03: 30'}
const song10: Song = {title: 'Beautiful Pain', artist: 'Eminem', album: 'The Marshall Mathers LP 2', image: music2, time: '03: 30'}

export const songs: Song[] = [song1, song2, song3, song4, song5, song6, song7, song8, song9,song10]