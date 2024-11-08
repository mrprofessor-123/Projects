console.log("Let's write JavaScript");
let currentSong = new Audio();

// Convert seconds to minutes:seconds format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Fetch the list of songs from the server
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            // Remove unwanted parts and decode URI components
            songs.push(decodeURIComponent(element.href.split("_320_")[0].trim()));
        }
    }
    return songs;
}

// Play music from the given track name
const playMusic = (track, pause = false) => {
    const sanitizedTrack = track.trim();

    // Set the audio source to the corrected URL
    currentSong.src = `/songs/${encodeURIComponent(sanitizedTrack)}`;

    if (!pause) {
        currentSong.play()
            .catch(error => console.error("Error playing audio:", error));
        play.src = "pause.svg";
    }

    document.querySelector(".song_info").innerHTML = sanitizedTrack;
    document.querySelector(".song_time").innerHTML = "00:00 / 00:00";
}

async function main() {
    // Get the list of all songs
    let songs = await getSongs();
    playMusic(songs[0].replace("http://127.0.0.1:3000/songs/", " "), true);

    // Populate the song list in the UI
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML += `<li><img src="music.svg" alt="music_icon" class="invert">
                                <div class="info">
                                    <div class="song_name">${song.replaceAll("http://127.0.0.1:3000/songs/", " ")}</div>
                                    <div class="song_artist">Prashant</div>
                                </div>
                                <div class="playnow">
                                    <span>playnow</span>
                                    <img src="play.svg" class="invert" alt="">
                                </div>
                            </li>`;
    }

    // Attach an event listener to each song item in the list
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let trackName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log("Playing song:", trackName);
            playMusic(trackName);
        });
    });

    // Attach an event listener to the play button for toggling play/pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    // Listen for time updates to update the song's progress
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song_time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%"
    });
    // add an event_listner to seek bar

    document.querySelector(".seekbar").addEventListener("click",e=>{
     document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%"
    })
}

main();
