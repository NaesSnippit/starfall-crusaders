const playerHand = document.getElementById("player-hand");
const dealerHand = document.getElementById("dealer-hand");
const playerTotalSpan = document.getElementById("player-total");
const dealerTotalSpan = document.getElementById("dealer-total");
const result = document.getElementById("result");

const dealButton = document.getElementById("deal-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

const dialogue = document.getElementById("diamond-dialogue");

const lofiMusic = document.getElementById("lofi-music");
const musicSlider = document.getElementById("music-volume");
const sfxSlider = document.getElementById("sfx-volume");

const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");

settingsToggle.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
});
musicSlider.addEventListener("input", () => {
  lofiMusic.volume = musicSlider.value;
});

// Game state
let deck = [], playerCards = [], dealerCards = [];

// Win/loss tracking
let wins = parseInt(localStorage.getItem("wins")) || 0;
let losses = parseInt(localStorage.getItem("losses")) || 0;

function updateDiamondDialogue() {
  const totalGames = wins + losses;
  const ratio = totalGames ? wins / totalGames : 0;

  if (totalGames < 3) {
    dialogue.textContent = "You're doing great! Kinda. Maybe.";
  } else if (ratio >= 0.7) {
    dialogue.textContent = "Are you... cheating?! No way. I'm watching you.";
  } else if (ratio >= 0.5) {
    dialogue.textContent = "Okay okay, you’re not terrible. Don’t let it go to your head.";
  } else if (ratio >= 0.3) {
    dialogue.textContent = "Aww. Rough luck. Want me to pretend I didn’t see that hand?";
  } else {
    dialogue.textContent = "You're bad at this. Like... impressively bad. But hey, thanks for the donations!";
  }
}

function createDeck() {
  const suits = ['C', 'D', 'H', 'S'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let newDeck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      newDeck.push({ rank, suit });
    }
  }
  return shuffle(newDeck);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function drawCard() {
  if (deck.length === 0) deck = createDeck();
  return deck.pop();
}

function getValue(hand) {
  let value = 0;
  let aces = 0;

  hand.forEach(card => {
    if (['J', 'Q', 'K'].includes(card.rank)) value += 10;
    else if (card.rank === 'A') {
      value += 11;
      aces++;
    } else {
      value += parseInt(card.rank);
    }
  });

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function renderHand(hand, element, revealAll = true) {
  element.innerHTML = '';
  hand.forEach((card, i) => {
    const img = document.createElement("img");
    if (i === 1 && !revealAll) {
      img.src = "images/diablackjack/back.png";
    } else {
      img.src = `images/diablackjack/${card.rank}${card.suit}.png`;
    }
    element.appendChild(img);
  });
}

function startGame() {
  deck = createDeck();
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];

  renderHand(playerCards, playerHand);
  renderHand(dealerCards, dealerHand, false);

  playerTotalSpan.textContent = getValue(playerCards);
  dealerTotalSpan.textContent = "??";

  result.textContent = "";
  hitButton.disabled = false;
  standButton.disabled = false;
}

function endGame(playerWins) {
  if (playerWins) {
    wins++;
    result.textContent = "You win! (somehow)";
  } else {
    losses++;
    result.textContent = "You lose. Diamond pockets your $10.";
  }
  localStorage.setItem("wins", wins);
  localStorage.setItem("losses", losses);
  updateDiamondDialogue();
  hitButton.disabled = true;
  standButton.disabled = true;
}

function diamondCheats() {
  const val = getValue(dealerCards);
  // 30% chance she cheats if losing
  if (val < 17 && Math.random() < 0.3) {
    dealerCards.push(drawCard());
  }
}

dealButton.addEventListener("click", () => {
  startGame();
});

hitButton.addEventListener("click", () => {
  playerCards.push(drawCard());
  renderHand(playerCards, playerHand);
  const val = getValue(playerCards);
  playerTotalSpan.textContent = val;

  if (val > 21) {
    renderHand(dealerCards, dealerHand, true);
    dealerTotalSpan.textContent = getValue(dealerCards);
    endGame(false);
  }
});

standButton.addEventListener("click", () => {
  renderHand(dealerCards, dealerHand, true);

  while (getValue(dealerCards) < 17) {
    dealerCards.push(drawCard());
    diamondCheats();
  }

  const playerVal = getValue(playerCards);
  const dealerVal = getValue(dealerCards);
  dealerTotalSpan.textContent = dealerVal;

  if (dealerVal > 21 || playerVal > dealerVal) {
    endGame(true);
  } else {
    endGame(false);
  }
});

updateDiamondDialogue();
