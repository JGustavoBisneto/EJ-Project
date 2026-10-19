const themeToggle = document.querySelector('#theme-toggle');
const savedTheme = localStorage.getItem('theme');

function setTheme(theme) {
  const isDark = theme === 'dark';

  document.body.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle.textContent = isDark ? 'Tema claro' : 'Tema escuro';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

setTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});

const productModal = document.querySelector('#produto-modal');
const modalTitle = document.querySelector('#produto-modal-titulo');
const modalImage = document.querySelector('#produto-modal-imagem');
const modalDescription = document.querySelector('#produto-modal-descricao');
const closeModalButton = document.querySelector('.produto-modal-fechar');

document.querySelectorAll('.card-produto').forEach((card) => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h4');
    const image = card.querySelector('img');

    modalTitle.textContent = title.textContent;
    modalImage.src = image.getAttribute('src');
    modalImage.alt = image.alt;
    modalDescription.textContent = card.dataset.description;
    productModal.showModal();
  });
});

closeModalButton.addEventListener('click', () => {
  productModal.close();
});

productModal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    productModal.close();
  }
});

productModal.addEventListener('click', (event) => {
  const bounds = productModal.getBoundingClientRect();
  const clickedOutside = event.clientX < bounds.left
    || event.clientX > bounds.right
    || event.clientY < bounds.top
    || event.clientY > bounds.bottom;

  if (clickedOutside) {
    productModal.close();
  }
});

// Seleciona o elemento do trilho que contém os cards
const track = document.querySelector('.carousel-track');

// Seleciona todos os cards de notícia individuais
const cards = document.querySelectorAll('.noticia-card');

// Seleciona todos os botões/bolinhas de navegação
const indicators = document.querySelectorAll('.indicator');

// Seleciona o container geral do carrossel
const container = document.querySelector('.carousel-container');

// Armazena o índice da notícia atualmente visível (inicia na posição 0)
let currentIndex = 0;

// Declara a variável que guardará o temporizador de rotação
let autoSlideTimer;

// Função responsável por mover o carrossel para uma notícia específica
function goToSlide(index) {
  currentIndex = index; // Atualiza a variável do índice atual

  // Aplica o movimento horizontal no trilho deslocando -100% por índice
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Percorre os botões e atribui a classe 'active' apenas ao botão correspondente
  indicators.forEach((btn, i) => {
    btn.classList.toggle('active', i === currentIndex);
  });
}

// Configura o evento de clique em cada uma das bolinhas
indicators.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    goToSlide(index); // Move para o slide da bolinha clicada
  });
});

// Inicia a transição automática configurada para 4 segundos
function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    // Calcula a próxima notícia e volta para 0 ao atingir a última
    const nextIndex = (currentIndex + 1) % cards.length;
    goToSlide(nextIndex); // Executa a mudança de slide
  }, 4000); // 4000 milissegundos = 4 segundos
}

// Para o temporizador da transição automática
function stopAutoSlide() {
  clearInterval(autoSlideTimer); // Limpa o intervalo ativo
}

// Pausa o carrossel quando o usuário passa o mouse por cima
container.addEventListener('mouseenter', stopAutoSlide);

// Retoma o carrossel automático quando o mouse sai de cima
container.addEventListener('mouseleave', startAutoSlide);

// Inicia o carrossel automático ao carregar a página
startAutoSlide();