document.addEventListener('DOMContentLoaded', () => {
  const suits = ['H', 'D', 'C', 'S'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck, playerHand, dealerHand, wins = 0, losses = 0;

  const dealBtn = document.getElementById('deal-btn');
  const hitBtn = document.getElementById('hit-btn');
  const standBtn = document.getElementById('stand-btn');
  const bgMusic = document.getElementById('bg-music');
  const musicSlider = document.getElementById('music-volume');

  const dialogue = {
    sweet: ["Aw, tough luck! Want a sticker?", "You'll get me next time! Maybe."],
    snarky: ["Yikes, you're bad at this.", "Are you even trying?", "This is getting sad. For you."]
  };

  const getTotal = (hand) => {
    let total = 0, aces = 0;
    for (let card of hand) {
      let val = card.slice(0, -1);
      if (['J', 'Q', 'K'].includes(val)) total += 10;
      else if (val === 'A') { aces++; total += 11; }
      else total += parseInt(val);
    }
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
  };

  const shuffleDeck = () => {
    deck = suits.flatMap(s => ranks.map(r => r + s)).sort(() => Math.random() - 0.5);
  };

  const renderHand = (hand, containerId, hideFirst) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    hand.forEach((card, i) => {
      const img = document.createElement('img');
      img.src = hideFirst && i === 0 ? 'images/diablackjack/back.png' : `images/diablackjack/${card}.png`;
      img.style.height = '100px';
      container.appendChild(img);
    });
  };

  const updateUI = () => {
    document.getElementById('player-total').textContent = `Total: ${getTotal(playerHand)}`;
    const dealerTotalDisplay = dealBtn.disabled ? getTotal(dealerHand) : '??';
    document.getElementById('dealer-total').textContent = `Total: ${dealerTotalDisplay}`;
    document.getElementById('record').textContent = `Wins: ${wins} | Losses: ${losses}`;
  };

  const randomDialogue = () => {
    const totalLosses = losses - wins;
    const lines = totalLosses > 3 ? dialogue.snarky : dialogue.sweet;
    return lines[Math.floor(Math.random() * lines.length)];
  };

  const cheatIfLosing = () => {
    let dTotal = getTotal(dealerHand);
    let pTotal = getTotal(playerHand);

    if (dTotal < 17 || (dTotal < pTotal && dTotal < 21)) {
      dealerHand.push(deck.pop());
    }

    if (Math.random() < 0.2 && dTotal < pTotal) {
      dealerHand[0] = deck.pop();
    }
  };

  const endGame = () => {
    const pTotal = getTotal(playerHand);
    const dTotal = getTotal(dealerHand);
    let win = (pTotal <= 21 && (dTotal > 21 || pTotal > dTotal));

    document.getElementById('outcome').textContent = win
      ? "You win! Diamond scowls."
      : "You lose. Diamond snickers.";
    document.getElementById('diamond-dialogue').textContent = randomDialogue();
    win ? wins++ : losses++;

    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    updateUI();
  };

  dealBtn.onclick = () => {
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    renderHand(playerHand, 'player-cards');
    renderHand(dealerHand, 'dealer-cards', true);
    updateUI();
    document.getElementById('outcome').textContent = '';
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    document.getElementById('diamond-dialogue').textContent = "Good luck! You're gonna need it~";
  };

  hitBtn.onclick = () => {
    playerHand.push(deck.pop());
    renderHand(playerHand, 'player-cards');
    updateUI();
    if (getTotal(playerHand) > 21) endGame();
  };

  standBtn.onclick = () => {
    cheatIfLosing();
    renderHand(dealerHand, 'dealer-cards');
    updateUI();
    endGame();
  };

    // Modal Logic (Combined)
  const settingsBtn = document.getElementById('settings-btn');
  const infoBtn = document.getElementById('info-btn');
  const settingsModal = document.getElementById('settings-modal');
  const infoModal = document.getElementById('info-modal');
  const closeSettings = document.getElementById('close-settings');
  const closeInfo = document.getElementById('close-info');

  settingsBtn.onclick = () => settingsModal.classList.remove('hidden');
  infoBtn.onclick = () => infoModal.classList.remove('hidden');

  closeSettings.onclick = () => settingsModal.classList.add('hidden');
  closeInfo.onclick = () => infoModal.classList.add('hidden');

  window.onclick = (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
    if (e.target === infoModal) infoModal.classList.add('hidden');
  };
