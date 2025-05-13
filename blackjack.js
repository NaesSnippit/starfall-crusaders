const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let wins = 0;
let losses = 0;

const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerTotal = document.getElementById('player-total');
const dealerTotal = document.getElementById('dealer-total');
const outcome = document.getElementById('outcome');
const record = document.getElementById('record');
const music = document.getElementById('bg-music');

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

// Volume sliders
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
  createDeck();
  shuffleDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  document.getElementById('hit-btn').disabled = false;
  document.getElementById('stand-btn').disabled = false;
  outcome.textContent = '';
  displayCards();
}

function hit() {
  playerHand.push(deck.pop());
  displayCards();
  const total = calculateTotal(playerHand);
  if (total > 21) {
    endGame('You busted!');
    losses++;
  }
}

function stand() {
  while (calculateTotal(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  const playerScore = calculateTotal(playerHand);
  const dealerScore = calculateTotal(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    endGame('You win!');
    wins++;
  } else if (playerScore < dealerScore) {
    endGame('Diamond wins.');
    losses++;
  } else {
    endGame("It's a tie! Diamond still wins.");
    losses++;
  }
}

function endGame(message) {
  outcome.textContent = message;
  document.getElementById('hit-btn').disabled = true;
  document.getElementById('stand-btn').disabled = true;
  displayCards();
  updateRecord();
}

function updateRecord() {
  record.textContent = `Wins: ${wins} | Losses: ${losses}`;
}

function displayCards() {
  playerCardsDiv.innerHTML = '';
  dealerCardsDiv.innerHTML = '';

  playerHand.forEach(card => {
    const cardElement = createCardElement(card);
    playerCardsDiv.appendChild(cardElement);
  });

  dealerHand.forEach(card => {
    const cardElement = createCardElement(card);
    dealerCardsDiv.appendChild(cardElement);
  });

  playerTotal.textContent = `Total: ${calculateTotal(playerHand)}`;
  dealerTotal.textContent = `Total: ${calculateTotal(dealerHand)}`;
}

function createCardElement(card) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
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
