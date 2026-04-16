document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const zonaId = params.get('id');

    if (!zonaId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch('data/data.json');
        const zonas = await res.json();
        const zona = zonas.find(z => z.id == zonaId);

        if (zona) {
            renderizarDetalle(zona);
            
            inicializarAudio(zona.audio); 
        }
    } catch (error) {
        console.error("Error cargando detalle:", error);
    }
});

function renderizarDetalle(zona) {
    const contenedor = document.getElementById('detalle-contenido');
    
    
    let galeriaHTML = zona.galeria.map(foto => `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="gallery-item shadow-sm">
                <img src="${foto}" alt="Imagen de ${zona.nombre}" class="img-fluid rounded-4">
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <section class="row g-5 align-items-center mb-5 pb-5">
            <div class="col-lg-6">
                <div class="card-img-wrapper rounded-5 shadow-lg overflow-hidden" style="aspect-ratio: 4/5;">
                    <img src="${zona.imagen}" class="w-100 h-100 object-fit-cover" alt="${zona.nombre}">
                </div>
            </div>
            <div class="col-lg-6">
                <span class="badge-uao">${zona.categoria}</span>
                <h1 class="display-3 fw-bold mt-2">${zona.nombre}</h1>
                <p class="lead text-muted mt-4">${zona.descripcion_larga}</p>
                
                <div class="audio-experience mt-5">
                    <p class="small fw-800 text-muted mb-3 letter-spacing-1">PAISAJE SONORO</p>
                    <div class="custom-player">
                        <button class="play-btn" id="btnPlayPause">
                            <i data-feather="play" id="iconPlay"></i>
                        </button>
                        <div class="player-controls">
                            <div class="progress-wrapper" id="progressContainer">
                                <div class="progress-bar-fill" id="barFill"></div>
                            </div>
                            <div class="d-flex justify-content-between mt-2">
                                <span class="time-text" id="timeCurrent">0:00</span>
                                <span class="time-text" id="timeTotal">0:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 mb-5 rounded-5 shadow-sm overflow-hidden" style="background-color: #121212; color: white;">
            <div class="row g-0 align-items-center">
                <div class="col-md-5 p-5">
                    <h2 class="fw-bold mb-4" style="color: #FF051E;">Punto de Vista</h2>
                    <p class="opacity-75">Acompaña la experiencia sonora con un recorrido visual exclusivo de este espacio.</p>
                </div>
                <div class="col-md-7">
                    <video class="w-100 shadow-lg" controls style="display: block; border-radius: 0;">
                        <source src="${zona.video}" type="video/mp4">
                        Tu navegador no soporta videos.
                    </video>
                </div>
            </div>
        </section>

        <section class="py-5">
            <h2 class="fw-bold mb-5">Galería Fotográfica</h2>
            <div class="row g-4">${galeriaHTML}</div>
        </section>
    `;
    
    feather.replace();
}


function inicializarAudio(rutaAudio) {
    const audio = new Audio(rutaAudio);
    const btn = document.getElementById('btnPlayPause');
    const fill = document.getElementById('barFill');
    const container = document.getElementById('progressContainer');
    const timeCurrent = document.getElementById('timeCurrent');
    const timeTotal = document.getElementById('timeTotal');

    
    audio.onloadedmetadata = () => {
        timeTotal.innerText = formatTime(audio.duration);
    };

    btn.onclick = () => {
        const icon = btn.querySelector('i') || btn.querySelector('svg');
        if (audio.paused) {
            audio.play();
            icon.setAttribute('data-feather', 'pause');
        } else {
            audio.pause();
            icon.setAttribute('data-feather', 'play');
        }
        if (typeof feather !== 'undefined') feather.replace();
    };

    
    audio.ontimeupdate = () => {
        
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            fill.style.width = pct + '%';
        }
        
        
        timeCurrent.innerText = formatTime(audio.currentTime);
        
        
        if (!isNaN(audio.duration) && timeTotal.innerText === "0:00") {
            timeTotal.innerText = formatTime(audio.duration);
        }
    };

    container.onclick = (e) => {
        const rect = container.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pos * audio.duration;
    };

    audio.onended = () => {
        const icon = btn.querySelector('i') || btn.querySelector('svg');
        icon.setAttribute('data-feather', 'play');
        fill.style.width = '0%';
        timeCurrent.innerText = "0:00";
        if (typeof feather !== 'undefined') feather.replace();
    };
}


function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}