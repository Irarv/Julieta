// Carga del archivo de audio incorporado
const audio = new Audio('musica.mp3');
audio.loop = true; // Para que la música no se corte mientras lee la carta

// Elementos del DOM
const matchstick = document.getElementById('matchstick');
const fireContainer = document.getElementById('fire-container');
const matchHead = document.getElementById('match-head');
const charredLayer = document.getElementById('charred-layer');
const instruction = document.getElementById('instruction');
const leftMessages = document.getElementById('left-messages');
const rightMessages = document.getElementById('right-messages');
const finalScreen = document.getElementById('final-screen');
const sparksContainer = document.getElementById('sparks-container');

let isDragging = false;
let startY = 0;
let currentY = 0;
let ignited = false;

// Configuración de tus Frases Personalizadas (Mínimo 5 segundos cada una)
const storyPhrases = [
    { side: 'left', text: "Sé que apenas nos estamos conociendo y que queremos ir paso a paso... ✨" },
    { side: 'right', text: "Pero desde que empezamos a hablar, me di cuenta de que eres alguien diferente. 😊" },
    { side: 'left', text: "Me encanta tu forma de ser y la seguridad que me transmites. 🌌" },
    { side: 'right', text: "No hay prisa, disfruto mucho cada momento y cada risa contigo, solo espero que sigamos conociéndonos más. 🤍" }
];

// --- SISTEMA DE ARRASTRE DEL FÓSFORO ---
function dragStart(e) {
    if (ignited) return;
    isDragging = true;
    startY = e.clientY || e.touches[0].clientY;
    matchstick.style.transition = 'none';
}

function dragMove(e) {
    if (!isDragging || ignited) return;
    const clientY = e.clientY || e.touches[0].clientY;
    let deltaY = startY - clientY;

    if (deltaY > 0) {
        currentY = Math.min(deltaY, 100);
        matchstick.style.transform = `translateY(-${currentY}px)`;

        // Umbral de encendido
        if (currentY > 65) {
            isDragging = false;
            igniteMatch();
        }
    }
}

function dragEnd() {
    if (ignited || !isDragging) return;
    isDragging = false;
    matchstick.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    matchstick.style.transform = 'translateY(0px)';
}

// Listeners de mouse y touch
matchstick.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);
matchstick.addEventListener('touchstart', dragStart);
window.addEventListener('touchmove', dragMove);
window.addEventListener('touchend', dragEnd);

// --- MECÁNICA DE ENCENDIDO Y CONSUMO DE MADERA ---
function igniteMatch() {
    ignited = true;
    instruction.style.opacity = '0';
    
    // 1. Iniciar la música
    audio.play().catch(err => console.log("Interacción requerida para audio:", err));

    // 2. Encender Fuego Visual
    fireContainer.classList.add('active');
    matchHead.style.background = '#111'; // Se carboniza la cabeza al instante
    matchHead.style.transform = 'scale(0.95)';
    
    // Retornar suavemente a la base para empezar a quemarse de arriba a abajo
    matchstick.style.transition = 'transform 0.4s ease';
    matchstick.style.transform = 'translateY(0px)';

    // Ambientación de iluminación ambiental naranja en los bordes del navegador
    document.body.style.boxShadow = "inset 0 0 120px rgba(255, 130, 0, 0.35)";
    document.body.style.background = "#090705";

    // 3. Simulación en tiempo real del fuego bajando y consumiendo la madera
    let burnDuration = 22000; // El fósforo durará 22 segundos encendido en total
    let startTime = Date.now();

    let burnInterval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let progress = elapsed / burnDuration;

        if (progress >= 1) {
            clearInterval(burnInterval);
            extinguishMatch();
        } else {
            // El fuego va bajando (desplazamiento en píxeles hacia abajo)
            let fireOffset = progress * 210; 
            fireContainer.style.top = `calc(-60px + ${fireOffset}px)`;
            
            // La capa de madera quemada (carbón) va bajando al mismo ritmo
            charredLayer.style.height = `${progress * 100}%`;
        }
    }, 50);

    // 4. Desplegar los mensajes laterales espaciados (Cada uno dura 5.5 segundos)
    storyPhrases.forEach((phrase, index) => {
        setTimeout(() => {
            displaySideMessage(phrase.side, phrase.text);
        }, index * 5500); // 5500ms = 5.5 segundos de separación mínima
    });
}

// --- IMPRESIÓN MÁQUINA DE ESCRIBIR EN LOS LATERALES ---
function displaySideMessage(side, text) {
    const bubble = document.createElement('div');
    bubble.classList.add('text-bubble');
    
    const targetContainer = (side === 'left') ? leftMessages : rightMessages;
    targetContainer.appendChild(bubble);

    let charIndex = 0;
    function typeChar() {
        if (charIndex < text.length) {
            bubble.innerHTML += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 45); // Velocidad natural de tipeo
        }
    }
    typeChar();
}

// --- APAGADO DEL FÓSFORO Y TRANSICIÓN FINAL ---
function extinguishMatch() {
    fireContainer.classList.remove('active');
    document.body.style.boxShadow = "none";
    document.body.style.background = "#050508";

    // Pequeño momento de oscuridad dramática antes de la carta (2 segundos)
    setTimeout(() => {
        finalScreen.classList.add('show');
        launchFinalSparks();
    }, 2000);
}

// --- EFECTO DE DECORACIÓN FINAL (CHISPAS AMARILLAS FLOTANTES) ---
function launchFinalSparks() {
    for (let i = 0; i < 30; i++) {
        const spark = document.createElement('div');
        spark.innerHTML = '✨';
        spark.style.position = 'absolute';
        spark.style.left = Math.random() * 100 + 'vw';
        spark.style.bottom = '-30px';
        spark.style.fontSize = (Math.random() * 14 + 10) + 'px';
        spark.style.opacity = Math.random() * 0.6 + 0.4;
        spark.style.animation = `floatUpSpark ${Math.random() * 4 + 4}s linear infinite`;
        sparksContainer.appendChild(spark);
    }
}

// Estilos de animación extras inyectados por JS para las chispas doradas de la carta
const style = document.createElement('style');
style.innerHTML = `
    @keyframes floatUpSpark {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
        100% { transform: translateY(-110vh) rotate(180deg); opacity: 0; }
    }
`;
document.head.appendChild(style);