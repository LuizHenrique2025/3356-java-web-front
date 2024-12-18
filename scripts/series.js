import getDados from "./getDados.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescricao = document.getElementById('ficha-descricao');

// Função para criar um <option> e adicionar ao select
function criarOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
}

// Função para carregar temporadas
async function carregarTemporadas() {
    try {
        const data = await getDados(`/series/${serieId}/temporadas/todas`);
        const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
        listaTemporadas.innerHTML = ''; 

        listaTemporadas.appendChild(criarOption('', 'Selecione a temporada'));
        
        temporadasUnicas.forEach(temporada => {
            listaTemporadas.appendChild(criarOption(temporada, temporada));
        });

        listaTemporadas.appendChild(criarOption('todas', 'Todas as temporadas'));
    } catch (error) {
        console.error('Erro ao obter temporadas:', error);
        alert('Não foi possível carregar as temporadas no momento.');
    }
}

// Função para carregar episódios de uma temporada
async function carregarEpisodios() {
    if (!listaTemporadas.value) return;

    try {
        const data = await getDados(`/series/${serieId}/temporadas/${listaTemporadas.value}`);
        const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
        fichaSerie.innerHTML = ''; 

        temporadasUnicas.forEach(temporada => {
            const ul = document.createElement('ul');
            ul.className = 'episodios-lista';

            const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

            episodiosTemporadaAtual.forEach(serie => {
                const li = document.createElement('li');
                li.textContent = `${serie.numeroEpisodio} - ${serie.titulo}`;
                ul.appendChild(li);
            });

            const paragrafo = document.createElement('p');
            paragrafo.textContent = `Temporada ${temporada}`;
            fichaSerie.appendChild(paragrafo);
            fichaSerie.appendChild(ul);
        });
    } catch (error) {
        console.error('Erro ao obter episódios:', error);
        alert('Não foi possível carregar os episódios no momento.');
    }
}

// Função para carregar informações gerais da série
async function carregarInfoSerie() {
    try {
        const data = await getDados(`/series/${serieId}`);
        fichaDescricao.innerHTML = `
            <img src="${data.poster}" alt="${data.titulo}" />
            <div>
                <h2>${data.titulo}</h2>
                <div class="descricao-texto">
                    <p><b>Média de avaliações:</b> ${data.avaliacao}</p>
                    <p>${data.sinopse}</p>
                    <p><b>Estrelando:</b> ${data.atores}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao obter informações da série:', error);
        alert('Não foi possível carregar as informações da série.');
    }
}

// Inicializar a página
listaTemporadas.addEventListener('change', carregarEpisodios);
carregarInfoSerie();
carregarTemporadas();
