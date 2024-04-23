
console.log('Lets write js')

let songs;

let currentSong = new Audio();

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

//this function will return all songs from our songs directory
async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/"); 
    let response = await a.text();
    // console.log(response);

    let div=document.createElement("div");
    div.innerHTML=response;
    let as = div.getElementsByTagName("a");

    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
        
    }
    return songs;
}

const playMusic =(track, pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src="/songs/" + track;
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function main(){

    //get the lists of all songs
    songs = await getSongs();
    playMusic(songs[0], true);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for(const song of songs){
        songUL.innerHTML=songUL.innerHTML+`
        <li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>Manisha</div>
            </div>
            <div class="playnow">
                <span>Play now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        </li>`;
    }

    //play the first songs
    // var audio = new Audio(songs[0]);
    // audio.play()

    // audio.addEventListener("loadeddata", () =>{
    //     console.log(audio.duration, audio.currentTime)
    // })

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            
        })
    })

    //Attach an event listener to play, next and prev
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg";
        }
        else{
            currentSong.pause()
            play.src="playsong.svg"
            
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/
        ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/ currentSong.duration)*100+"%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
    })

    //Add an event listener for hamburger
    document.querySelector(".ham").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0";
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-120%";
    })

     //Add an event listener to prev
     prev.addEventListener("click", ()=>{
        console.log("prev clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1]);
        }
    })

    //Add an event listener to next
    next.addEventListener("click", ()=>{
        currentSong.pause();
        console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
 
}
main()