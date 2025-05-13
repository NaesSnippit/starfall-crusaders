(() => {
  const suits = ['H', 'D', 'C', 'S'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck, playerHand, dealerHand, wins = 0, losses = 0;

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
    const reveal = document.getElementById('deal-btn').disabled === true ? '??' : getTotal(dealerHand);
    document.getElementById('dealer-total').textContent = `Total: ${reveal}`;
    document.getElementById('record').textContent = `Wins: ${wins} | Losses: ${losses}`;
  };

  const randomDialogue = () => {
    const totalLosses = losses - wins;
    const d = totalLosses > 3 ? dialogue.snarky : dialogue.sweet;
    return d[Math.floor(Math.random() * d.length)];
  };

  const cheatIfLosing = () => {
    let dTotal = getTotal(dealerHand);
    let pTotal = getTotal(playerHand);

    if (dTotal < 17 || (dTotal < pTotal && dTotal < 21)) {
      dealerHand.push(deck.pop());
    }

    // Very rare — card swap
    if (Math.random() < 0.2 && dTotal < pTotal) {
      dealerHand[0] = deck.pop();
    }
  };

  const endGame = () => {
    const pTotal = getTotal(playerHand);
    const dTotal = getTotal(dealerHand);
    let win;

    if (pTotal > 21) win = false;
    else if (dTotal > 21) win = true;
    else if (pTotal > dTotal) win = true;
    else if (pTotal === dTotal) win = false; // Diamond wins ties
    else win = false;

    const outcomeText = win ? "You win! Diamond scowls." : "You lose. Diamond snickers.";
    document.getElementById('outcome').textContent = outcomeText;
    document.getElementById('diamond-dialogue').textContent = randomDialogue();
    win ? wins++ : losses++;
    document.getElementById('deal-btn').disabled = false;
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    updateUI();
  };

  document.getElementById('deal-btn').onclick = () => {
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    renderHand(playerHand, 'player-cards');
    renderHand(dealerHand, 'dealer-cards', true);
    updateUI();
    document.getElementById('outcome').textContent = '';
    document.getElementById('deal-btn').disabled = true;
    document.getElementById('hit-btn').disabled = false;
    document.getElementById('stand-btn').disabled = false;
    document.getElementById('diamond-dialogue').textContent = "Good luck! You're gonna need it~";
  };

  document.getElementById('hit-btn').onclick = () => {
    playerHand.push(deck.pop());
    renderHand(playerHand, 'player-cards');
    updateUI();
    if (getTotal(playerHand) > 21) endGame();
  };

  document.getElementById('stand-btn').onclick = () => {
    cheatIfLosing();
    renderHand(dealerHand, 'dealer-cards', false);
    updateUI();
    endGame();
  };

  document.getElementById('settings-btn').onclick = () =>
    document.getElementById('settings-modal').classList.remove('hidden');
  document.getElementById('close-settings').onclick = () =>
    document.getElementById('settings-modal').classList.add('hidden');
})();

