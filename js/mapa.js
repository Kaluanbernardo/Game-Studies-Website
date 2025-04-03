// Script para o mapa de relações usando D3.js
document.addEventListener('DOMContentLoaded', function() {
    // Configurações do gráfico
    const width = document.getElementById('graph-container').clientWidth;
    const height = 600;
    
    // Criar o SVG
    const svg = d3.select('#graph-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');
    
    // Adicionar um grupo para aplicar zoom
    const g = svg.append('g');
    
    // Configurar o zoom
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Carregar os dados do JSON
    d3.json('/data/mapa_relacoes.json').then(function(data) {
        // Criar um mapa de nós a partir dos dados
        const nodes = data.map(d => ({
            id: d.id,
            titulo: d.titulo,
            autor: d.autor,
            ano: d.ano
        }));
        
        // Criar links a partir das conexões
        let links = [];
        data.forEach(source => {
            if (source.conexoes) {
                source.conexoes.forEach(conexao => {
                    links.push({
                        source: source.id,
                        target: conexao.para,
                        tipo: conexao.tipo,
                        descricao: conexao.descricao
                    });
                });
            }
        });
        
        // Definir cores para os diferentes tipos de conexões
        const colorScale = d3.scaleOrdinal()
            .domain(['influenciou', 'conceitual', 'resposta', 'contemporaneo', 'referencia'])
            .range(['#f67280', '#6c5b7b', '#c06c84', '#355c7d', '#66bfbf']);
        
        // Criar a simulação de força
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(60));
        
        // Criar os links (linhas)
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', d => colorScale(d.tipo))
            .attr('data-tipo', d => d.tipo);
        
        // Criar os nós (círculos)
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('id', d => `node-${d.id}`)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
        
        // Adicionar círculos aos nós
        node.append('circle')
            .attr('r', 30)
            .attr('fill', '#4a6fa5');
        
        // Adicionar texto aos nós (título)
        node.append('text')
            .attr('dy', -5)
            .text(d => d.titulo)
            .attr('text-anchor', 'middle');
        
        // Adicionar texto aos nós (autor e ano)
        node.append('text')
            .attr('dy', 10)
            .text(d => `${d.autor} (${d.ano})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px');
        
        // Adicionar tooltips para os links
        link.append('title')
            .text(d => d.descricao);
        
        // Atualizar posições a cada tick da simulação
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
        
        // Funções para o drag and drop
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        // Implementar filtro por tipo de conexão
        document.getElementById('filter-type').addEventListener('change', function() {
            const selectedType = this.value;
            
            if (selectedType === 'all') {
                link.style('visibility', 'visible');
            } else {
                link.style('visibility', d => d.tipo === selectedType ? 'visible' : 'hidden');
            }
        });
        
        // Implementar destaque ao clicar em um nó
        node.on('click', function(event, d) {
            // Resetar todos os nós e links para o estado normal
            node.select('circle').attr('fill', '#4a6fa5');
            link.attr('stroke-width', 2).attr('stroke-opacity', 0.6);
            
            // Destacar o nó clicado
            d3.select(this).select('circle').attr('fill', '#f67280');
            
            // Destacar links conectados ao nó
            link.each(function(l) {
                if (l.source.id === d.id || l.target.id === d.id) {
                    d3.select(this)
                        .attr('stroke-width', 4)
                        .attr('stroke-opacity', 1);
                }
            });
        });
        
        // Implementar controles de zoom
        document.getElementById('zoom-in').addEventListener('click', function() {
            svg.transition().duration(300).call(zoom.scaleBy, 1.3);
        });
        
        document.getElementById('zoom-out').addEventListener('click', function() {
            svg.transition().duration(300).call(zoom.scaleBy, 0.7);
        });
        
        document.getElementById('reset-view').addEventListener('click', function() {
            svg.transition().duration(300).call(
                zoom.transform,
                d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
            );
        });
    }).catch(function(error) {
        console.error('Erro ao carregar os dados:', error);
        document.getElementById('graph-container').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>Erro ao carregar o mapa de relações</h3>
                <p>Não foi possível carregar os dados para o mapa. Por favor, tente novamente mais tarde.</p>
            </div>
        `;
    });
});
