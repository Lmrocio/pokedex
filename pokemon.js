"use strict";

// Detecta en qué página estamos
const paginaActual = window.location.pathname.split('/').pop();

if (paginaActual === 'index.html' || paginaActual === '') {
    // -----------------------------
    // Lógica para index.html
    // -----------------------------

    let todosPokemons = []; // Lista de todos los Pokémon

    // Cargar todos los Pokémon desde la API
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1302')
        .then(res => {
            if (!res.ok) throw new Error('No se pudo cargar la lista de Pokémon');
            return res.json();
        })
        .then(data => todosPokemons = data.results)
        .catch(error => console.error('Error al cargar Pokémon:', error));

    const input = document.querySelector('.pokedex__input');
    const button = document.querySelector('.pokedex__button');
    const resultados = document.createElement('ul');
    document.querySelector('.pokedex').appendChild(resultados);

    /**
     * Función que busca Pokémon por texto y muestra resultados dinámicos
     * @param {string} texto - Texto ingresado por el usuario
     */
    function buscarPokemon(texto) {
        resultados.innerHTML = ''; // Limpiar resultados previos
        if (!texto) return;

        // Filtrar Pokémon
        const filtrados = todosPokemons.filter(p => p.name.startsWith(texto));

        if (filtrados.length === 0) {
            resultados.innerHTML = '<p>Pokémon no encontrado</p>';
            return;
        }

        // Mostrar cada Pokémon filtrado en la lista
        filtrados.forEach(pokemon => {
            const li = document.createElement('li');
            li.textContent = pokemon.name;
            resultados.appendChild(li);

            // Al hacer clic, guardar el Pokémon y redirigir a pokemon.html
            li.addEventListener('click', () => {
                localStorage.setItem('pokemonSeleccionado', pokemon.name);
                window.location.href = 'pokemon.html';
            });
        });
    }

    // -----------------------------
    // Eventos
    // -----------------------------

    // Input dinámico
    input.addEventListener('input', () => {
        const texto = input.value.toLowerCase().trim();
        buscarPokemon(texto);
    });

    // Botón “Buscar”
    button.addEventListener('click', e => {
        e.preventDefault(); // Evitar recargar la página
        const texto = input.value.toLowerCase().trim();
        if (!texto) return;

        // Buscar Pokémon exacto
        const pokemonEncontrado = todosPokemons.find(p => p.name === texto);

        if (pokemonEncontrado) {
            localStorage.setItem('pokemonSeleccionado', pokemonEncontrado.name);
            window.location.href = 'pokemon.html';
        } else {
            resultados.innerHTML = '<p>Pokémon no encontrado</p>';
        }
    });

} else if (paginaActual === 'pokemon.html') {
    // -----------------------------
    // Lógica para pokemon.html
    // -----------------------------

    const nombrePokemon = localStorage.getItem('pokemonSeleccionado');
    const contenedor = document.querySelector('.pokedex__detalle');

    if (!nombrePokemon) {
        contenedor.textContent = 'No se ha seleccionado ningún Pokémon';
    } else {
        // Cargar información del Pokémon seleccionado
        fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
            .then(res => {
                if (!res.ok) throw new Error('No se pudo obtener la información del Pokémon');
                return res.json();
            })
            .then(data => {
                // Crear elementos para mostrar información
                const nombre = document.createElement('p');
                const numero = document.createElement('p');
                const altura = document.createElement('p');
                const peso = document.createElement('p');
                const tipos = document.createElement('p');
                const habilidades = document.createElement('p');
                const img = document.createElement('img');
                const botonVolver = document.createElement('button');

                nombre.textContent = `Nombre: ${data.name}`;
                numero.textContent = `Número en la Pokédex: ${data.id}`;
                altura.textContent = `Altura: ${data.height / 10} m`;
                peso.textContent = `Peso: ${data.weight / 10} kg`;
                tipos.textContent = 'Tipo: ' + data.types.map(t => t.type.name).join(', ');
                const habilidadesArray = data.abilities.slice(0, 2).map(h => h.ability.name);
                habilidades.textContent = 'Habilidades: ' + habilidadesArray.join(', ');
                img.src = data.sprites.front_default;
                img.style.width = '100px';

                // Botón para volver al index
                botonVolver.textContent = 'Volver';
                botonVolver.addEventListener('click', () => {
                    window.location.href = 'index.html';
                });

                contenedor.append(nombre, numero, altura, peso, tipos, habilidades, img, botonVolver);
            })
            .catch(error => {
                contenedor.textContent = 'Error al cargar la información del Pokémon';
                console.error(error);
            });
    }
}
