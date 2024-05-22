import { profile_img, album0, album1, album2, album3, album4,
    album5, album6, album7, album8, album9 } from '../assets'

const profile = {
    name : 'Guest',
    img: profile_img,
    isLoggedIn: true,
    title: "SICKO MODE",
    album: "ASTROWORLD",
    artist: "Travis Scott",
    time: "3:27"
}

const alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
    'o','p','q','r','s','t','u','v','w','x','y','z']

const songs = [
    {
        title: "Hurricane(Reprise)",
        album: "Yeezus",
        img: album0,
        artist: "Kanye West",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Stan",
        album: "Marshall Mathers LP",
        img: album1,
        artist: "Eminem",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Venom",
        album: "Kamikaze",
        img: album2,
        artist: "Eminem",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Ok Ok",
        album: "Donda",
        img: album3,
        artist: "Kanye West",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "As the World Turns",
        album: "Slim Shady LP",
        img: album4,
        artist: "Eminem",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Hello",
        album: "Relapse",
        img: album5,
        artist: "Eminem",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "3 A.M.",
        album: "Revival",
        img: album6,
        artist: "Jay Z",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Stronger",
        album: "Graduation",
        img: album7,
        artist: "Kanye West",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Power",
        album: "My Beautiful Dark Twisted Fantasy",
        img: album8,
        artist: "Kanye West",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Zeus",
        album: "Music To Be Murdered By",
        img: album9,
        artist: "R Kelly",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    },
    {
        title: "Deperado",
        album: "ANTI",
        img: profile_img,
        artist: "Rihanna",
        time: `${((Math.floor(Math.random()*100))%4)+1}:${((Math.floor(Math.random()*100))%50)+10}`
    }
]

export { profile, songs, alphabets }