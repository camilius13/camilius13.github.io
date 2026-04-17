let todasLasZonas = [];

async function cargarZonas() {
    try {
        const respuesta = await fetch('data/data.json');
        todasLasZonas = await respuesta.json();
        
       
        renderizarGrid(todasLasZonas);
        
        
        configurarFiltros();

    } catch (error) {
        console.error("Error cargando las zonas:", error);
    }
}


function renderizarGrid(zonas) {
    const contenedor = document.getElementById('grid-zonas');
    contenedor.innerHTML = ''; 

    zonas.forEach((zona, index) => {
        const cardHTML = `
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="zone-card" onclick="seleccionarZona(${zona.id})">
                    <div class="card-img-wrapper">
                        <img src="${zona.imagen}" alt="${zona.nombre}">
                        <div class="card-overlay">
                            <span>Explorar lugar →</span>
                        </div>
                    </div>
                    <div class="card-body-uao">
                        <span class="category">Categoría ${zona.categoria}</span>
                        <h3>${zona.nombre}</h3>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });

    
    AOS.refresh();
}


function configurarFiltros() {
    const botones = document.querySelectorAll('.filter-btn');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            
            botones.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            
            const categoria = boton.getAttribute('data-category');

        
            if (categoria === 'Todo') {
                renderizarGrid(todasLasZonas);
            } else {
                const filtradas = todasLasZonas.filter(z => z.categoria === categoria);
                renderizarGrid(filtradas);
            }
        });
    });
}

function seleccionarZona(id) {
    window.location.href = `detalle.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', cargarZonas);