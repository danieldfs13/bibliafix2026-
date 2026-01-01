// Dados das histórias com links do YouTube
const stories = {
    'moises': {
        title: 'Moisés e o Mar Vermelho',
        description: 'A incrível história de como Deus abriu o mar para salvar seu povo do Egito. Moisés, com fé em Deus, estendeu sua vara e as águas se dividiram, permitindo que os israelitas passassem em segurança.',
        youtubeId: 'CMtyHq0jfaA',
        duration: '8 min',
        book: 'Êxodo'
    },
    'davi': {
        title: 'Davi e Golias',
        description: 'Como um pequeno pastor venceu o gigante filisteu com apenas uma pedra e muita fé em Deus. Uma história sobre coragem, fé e como Deus usa os pequenos para grandes coisas.',
        youtubeId: 'T00d-4V-R6M',
        duration: '7 min',
        book: '1 Samuel'
    },
    'noe': {
        title: 'A Arca de Noé',
        description: 'Noé constrói uma grande arca para salvar sua família e os animais do grande dilúvio. Uma história sobre obediência a Deus e sua promessa simbolizada pelo arco-íris.',
        youtubeId: '2B6IMyzNHBg',
        duration: '10 min',
        book: 'Gênesis'
    },
    'adao-eva': {
        title: 'Adão e Eva no Jardim do Éden',
        description: 'A criação do primeiro homem e da primeira mulher por Deus no paraíso. Uma história sobre o amor de Deus e a importância da obediência.',
        youtubeId: 'UGUmcEwblyQ',
        duration: '8 min',
        book: 'Gênesis'
    },
    'jonas': {
        title: 'Jonas e a Baleia',
        description: 'Jonas aprende sobre obediência a Deus depois de ser engolido por uma grande baleia. Uma história sobre perdão e segunda chances.',
        youtubeId: 'fa2-x5Eh8Qg',
        duration: '7 min',
        book: 'Jonas'
    },
    'daniel': {
        title: 'Daniel na Cova dos Leões',
        description: 'Daniel é protegido por Deus na cova dos leões por causa de sua fé inabalável. Uma história sobre coragem e confiança em Deus.',
        youtubeId: 'stjqTnpnJbw',
        duration: '9 min',
        book: 'Daniel'
    },
    'jose': {
        title: 'José do Egito',
        description: 'A história do jovem José e sua túnica de muitas cores, mostrando como Deus transforma dificuldades em bênçãos.',
        youtubeId: 'YQ2852koHDg',
        duration: '11 min',
        book: 'Gênesis'
    },
    'nascimento-jesus': {
        title: 'O Nascimento de Jesus',
        description: 'A história mais linda de todas: o nascimento do Salvador em Belém. Maria e José, os anjos, os pastores e os reis magos celebram a chegada do Menino Jesus.',
        youtubeId: '1MKH5GH9KcU',
        duration: '9 min',
        book: 'Lucas'
    },
    'jesus-criancas': {
        title: 'Jesus e as Crianças',
        description: 'Jesus mostra seu amor especial pelas crianças, abençoando-as e ensinando que o Reino dos Céus pertence aos que têm um coração puro como o das crianças.',
        youtubeId: 'dQw4w9WgXcQ',
        duration: '6 min',
        book: 'Marcos'
    },
    'multiplicacao-paes': {
        title: 'Multiplicação dos Pães e Peixes',
        description: 'Jesus alimenta cinco mil pessoas com apenas cinco pães e dois peixes, mostrando o poder de Deus e a importância de compartilhar.',
        youtubeId: 'guzjlkls2ng',
        duration: '8 min',
        book: 'João'
    }
};

// Progresso das histórias (armazenado no localStorage)
let watchProgress = JSON.parse(localStorage.getItem('bibliaFlixProgress')) || {
    'moises': 0,
    'davi': 0,
    'noe': 0,
    'adao-eva': 0,
    'jonas': 0,
    'daniel': 0,
    'jose': 0,
    'nascimento-jesus': 0,
    'jesus-criancas': 0,
    'multiplicacao-paes': 0
};

// Favoritos (armazenado no localStorage)
let favorites = JSON.parse(localStorage.getItem('bibliaFlixFavorites')) || [];

// Elementos DOM
const modal = document.getElementById('video-modal');
const youtubePlayer = document.getElementById('youtube-player');
const videoTitle = document.getElementById('video-title');
const videoDescription = document.getElementById('video-description');
const closeBtn = document.querySelector('.close-btn');
const favoriteBtn = document.getElementById('favorite-btn');

// Estado atual do player
let currentStoryId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeStoryCards();
    initializeNavigation();
    initializeModal();
    updateProgressBars();
    initializeBookFilters();
    updateFavoritesSection();
});

// Inicializar cards das histórias
function initializeStoryCards() {
    const storyCards = document.querySelectorAll('.story-card');
    
    storyCards.forEach(card => {
        card.addEventListener('click', function() {
            const storyId = this.getAttribute('data-story');
            openStoryModal(storyId);
        });
        
        // Adicionar efeito hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Mostrar overlay de play
            const playOverlay = this.querySelector('.play-overlay');
            if (playOverlay) {
                playOverlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const playOverlay = this.querySelector('.play-overlay');
            if (playOverlay) {
                playOverlay.style.opacity = '0';
            }
        });
    });
}

// Inicializar navegação
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Scroll suave para a seção
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Inicializar filtros de livros
function initializeBookFilters() {
    const bookFilters = document.querySelectorAll('.book-filter');
    
    bookFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const book = this.getAttribute('data-book');
            const container = this.closest('.content-section');
            
            // Remover classe active de todos os botões
            container.querySelectorAll('.book-filter').forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Filtrar seções de livros
            const bookSections = container.querySelectorAll('.book-section');
            bookSections.forEach(section => {
                const sectionBook = section.getAttribute('data-book');
                if (book === 'all' || sectionBook === book) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// Inicializar modal
function initializeModal() {
    // Fechar modal ao clicar no X
    closeBtn.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Abrir modal da história
function openStoryModal(storyId) {
    const story = stories[storyId];
    if (!story) return;
    
    currentStoryId = storyId;
    
    videoTitle.textContent = story.title;
    videoDescription.textContent = story.description;
    
    // Construir URL do YouTube com autoplay
    const youtubeUrl = `https://www.youtube.com/embed/${story.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    youtubePlayer.src = youtubeUrl;
    
    // Atualizar botão de favoritos
    updateFavoriteButton();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Adicionar animação de entrada
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Marcar como assistida
    watchProgress[storyId] = 100;
    saveProgress();
    updateProgressBars();
}

// Fechar modal
function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        youtubePlayer.src = '';
        currentStoryId = null;
        document.body.style.overflow = 'auto';
    }, 300);
}

// Scroll suave para seção
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Atualizar barras de progresso
function updateProgressBars() {
    const storyCards = document.querySelectorAll('.story-card');
    
    storyCards.forEach(card => {
        const storyId = card.getAttribute('data-story');
        const progress = watchProgress[storyId] || 0;
        const progressFill = card.querySelector('.progress-fill');
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        // Adicionar classe 'watched' se assistida
        if (progress >= 80) {
            card.classList.add('watched');
        }
    });
}

// Salvar progresso no localStorage
function saveProgress() {
    localStorage.setItem('bibliaFlixProgress', JSON.stringify(watchProgress));
}

// Alternar favorito
function toggleFavorite() {
    if (!currentStoryId) return;
    
    const index = favorites.indexOf(currentStoryId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(currentStoryId);
    }
    
    localStorage.setItem('bibliaFlixFavorites', JSON.stringify(favorites));
    updateFavoriteButton();
    updateFavoritesSection();
}

// Atualizar botão de favoritos
function updateFavoriteButton() {
    if (!currentStoryId) return;
    
    const isFavorite = favorites.includes(currentStoryId);
    if (isFavorite) {
        favoriteBtn.textContent = '❤️ Remover dos Favoritos';
        favoriteBtn.style.background = 'linear-gradient(45deg, #FF6B6B, #FF4757)';
    } else {
        favoriteBtn.textContent = '🤍 Adicionar aos Favoritos';
        favoriteBtn.style.background = 'linear-gradient(45deg, #4ECDC4, #44A08D)';
    }
}

// Atualizar seção de favoritos
function updateFavoritesSection() {
    const favoritesGrid = document.getElementById('favorites-grid');
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1 / -1;">Você ainda não tem histórias favoritas. Clique no coração para adicionar!</p>';
        return;
    }
    
    favoritesGrid.innerHTML = '';
    
    favorites.forEach(storyId => {
        const story = stories[storyId];
        if (!story) return;
        
        // Encontrar a imagem correspondente
        let imageName = '';
        switch(storyId) {
            case 'adao-eva': imageName = 'adao_eva_animacao.png'; break;
            case 'noe': imageName = 'arca_noe_animacao.png'; break;
            case 'jose': imageName = 'jose_egito_animacao.png'; break;
            case 'moises': imageName = 'moises_mar_vermelho_animacao.png'; break;
            case 'davi': imageName = 'davi_golias_animacao.png'; break;
            case 'daniel': imageName = 'daniel_leoes_animacao.png'; break;
            case 'jonas': imageName = 'jonas_baleia_animacao.png'; break;
            case 'nascimento-jesus': imageName = 'nascimento_jesus_animacao.png'; break;
            case 'jesus-criancas': imageName = 'jesus_criancas_animacao.png'; break;
            case 'multiplicacao-paes': imageName = 'multiplicacao_paes_animacao.png'; break;
        }
        
        const card = document.createElement('div');
        card.className = 'story-card';
        card.setAttribute('data-story', storyId);
        card.innerHTML = `
            <div class="story-image">
                <img src="${imageName}" alt="${story.title}">
                <div class="play-overlay">
                    <div class="play-button">▶️</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${watchProgress[storyId] || 0}%"></div>
                </div>
            </div>
            <div class="story-info">
                <h3 class="story-title">${story.title}</h3>
                <p class="story-description">${story.description}</p>
                <span class="story-duration">${story.duration}</span>
                <span class="story-book">${story.book}</span>
            </div>
        `;
        
        card.addEventListener('click', function() {
            openStoryModal(storyId);
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            const playOverlay = this.querySelector('.play-overlay');
            if (playOverlay) playOverlay.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            const playOverlay = this.querySelector('.play-overlay');
            if (playOverlay) playOverlay.style.opacity = '0';
        });
        
        favoritesGrid.appendChild(card);
    });
}

// Analytics simulado
function trackVideoStart(storyId) {
    console.log(`Vídeo iniciado: ${stories[storyId].title}`);
}
