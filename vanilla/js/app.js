import Store from "./store.js";
import View from "./view.js";

// Our players "config" - defines icons, colors, name, etc.
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
    character: null,
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
    character: null,
  },
];

function handleBackgroundMusic() {
  const bgMusic = document.getElementById("bg-music");
  const muteBtn = document.getElementById("mute-btn");
  const playBtn = document.getElementById("play-btn");
  const volumeSlider = document.getElementById("volume-slider");

  playBtn.addEventListener("click", () => {
    bgMusic.play();
  });

  volumeSlider.addEventListener("input", () => {
    bgMusic.volume = volumeSlider.value;
  });

  muteBtn.addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    if (bgMusic.muted) {
      muteBtn.textContent = "Unmute";
    } else {
      muteBtn.textContent = "Mute";
    }
  });
}

function setPlayer1Character(character) {
  players[0].character = character;
}

function setPlayer2Character(character) {
  players[1].character = character;
}

function playSound(soundId) {
  const sound = document.getElementById(soundId);
  sound.currentTime = 0;
  sound.play();
}

function playCharacterSound(character) {
  console.log(character);
  const soundId = character.toLowerCase().replace(" ", "-") + "-sound";
  playSound(soundId);
}

function init() {
  handleBackgroundMusic();
  const gameGrid = document.querySelector('[data-id="grid"]');
  const footer = document.querySelector('[data-id="footer"]');
  const characterSelectionModal = document.querySelector(
    '[data-id="character-selection-modal"]'
  );
  const characterImages = document.querySelectorAll(".character-image");
  const playerTurnText = document.getElementById("player-turn");

  let player1Character = null;
  let player2Character = null;

  characterImages.forEach((img) => {
    img.addEventListener("click", (event) => {
      const character = event.target.dataset.character;
      if (!player1Character) {
        player1Character = character;
        event.target.classList.add("selected");
        playerTurnText.textContent = "Player 2, choose your character";
      } else if (!player2Character) {
        player2Character = character;
        event.target.classList.add("selected");
        setTimeout(() => {
          characterSelectionModal.classList.add("hidden");
          gameGrid.classList.remove("hidden");
          footer.classList.remove("hidden");
          playSound("game-start-sound");
          setPlayer1Character(player1Character);
          setPlayer2Character(player2Character);
        }, 1000);
      }
    });
  });

  Array.from(
    document.getElementsByClassName("character-image-container")
  ).forEach((container) => {
    container.addEventListener("click", (event) => {
      console.log(
        event.currentTarget.querySelector("img").getAttribute("data-character")
      );
      const selectedCharacter = event.currentTarget
        .querySelector("img")
        .getAttribute("data-character");
      console.log(selectedCharacter);
      playCharacterSound(selectedCharacter);
    });
  });

  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });

  window.addEventListener("storage", () => {
    console.log("State changed from another tab");
    view.render(store.game, store.stats);
  });

  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    store.playerMove(+square.id);
  });
}

window.addEventListener("load", init);
