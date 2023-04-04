import "../scss/styles.scss";

import { getPopularSongs } from "./api";

const renderSongs = (songs) => {
  const songList = document.querySelector("#song-list");
  if (!songList) return;
  songList.innerHTML = "";

  songs.forEach((song) => {
    const li = document.createElement("li");
    li.innerText = `${song.title}`;
    songList.appendChild(li);
  });
};

getPopularSongs().then((response) => {
  renderSongs(response.data);
});
