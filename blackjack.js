<script>
document.addEventListener('DOMContentLoaded', () => {
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

  // DOM elements
  const playerCardsDiv = document.getElementById('player-cards');
  const dealerCardsDiv = document.getElementById('dealer-cards');
  const playerTotal = document.getElementById('player-total');
  const dealerTotal = document.getElementById('dealer-total');
  const outcome = document.getElementById('outcome');
  const record = document.getElementById('record');
  const music = document.getElementById('bg-music');
  const creditsDisplay = document.getElementById('credits-display');
  const sessionHistory = document.getElementById('session-history');
  const betInput = document.getElementById('bet-input');

  const dealBtn = document.getElementById('deal-btn');
  const hitBtn = document.getElementById('hit-btn');
  const standBtn = document.getElementById('stand-btn');

  // Button listeners
  dealBtn.addEventListener('click', deal);
  hitBtn.addEventListener('click', hit);
  standBtn.addEventListener('click', stand);

  // Modal controls
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

  document.getElementById('music-volume').addEventListener('input', (e) => {
    music.volume = parseFloat(e.target.value);
  });

  // Game Setup
  function createDeck() {
    deck = [];
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }
  }

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function getCardValue(card) {
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
  }

  function calculateHandValue(hand) {
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

  function renderHand(hand, container, hideFirstCard = false) {
    container.innerHTML = '';
    hand.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.innerHTML = (index === 0 && hideFirstCard) ? '🂠' : `${card.value}${card.suit}`;
      container.appendChild(cardEl);
    });
  }

  function updateDisplay() {
    renderHand(playerHand, playerCardsDiv);
    renderHand(dealerHand, dealerCardsDiv, dealerCardHidden);
    playerTotal.textContent = `Player Total: ${calculateHandValue(playerHand)}`;
    dealerTotal.textContent = dealerCardHidden ? `Dealer Total: ?` : `Dealer Total: ${calculateHandValue(dealerHand)}`;
    creditsDisplay.textContent = `Credits: ${credits}`;
    record.textContent = `Wins: ${wins} | Losses: ${losses}`;
  }

  function deal() {
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0 || bet > credits) {
      alert("Enter a valid bet within your credits.");
      return;
    }

    currentBet = bet;
    createDeck();
    shuffleDeck();

    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    dealerCardHidden = true;
    outcome.textContent = '';

    hitBtn.disabled = false;
    standBtn.disabled = false;
    dealBtn.disabled = true;

    updateDisplay();
  }

  function hit() {
    if (!deck.length) return alert("No cards left in the deck!");
    playerHand.push(deck.pop());
    updateDisplay();

    if (calculateHandValue(playerHand) > 21) {
      outcome.textContent = 'You busted!';
      losses++;
      credits -= currentBet;
      endRound();
    }
  }

  function stand() {
    dealerCardHidden = false;
    while (calculateHandValue(dealerHand) < 17) {
      if (!deck.length) break; // prevent infinite loop
      dealerHand.push(deck.pop());
    }

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (dealerValue > 21 || playerValue > dealerValue) {
      outcome.textContent = 'You win!';
      wins++;
      credits += currentBet;
    } else if (dealerValue === playerValue) {
      outcome.textContent = 'Push!';
    } else {
      outcome.textContent = 'Dealer wins!';
      losses++;
      credits -= currentBet;
    }

    endRound();
  }

  function endRound() {
    updateDisplay();
    updateHistory();
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false;
  }

  function updateHistory() {
    const result = outcome.textContent;
    history.push(result);
    sessionHistory.innerHTML = history.slice(-5).map(res => `<li>${res}</li>`).join('');
  }

  // Disable gameplay buttons initially
  hitBtn.disabled = true;
  standBtn.disabled = true;
});
</script>
