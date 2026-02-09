console.log("🎵 Spotify Clone Loaded");

let currentSong = new Audio();
let songs = [];
let currFolder = "";

// helper to format song time
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// get songs from folder (you can update song names manually per playlist)
async function getSongs(folder) {
  currFolder = folder;

  // define songs per playlist (use your own names)
  const playlistData = {
    "songs/ncs": ["song1.m4a", "song2.m4a", "song3.m4a"],
    "songs/chill": ["vibe1.m4a", "vibe2.m4a"],
    "songs/party": ["beat1.m4a", "beat2.m4a", "beat3.m4a"],
  };

  songs = playlistData[folder] || [];

  // render song list
  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";
  songs.forEach((song) => {
    songUL.innerHTML += `
      <li>
        <img class="invert" width="34" src="img/music.svg" alt="">
        <div class="info">
          <div>${song}</div>
          <div>Artist</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  });

  // attach click to each song
  Array.from(document.querySelectorAll(".songList li")).forEach((li) => {
    li.addEventListener("click", () => {
      const songName = li.querySelector(".info div").innerText.trim();
      playMusic(songName);
    });
  });

  return songs;
}

// play music
function playMusic(track, pause = false) {
  currentSong.src = `${currFolder}/${track}`;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerText = decodeURI(track);
  document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

// display playlist albums (cards)
async function displayAlbums() {
  const cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  const albums = [
    {
      folder: "ncs",
      title: "NCS Playlist",
      description: "Electronic & energetic tracks",
      cover: "songs/ncs/cover.jpg",
    },
    {
      folder: "chill",
      title: "Chill Vibes",
      description: "Relax and unwind",
      cover: "songs/chill/cover.jpg",
    },
    {
      folder: "party",
      title: "Party Mix",
      description: "Upbeat hits for the night",
      cover: "songs/party/cover.jpg",
    },
  ];

  albums.forEach((album) => {
    cardContainer.innerHTML += `
      <div data-folder="songs/${album.folder}" class="card">
        <div class="play">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <img src="${album.cover}" alt="">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>`;
  });

  // load songs when album is clicked
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", async (e) => {
      const folder = e.currentTarget.dataset.folder;
      console.log("🎧 Loading songs from:", folder);
      await getSongs(folder);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  // load default playlist
  await getSongs("songs/ncs");
  playMusic(songs[0], true);
  await displayAlbums();

  // play/pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // update progress bar
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerText = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // seekbar click
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // previous/next buttons
  previous.addEventListener("click", () => {
    const index = songs.indexOf(currentSong.src.split("/").pop());
    if (index > 0) playMusic(songs[index - 1]);
  });

  next.addEventListener("click", () => {
    const index = songs.indexOf(currentSong.src.split("/").pop());
    if (index + 1 < songs.length) playMusic(songs[index + 1]);
  });

  // volume range
  document.querySelector(".range input").addEventListener("input", (e) => {
    currentSong.volume = e.target.value / 100;
    document.querySelector(".volume img").src =
      currentSong.volume === 0
        ? "img/mute.svg"
        : "img/volume.svg";
  });

  // mute/unmute icon
  document.querySelector(".volume img").addEventListener("click", (e) => {
    if (currentSong.volume > 0) {
      currentSong.volume = 0;
      e.target.src = "img/mute.svg";
      document.querySelector(".range input").value = 0;
    } else {
      currentSong.volume = 0.3;
      e.target.src = "img/volume.svg";
      document.querySelector(".range input").value = 30;
    }
  });
}

main();
