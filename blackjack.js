const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerWins = 0;
let dealerWins = 0;

const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerTotal = document.getElementById('player-total');
const dealerTotal = document.getElementById('dealer-total');
const outcomeDiv = document.getElementById('outcome');
const recordDiv = document.getElementById('record');
const dialogue = document.getElementById('diamond-dialogue');

const dealBtn = document.getElementById('deal-btn');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');

dealBtn.addEventListener('click', dealGame);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  shuffle(deck);
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateTotal(hand) {
  let total = 0;
  let aces = 0;
  for (let card of hand) {
    total += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function displayCards() {
  playerCardsDiv.innerHTML = '';
  dealerCardsDiv.innerHTML = '';
  playerHand.forEach(card => {
    playerCardsDiv.innerHTML += `<div class="card">${card.value}${card.suit}</div>`;
  });
  dealerHand.forEach(card => {
    dealerCardsDiv.innerHTML += `<div class="card">${card.value}${card.suit}</div>`;
  });
  playerTotal.textContent = `Total: ${calculateTotal(playerHand)}`;
  dealerTotal.textContent = `Total: ${calculateTotal(dealerHand)}`;
}

function dealGame() {
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  outcomeDiv.textContent = '';
  dialogue.textContent = "Good luck~ I'm feeling lucky today!";
  displayCards();

  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
}

function hit() {
  playerHand.push(deck.pop());
  displayCards();
  let total = calculateTotal(playerHand);
  if (total > 21) {
    endGame("You busted! I win. 🎻");
  } else {
    dialogue.textContent = "Hit me? Bold choice!";
  }
}

function stand() {
  hitBtn.disabled = true;
  standBtn.disabled = true;

  // Diamond "cheating" logic: 25% chance to redraw if she would lose
  while (calculateTotal(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  let dealerScore = calculateTotal(dealerHand);
  let playerScore = calculateTotal(playerHand);

  if (dealerScore < playerScore && Math.random() < 0.25) {
    dialogue.textContent = "Hmm... let me just reshuffle a bit~";
    dealerHand.push(deck.pop());
    dealerScore = calculateTotal(dealerHand);
  }

  displayCards();

  if (dealerScore > 21) {
    endGame("Dealer busted! You win. 🎉");
  } else if (dealerScore > playerScore) {
    endGame("Diamond wins again! 💎");
  } else if (dealerScore < playerScore) {
    endGame("You win! Maybe I’ll get a cheaper violin...");
  } else {
    endGame("It's a tie... but ties go to Diamond!");
  }
}

function endGame(message) {
  outcomeDiv.textContent = message;
  let playerScore = calculateTotal(playerHand);
  let dealerScore = calculateTotal(dealerHand);

  if (message.includes("You win")) {
    playerWins++;
    dialogue.textContent = "No way... you actually won?";
  } else {
    dealerWins++;
    dialogue.textContent = "Yay~! One step closer to that recital!";
  }

  recordDiv.textContent = `Wins: ${playerWins} | Losses: ${dealerWins}`;
  dealBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
}
