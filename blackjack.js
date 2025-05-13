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
    cardDiv.style.color = 'transparent'; // hide text if image loads
  };
  img.onerror = () => {
    cardDiv.textContent = `${card.value}${card.suit}`; // fallback text
  };
  return cardDiv;
}
