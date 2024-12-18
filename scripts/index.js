import getDados from "./getDados.js";

// Mapeia os elementos DOM que você deseja atualizar
const elementos = {
    top5: document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series: document.querySelector('[data-name="series"]')
};

// Função para criar a lista de filmes
function criarListaFilmes(elemento, dados) {
    const ul = document.createElement('ul');
    ul.className = 'lista';

    const listaHTML = dados.map(filme => `
        <li>
            <a href="/detalhes.html?id=${filme.id}">
                <img src="${filme.poster}" alt="${filme.titulo}">
            </a>
        </li>
    `).join('');

    ul.innerHTML = listaHTML;
    elemento.innerHTML = '';  // Limpa o conteúdo existente
    elemento.appendChild(ul);
}

// Função genérica para tratamento de erros
function lidarComErro(mensagemErro) {
    console.error(mensagemErro);
    alert("Ocorreu um erro. Por favor, tente novamente mais tarde.");
}

// Função para exibir ou ocultar seções com base na categoria selecionada
function alterarVisibilidadeDasSeções(categoriaSelecionada) {
    const categoria = document.querySelector('[data-name="categoria"]');
    const sectionsParaOcultar = document.querySelectorAll('.section');

    sectionsParaOcultar.forEach(section => {
        if (categoriaSelecionada === 'todos') {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    categoria.classList.toggle('hidden', categoriaSelecionada !== 'todos');
}


async function geraSeries() {
    const urls = ['/series/top5', '/series/lancamentos', '/series'];
    
    try {
        const data = await Promise.all(urls.map(url => getDados(url)));
        criarListaFilmes(elementos.top5, data[0]);
        criarListaFilmes(elementos.lancamentos, data[1]);
        criarListaFilmes(elementos.series, data[2].slice(0, 10)); 
    } catch (error) {
        lidarComErro("Ocorreu um erro ao carregar as séries.");
    }
}


const categoriaSelect = document.querySelector('[data-categorias]');
categoriaSelect.addEventListener('change', async function () {
    const categoriaSelecionada = categoriaSelect.value;

    alterarVisibilidadeDasSeções(categoriaSelecionada);

    if (categoriaSelecionada !== 'todos') {
        try {
            const data = await getDados(`/series/categoria/${categoriaSelecionada}`);
            criarListaFilmes(categoriaSelect, data);
        } catch (error) {
            lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
        }
    }
});


geraSeries();
