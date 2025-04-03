// Funções para o site Game Studies Hub
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona comportamento de scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Destaca o item de menu ativo com base na página atual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === 'index.html' && linkHref === '#') ||
            (linkHref !== '#' && currentPage.includes(linkHref))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Animação para cards e elementos ao entrar na viewport
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .category-item, .journal-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };

    // Adiciona classe para animação CSS
    document.querySelectorAll('.card, .category-item, .journal-item').forEach(element => {
        element.classList.add('animate-on-scroll');
    });

    // Executa a animação no carregamento e no scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});
