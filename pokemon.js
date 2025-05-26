let todosPokemons = '';

fetch(`https://pokeapi.co/api/v2/pokemon?limit=1302`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al cargar los pokemons');
        }
        return response.json();
    })
    .then(data => todosPokemons = data.results);

const button = document.querySelector('.pokedex__button');
const input = document.querySelector('.pokedex__input');
const section = document.querySelector('.pokedex');
const resultados = document.createElement('ul');
const resultados2 = document.createElement('div');
resultados2.classList.add('pokedex__resultado');

section.appendChild(resultados);
section.appendChild(resultados2);

button.addEventListener('click', (e) => {
    resultados.innerHTML = '';
    e.preventDefault();

    const pokemonsBuscados = input.value;
    const posiblesPokemons = todosPokemons.filter(poke =>
        poke.name.includes(pokemonsBuscados.toLowerCase().trim())
    );

    resultados2.innerHTML = '';

    if (posiblesPokemons.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'Pokémon no encontrado';
        resultados.appendChild(mensaje);
        return;
    }

    posiblesPokemons.forEach(pokemon => {
        const pokemonFiltro = document.createElement('li');
        const pokemonFiltroNombre = document.createElement('p');

        pokemonFiltroNombre.value = pokemon.name;
        pokemonFiltroNombre.textContent = pokemon.name;

        pokemonFiltro.appendChild(pokemonFiltroNombre);
        resultados.appendChild(pokemonFiltro);

        pokemonFiltro.addEventListener('click', (e) => {
            const nombrePokemon = e.target.value;
            resultados.innerHTML = '';
            resultados2.innerHTML = '';

            fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Problema al encontrar el pokemon');
                    }
                    return response.json();
                })
                .then(data => {
                    const contenedor = document.createElement('div');
                    const nombre = document.createElement('p');
                    const altura = document.createElement('p');
                    const peso = document.createElement('p');
                    const imagen = document.createElement('img');

                    imagen.src = data.sprites.front_default;
                    imagen.style.width = '100px';

                    nombre.textContent = `Nombre: ${data.name}`;
                    altura.textContent = `Altura: ${data.height}`;
                    peso.textContent = `Peso: ${data.weight}`;

                    contenedor.appendChild(nombre);
                    contenedor.appendChild(altura);
                    contenedor.appendChild(peso);
                    contenedor.appendChild(imagen);
                    resultados2.appendChild(contenedor);
                });
        });
    });
});
