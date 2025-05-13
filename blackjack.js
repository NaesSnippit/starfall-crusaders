const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let wins = 0;
let losses = 0;
let credits = 1000;
let currentBet = 0;
let dealerCardHidden = true;
let history = [];

const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerTotal = document.getElementById('player-total');
const dealerTotal = document.getElementById('dealer-total');
const outcome = document.getElementById('outcome');
const record = document.getElementById('record');
const music = document.getElementById('bg-music');
const creditsDisplay = document.getElementById('credits-display');
const sessionHistory = document.getElementById('session-history');

document.getElementById('deal-btn').addEventListener('click', deal);
document.getElementById('hit-btn').addEventListener('click', hit);
document.getElementById('stand-btn').addEventListener('click', stand);

document.getElementById('settings-btn').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.remove('hidden');
});
document.getElementById('close-settings').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.add('hidden');
});
document.getElementById('info-btn').addEventListener('click', () => {
  document.getElementById('info-modal').classList.remove('hidden');
});
document.getElementById('close-info').addEventListener('click', () => {
  document.getElementById('info-modal').classList.add('hidden');
});

// Music and SFX volume handlers
document.getElementById('music-volume').addEventListener('input', (e) => {
  music.volume = parseFloat(e.target.value);
});
document.getElementById('sfx-volume').addEventListener('input', (e) => {
  // Hook up SFX later
});

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function calculateTotal(hand) {
  let total = 0;
  let aceCount = 0;
  for (let card of hand) {
    if (['J', 'Q', 'K'].includes(card.value)) {
      total += 10;
    } else if (card.value === 'A') {
      aceCount++;
      total += 11;
    } else {
      total += parseInt(card.value);
    }
  }

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
}

function deal() {
  const betInput = parseInt(document.getElementById('bet-input').value);
  if (isNaN(betInput) || betInput <= 0 || betInput > credits) {
    outcome.textContent = 'Invalid bet';
    return;
  }

  currentBet = betInput;
  credits -= currentBet;
  dealerCardHidden = true;
  createDeck();
  shuffleDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  document.getElementById('hit-btn').disabled = false;
  document.getElementById('stand-btn').disabled = false;
  outcome.textContent = '';
  displayCards();
  updateCredits();
}

function hit() {
  playerHand.push(deck.pop());
  displayCards();
  const total = calculateTotal(playerHand);
  if (total > 21) {
    losses++;
    endGame('You busted!');
  }
}

function stand() {
  dealerCardHidden = false;
  while (calculateTotal(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  const playerScore = calculateTotal(playerHand);
  const dealerScore = calculateTotal(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    wins++;
    credits += currentBet * 2;
    endGame('You win!');
  } else if (playerScore < dealerScore) {
    losses++;
    endGame('Diamond wins.');
  } else {
    credits += currentBet; // push
    endGame("It's a tie! Diamond still wins.");
  }
}

function endGame(message) {
  outcome.textContent = message;
  document.getElementById('hit-btn').disabled = true;
  document.getElementById('stand-btn').disabled = true;
  displayCards();
  updateRecord();
  updateCredits();
  updateHistory(message);
}

function updateRecord() {
  record.textContent = `Wins: ${wins} | Losses: ${losses}`;
}

function updateCredits() {
  creditsDisplay.textContent = `Credits: ${credits}`;
}

function updateHistory(result) {
  const entry = document.createElement('div');
  entry.className = 'history-entry';
  entry.textContent = `Bet ${currentBet} → ${result}`;
  sessionHistory.prepend(entry);
}

function displayCards() {
  playerCardsDiv.innerHTML = '';
  dealerCardsDiv.innerHTML = '';

  playerHand.forEach(card => {
    const cardElement = createCardElement(card);
    playerCardsDiv.appendChild(cardElement);
  });

  dealerHand.forEach((card, index) => {
    const cardElement = createCardElement(card, dealerCardHidden && index === 0);
    dealerCardsDiv.appendChild(cardElement);
  });

  playerTotal.textContent = `Total: ${calculateTotal(playerHand)}`;
  dealerTotal.textContent = `Total: ${
    dealerCardHidden ? '?' : calculateTotal(dealerHand)
  }`;
}

function createCardElement(card, hidden = false) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  if (hidden) {
    cardDiv.textContent = '🂠';
    cardDiv.style.background = 'linear-gradient(45deg, #290628, #450b3d)';
    return cardDiv;
  }

  const filename = `cards/${card.value}${card.suit}.png`;
  const img = new Image();
  img.src = filename;
  img.onload = () => {
    cardDiv.style.backgroundImage = `url(${filename})`;
    cardDiv.style.color = 'transparent';
  };
  img.onerror = () => {
    cardDiv.textContent = `${card.value}${card.suit}`;
  };
  return cardDiv;
}

// Fix for modal visibility closing
const closeModal = (modalId) => {
  document.getElementById(modalId).classList.add('hidden');
};

document.getElementById('close-settings').addEventListener('click', () => closeModal('settings-modal'));
document.getElementById('close-info').addEventListener('click', () => closeModal('info-modal'));
