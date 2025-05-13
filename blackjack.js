const suits = ['H', 'D', 'C', 'S'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const playerCards = document.getElementById('player-cards');
const dealerCards = document.getElementById('dealer-cards');
const playerTotal = document.getElementById('player-total');
const dealerTotal = document.getElementById('dealer-total');
const outcome = document.getElementById('outcome');
const dialogue = document.getElementById('diamond-dialogue');
const record = document.getElementById('record');

const music = document.getElementById('bg-music');
const musicVolume = document.getElementById('music-volume');
const sfxVolume = document.getElementById('sfx-volume');

let deck = [];
let playerHand = [];
let dealerHand = [];

let wins = parseInt(localStorage.getItem('wins') || 0);
let losses = parseInt(localStorage.getItem('losses') || 0);

updateRecord();

document.getElementById('deal-btn').addEventListener('click', startGame);
document.getElementById('hit-btn').addEventListener('click', () => hit(playerHand, playerCards, playerTotal));
document.getElementById('stand-btn').addEventListener('click', stand);
document.getElementById('settings-btn').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.remove('hidden');
});
document.getElementById('close-settings').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.add('hidden');
});

musicVolume.addEventListener('input', () => {
  music.volume = musicVolume.value;
});

function startGame() {
  deck = shuffle(makeDeck());
  playerHand = [draw(), draw()];
  dealerHand = [draw(), draw()];

  updateUI();

  document.getElementById('hit-btn').disabled = false;
  document.getElementById('stand-btn').disabled = false;
  document.getElementById('deal-btn').disabled = true;

  setDialogue("Feeling lucky? Let's see...");
}

function draw() {
  return deck.pop();
}

function makeDeck() {
  return suits.flatMap(suit => ranks.map(rank => `${rank}${suit}`));
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function hit(hand, container, totalDisplay) {
  hand.push(draw());
  updateUI();
  let total = calcTotal(playerHand);

  if (total > 21) {
    endGame(false);
  } else {
    let taunts = [
      "Oof, getting warm there!",
      "You sure you’re not bad at this?",
      "That one looked painful."
    ];
    setDialogue(taunts[Math.floor(Math.random() * taunts.length)]);
  }
}

function stand() {
  while (calcTotal(dealerHand) < 17) {
    dealerHand.push(draw());
  }

  // Add scummy cheat logic
  if (Math.random() < 0.3 && calcTotal(dealerHand) < calcTotal(playerHand) && calcTotal(playerHand) <= 21) {
    dealerHand.push(draw());
    setDialogue("Oops! Slipped another card in. Teehee~");
  }

  updateUI();
  let playerScore = calcTotal(playerHand);
  let dealerScore = calcTotal(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    endGame(true);
  } else {
    endGame(false);
  }
}

function endGame(playerWins) {
  document.getElementById('hit-btn').disabled = true;
  document.getElementById('stand-btn').disabled = true;
  document.getElementById('deal-btn').disabled = false;

  if (playerWins) {
    outcome.textContent = "You win! Diamond pouts.";
    setDialogue("...I guess that one was legit.");
    wins++;
  } else {
    outcome.textContent = "You lose. Diamond grins.";
    let lines = [
      "Awww, too bad! ♡",
      "Maybe next time. Or not.",
      "That allowance slipping away?"
    ];
    setDialogue(lines[Math.floor(Math.random() * lines.length)]);
    losses++;
  }

  localStorage.setItem('wins', wins);
  localStorage.setItem('losses', losses);
  updateRecord();
}

function updateRecord() {
  record.textContent = `Wins: ${wins} | Losses: ${losses}`;
}

function calcTotal(hand) {
  let values = hand.map(card => {
    let rank = card.slice(0, -1);
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    if (rank === 'A') return 11;
    return parseInt(rank);
  });

  let total = values.reduce((a, b) => a + b, 0);
  while (total > 21 && values.includes(11)) {
    values[values.indexOf(11)] = 1;
    total = values.reduce((a, b) => a + b, 0);
  }
  return total;
}

function updateUI() {
  playerCards.innerHTML = "";
  dealerCards.innerHTML = "";

  playerHand.forEach(card => addCard(card, playerCards));
  dealerHand.forEach((card, i) => addCard(card, dealerCards, i === 0 && document.getElementById('deal-btn').disabled));

  playerTotal.textContent = "Total: " + calcTotal(playerHand);
  dealerTotal.textContent = "Total: " + (document.getElementById('deal-btn').disabled ? calcTotal(dealerHand) : "??");
}

function addCard(card, container, hidden = false) {
  const img = document.createElement('img');
  img.src = hidden ? "images/diablackjack/back.png" : `images/diablackjack/${card}.png`;
  img.alt = card;
  img.classList.add('card');
  img.style.height = '100px';
  container.appendChild(img);
}

function setDialogue(text) {
  dialogue.textContent = text;
}
