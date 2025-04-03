// Configuração para o deploy do site
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos em ambiente de produção
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
    
    // Ajustar caminhos para recursos se estiver em produção
    if (isProduction) {
        // Ajustar caminhos para arquivos JSON
        const jsonPaths = document.querySelectorAll('script[data-json-path]');
        jsonPaths.forEach(script => {
            const path = script.getAttribute('data-json-path');
            script.setAttribute('data-json-path', '/data/' + path);
        });
    }
    
    // Adicionar analytics (apenas em produção)
    if (isProduction) {
        // Código para analytics seria adicionado aqui
        console.log('Analytics carregado em ambiente de produção');
    }
    
    // Verificar suporte a recursos modernos do navegador
    const supportsModernFeatures = 'CSS' in window && 
                                  CSS.supports('display', 'flex') && 
                                  'fetch' in window;
    
    // Adicionar aviso para navegadores antigos
    if (!supportsModernFeatures) {
        const body = document.querySelector('body');
        const warning = document.createElement('div');
        warning.className = 'browser-warning';
        warning.innerHTML = `
            <div class="container">
                <p><strong>Aviso:</strong> Seu navegador pode não suportar todos os recursos deste site. 
                Para uma melhor experiência, recomendamos atualizar para um navegador mais recente.</p>
                <button id="close-warning">Entendi</button>
            </div>
        `;
        body.insertBefore(warning, body.firstChild);
        
        // Permitir fechar o aviso
        document.getElementById('close-warning').addEventListener('click', function() {
            warning.style.display = 'none';
        });
    }
    
    // Adicionar suporte a service worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            }).catch(function(error) {
                console.log('Registro do ServiceWorker falhou:', error);
            });
        });
    }
    
    // Adicionar suporte a tema escuro
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-theme');
    }
    
    // Adicionar botão para alternar tema
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = 'Alternar tema claro/escuro';
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Adicionar estilos para o botão de tema
    const style = document.createElement('style');
    style.textContent = `
        .theme-toggle {
            position: fixed;
            bottom: 80px;
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
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
            background-color: var(--accent-color);
            transform: translateY(-3px);
        }
        
        .browser-warning {
            background-color: #fff3cd;
            color: #856404;
            padding: 1rem 0;
            text-align: center;
            position: relative;
        }
        
        .browser-warning button {
            background-color: #856404;
            color: white;
            border: none;
            padding: 0.3rem 0.8rem;
            border-radius: 4px;
            margin-left: 1rem;
            cursor: pointer;
        }
        
        /* Estilos para tema escuro */
        body.dark-theme {
            --primary-color: #3a5a8c;
            --secondary-color: #574a68;
            --accent-color: #e05d6f;
            --dark-color: #121212;
            --light-color: #1e1e1e;
            --gray-color: #2c2c2c;
            --text-color: #e0e0e0;
            --link-color: #7da2d8;
            background-color: var(--dark-color);
            color: var(--text-color);
        }
        
        body.dark-theme header,
        body.dark-theme .intro,
        body.dark-theme .journals,
        body.dark-theme .obra-item,
        body.dark-theme .card,
        body.dark-theme .journal-item {
            background-color: var(--light-color);
        }
        
        body.dark-theme .category-item,
        body.dark-theme .obra-header,
        body.dark-theme .map-placeholder,
        body.dark-theme .classificacao-item,
        body.dark-theme .estrutura-item,
        body.dark-theme .obra-conexoes {
            background-color: var(--gray-color);
        }
        
        body.dark-theme h1, 
        body.dark-theme h2, 
        body.dark-theme h3, 
        body.dark-theme h4, 
        body.dark-theme h5, 
        body.dark-theme h6 {
            color: #e0e0e0;
        }
        
        body.dark-theme a {
            color: var(--link-color);
        }
        
        body.dark-theme .card h3,
        body.dark-theme .obra-header h2,
        body.dark-theme .obra-resumo h3, 
        body.dark-theme .obra-contribuicoes h3, 
        body.dark-theme .obra-criticas h3, 
        body.dark-theme .obra-conexoes h3, 
        body.dark-theme .obra-classificacao h3, 
        body.dark-theme .obra-estrutura h3 {
            color: var(--link-color);
        }
        
        body.dark-theme nav ul li a {
            color: var(--text-color);
        }
    `;
    document.head.appendChild(style);
});
