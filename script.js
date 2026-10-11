function loadCart() {
    try {
        const savedItems = JSON.parse(localStorage.getItem('pimpim-bites-cart') || '[]');
        if (!Array.isArray(savedItems)) return new Map();

        return new Map(savedItems.filter((item) => (
            item &&
            typeof item.name === 'string' &&
            Number.isInteger(item.priceInCents) && item.priceInCents >= 0 &&
            Number.isInteger(item.quantity) && item.quantity > 0
        )).map((item) => [item.name, {
            priceInCents: item.priceInCents,
            quantity: item.quantity
        }]));
    } catch {
        return new Map();
    }
}

const cartItems = loadCart();
const cartList = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartLink = document.querySelector('.cart-link');
const cartStatus = document.querySelector('#cart-status');
const cartTotal = document.querySelector('.cart-total strong');
const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

function renderCart() {
    const itemCount = [...cartItems.values()].reduce((total, item) => total + item.quantity, 0);
    const totalInCents = [...cartItems.values()].reduce(
        (total, item) => total + item.priceInCents * item.quantity,
        0
    );

    cartCount.textContent = String(itemCount);
    cartLink.setAttribute('aria-label', `Carrinho, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`);
    cartTotal.textContent = currency.format(totalInCents / 100);
    cartList.replaceChildren();

    for (const [name, item] of cartItems) {
        const row = document.createElement('li');
        row.className = 'cart-item';

        const description = document.createElement('span');
        description.textContent = `${name} x ${item.quantity} — ${currency.format(item.priceInCents * item.quantity / 100)}`;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.dataset.removeProduct = name;
        removeButton.textContent = 'Remover';

        row.append(description, removeButton);
        cartList.append(row);
    }

    cartStatus.textContent = itemCount === 0
        ? 'Seu carrinho está vazio.'
        : `${itemCount} ${itemCount === 1 ? 'item' : 'itens'} no carrinho.`;

    try {
        localStorage.setItem('pimpim-bites-cart', JSON.stringify(
            [...cartItems].map(([name, item]) => ({ name, ...item }))
        ));
    } catch {
        cartStatus.textContent = 'Carrinho atualizado. Não foi possível salvar neste navegador.';
    }
}

document.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-to-cart');
    if (addButton) {
        const productCard = addButton.closest('[data-product][data-price]');
        const name = productCard.dataset.product;
        const priceInCents = Math.round(Number(productCard.dataset.price) * 100);
        const existingItem = cartItems.get(name);

        cartItems.set(name, {
            priceInCents,
            quantity: existingItem ? existingItem.quantity + 1 : 1
        });
        renderCart();
        return;
    }

    const removeButton = event.target.closest('[data-remove-product]');
    if (removeButton) {
        cartItems.delete(removeButton.dataset.removeProduct);
        renderCart();
    }
});

renderCart();