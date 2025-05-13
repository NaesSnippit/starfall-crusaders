const playerHand = document.getElementById("player-hand");
const dealerHand = document.getElementById("dealer-hand");
const result = document.getElementById("result");

const dealButton = document.getElementById("deal-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

const lofiMusic = document.getElementById("lofi-music");
const musicSlider = document.getElementById("music-volume");
const sfxSlider = document.getElementById("sfx-volume");
const menuToggle = document.getElementById("menu-toggle");
const menuPanel = document.getElementById("menu-panel");

menuToggle.addEventListener("click", () => {
  menuPanel.classList.toggle("hidden");
});

musicSlider.addEventListener("input", () => {
  lofiMusic.volume = musicSlider.value;
});

// Placeholder card logic
function drawCardImg(card) {
  const img = document.createElement("img");
  img.src = `images/diablackjack/${card}.png`;
  return img;
}

function drawRandomCard() {
  const suits = ['C', 'D', 'H', 'S'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  return ranks[Math.floor(Math.random() * ranks.length)] + suits[Math.floor(Math.random() * suits.length)];
}

function startGame() {
  playerHand.innerHTML = "";
  dealerHand.innerHTML = "";
  result.textContent = "";
  hitButton.disabled = false;
  standButton.disabled = false;

  const playerCards = [drawRandomCard(), drawRandomCard()];
  const dealerCards = [drawRandomCard(), drawRandomCard()];

  playerCards.forEach(card => playerHand.appendChild(drawCardImg(card)));
  dealerHand.appendChild(drawCardImg(dealerCards[0]));
  dealerHand.appendChild(drawCardImg("back")); // facedown

  // Basic sound effect example
  const dealSound = new Audio("audio/card-flip.mp3");
  dealSound.volume = sfxSlider.value;
  dealSound.play();
}

dealButton.addEventListener("click", startGame);
