let lyricsShow = false;

function showNowPlaying(){
    const playBar = document.getElementsByClassName('now-playing')
    const overlay = document.getElementsByClassName('overlay')
    const body = document.getElementsByTagName('body')[0]
    body.style.overflow = 'hidden'
    playBar[0].style.right = "0"
    overlay[0].style.display = "block"
    overlay[0].style.opacity = "1"
}
function hideNowPlaying(){
    hideLyrics()
    const playBar = document.getElementsByClassName('now-playing')
    const overlay = document.getElementsByClassName('overlay')
    const body = document.getElementsByTagName('body')[0]
    body.style.overflow = 'scroll'
    playBar[0].style.right = "-500px"
    overlay[0].style.display = "none"
    overlay[0].style.opacity = "0"
}
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
function hideLyrics(){
    const playBar = document.getElementsByClassName('now-playing')[0]
    const lyrics_container = document.getElementsByClassName('lyrics_container')[0]
    const disk = document.querySelector('.disk img')
    if(disk){
        disk.style.width = '180px'
        disk.style.height = '180px'
    }
    playBar.style.display = "flex"
    playBar.style.width = "350px"
    playBar.style.right = "0"
    playBar.style.boxShadow = "-5px 0 10px rgba(0,0,0,0.2)"
    lyrics_container.style.display = "none"
    console.log("hide lyrics")
    lyricsShow = false
}
function showLyrics(){
    let width = window.innerWidth <= 700 ? "70px" : "200px"
    const playBar = document.getElementsByClassName('now-playing')[0]
    const lyrics_container = document.getElementsByClassName('lyrics_container')[0]
    const disk = document.querySelector('.disk img')
    if(disk){
        disk.style.width = '80px'
        disk.style.height = '80px'
    }
    playBar.style.display = "grid"
    playBar.style.width = `calc(100% - ${width})`
    playBar.style.right = `-calc(100% - ${width})`
    playBar.style.boxShadow = "none"
    lyrics_container.style.display = "flex"
    lyricsShow = true
}
function sliceText(text, maxLength = 10){
    if(text.length > maxLength){
        let final = `${text.slice(0, maxLength)}...`
        return final
    }else{
        return text
    }
}
function writeTime(time){
    if(time < 10){
        return `0${time}`
    }
    return time
}
function shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
window.addEventListener("keyup", e => {
        const keyPressed = e.key
        if(keyPressed === "MediaTrackNext"){
            console.log("Next song")
        }else if(keyPressed === "MediaTrackPrevious"){
            console.log("Previous song")
        }else if(keyPressed === " "){
            e.preventDefault()
            console.log("Pause song")
        }
    }
)
window.addEventListener("resize", e => {
    if(lyricsShow){
        let width = window.innerWidth <= 700 ? "70px" : "200px"
        const playBar = document.getElementsByClassName('now-playing')[0]
        playBar.style.transition = "none"
        playBar.style.width = `calc(100% - ${width})`
        playBar.style.right = `-calc(100% - ${width})`
        playBar.style.transition = ".3s"
    }
})