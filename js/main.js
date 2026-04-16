async function cargarZonas() {
    try {
        const respuesta = await fetch('data/data.json');
        const zonas = await respuesta.json();
        const contenedor = document.getElementById('grid-zonas');
        
        contenedor.innerHTML = ''; 

        zonas.forEach((zona, index) => {
            // estructura HTML 
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

    } catch (error) {
        console.error("Error cargando las zonas:", error);
    }
}

function seleccionarZona(id) {
    window.location.href = `detalle.html?id=${id}`;
    console.log("Navegando a la zona con ID:", id);
    
}



document.addEventListener('DOMContentLoaded', cargarZonas);