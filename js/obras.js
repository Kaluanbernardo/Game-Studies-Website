// Script para a página de obras
document.addEventListener('DOMContentLoaded', function() {
    // Filtro por categoria
    const filterCategoria = document.getElementById('filter-categoria');
    if (filterCategoria) {
        filterCategoria.addEventListener('change', function() {
            filterObras();
        });
    }
    
    // Filtro por idioma
    const filterIdioma = document.getElementById('filter-idioma');
    if (filterIdioma) {
        filterIdioma.addEventListener('change', function() {
            filterObras();
        });
    }
    
    // Função para filtrar as obras
    function filterObras() {
        const selectedCategoria = filterCategoria.value;
        const selectedIdioma = filterIdioma.value;
        
        const obras = document.querySelectorAll('.obra-item');
        
        obras.forEach(obra => {
            let showByCategoria = selectedCategoria === 'all';
            let showByIdioma = selectedIdioma === 'all';
            
            // Verificar categoria
            if (selectedCategoria !== 'all') {
                const categorias = obra.querySelectorAll('.categoria');
                categorias.forEach(categoria => {
                    if (categoria.textContent === selectedCategoria) {
                        showByCategoria = true;
                    }
                });
            }
            
            // Verificar idioma
            if (selectedIdioma !== 'all') {
                const idioma = obra.querySelector('.idioma');
                if (idioma && idioma.textContent.includes(selectedIdioma)) {
                    showByIdioma = true;
                }
            }
            
            // Mostrar ou esconder a obra
            if (showByCategoria && showByIdioma) {
                obra.style.display = 'block';
                // Adicionar animação de fade in
                obra.style.opacity = '0';
                obra.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    obra.style.opacity = '1';
                    obra.style.transform = 'translateY(0)';
                }, 50);
            } else {
                obra.style.display = 'none';
            }
        });
    }
    
    // Adicionar funcionalidade de expansão/colapso para obras longas
    const obraHeaders = document.querySelectorAll('.obra-header');
    obraHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const obraItem = this.parentElement;
            
            // Toggle classe para expandir/colapsar
            obraItem.classList.toggle('expanded');
            
            // Animação suave para expandir/colapsar
            if (obraItem.classList.contains('expanded')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });
    
    // Adicionar âncoras para navegação direta
    function scrollToObra() {
        const hash = window.location.hash;
        if (hash) {
            const targetObra = document.querySelector(hash);
            if (targetObra) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetObra.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Destacar a obra alvo
                    targetObra.classList.add('highlight');
                    setTimeout(() => {
                        targetObra.classList.remove('highlight');
                    }, 2000);
                }, 300);
            }
        }
    }
    
    // Executar ao carregar a página
    scrollToObra();
    
    // Executar quando a hash mudar
    window.addEventListener('hashchange', scrollToObra);
    
    // Adicionar botão "Voltar ao topo"
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.title = 'Voltar ao topo';
    document.body.appendChild(backToTopButton);
    
    // Mostrar/esconder botão com base no scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Ação do botão
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Adicionar estilos para o botão
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background-color: var(--accent-color);
            transform: translateY(-3px);
        }
        
        .obra-item.highlight {
            animation: highlight 2s ease;
        }
        
        @keyframes highlight {
            0%, 100% {
                border-left-color: var(--primary-color);
            }
            50% {
                border-left-color: var(--accent-color);
                box-shadow: 0 0 15px rgba(246, 114, 128, 0.5);
            }
        }
        
        .obra-item .obra-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease;
        }
        
        .obra-item.expanded .obra-content {
            max-height: 2000px;
        }
        
        .obra-header {
            cursor: pointer;
            position: relative;
        }
        
        .obra-header::after {
            content: '\\f107';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            right: 20px;
            top: 20px;
            transition: transform 0.3s ease;
        }
        
        .obra-item.expanded .obra-header::after {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar todas as obras como expandidas
    document.querySelectorAll('.obra-item').forEach(obra => {
        obra.classList.add('expanded');
        const content = obra.querySelector('.obra-content');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});
