let player;
const audioPlayer = document.querySelector("#audio-player");

const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");
const stopButton = document.querySelector("#stop-button");
const volumeSlider = document.querySelector("#volume-slider");

const getVideoId = (url) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=)?(.+)/
  );
  return match ? match[1] : null;
};

export const playSong = (url) => {
  const videoId = getVideoId(url);
  if (!videoId) return;

  if (player) {
    player.loadVideoById(videoId);
  } else {
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => {
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            pauseAudio();
          }
        },
      },
    });
  }
};

export const pauseSong = () => {
  if (player) {
    player.pauseVideo();
    pauseAudio();
  }
};

export const stopSong = () => {
  if (player) {
    player.stopVideo();
    pauseAudio();
  }
};

export const setVolume = (volume) => {
  if (player) {
    player.setVolume(volume);
    audioPlayer.volume = volume;
  }
};

const pauseAudio = () => {
  if (!audioPlayer.paused) {
    audioPlayer.pause();
  }
};

playButton.addEventListener("click", () => {
  playSong("https://www.youtube.com/watch?v=WCCovrKvAtU");
});

pauseButton.addEventListener("click", () => {
  pauseSong();
});

stopButton.addEventListener("click", () => {
  stopSong();
});
volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value;
  setVolume(volume);
});
