import "../scss/styles.scss";

import { getPopularSongs } from "./api";
import { playSong } from "./play";

const renderSongs = (songs) => {
  const songList = document.querySelector("#song-list");
  if (!songList) return;
  songList.innerHTML = "";

  songs.forEach((song) => {
    const li = document.createElement("li");
    li.innerText = `${song.title}`;
    li.setAttribute("data-video-id", song.videoId);
    songList.appendChild(li);
  });

  songList.addEventListener("click", (event) => {
    const videoId = event.target.getAttribute("data-video-id");
    if (videoId) {
      playSong(`https://www.youtube.com/watch?v=${videoId}`);
    }
  });
};

getPopularSongs().then((response) => {
  renderSongs(response.data);
});
