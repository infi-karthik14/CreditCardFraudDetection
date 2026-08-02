// pulse.js — renders an ECG-style line into any element with data-pulse
// spikePositions: array of x-fractions (0-1) where a "fraud spike" should occur

function renderPulse(el, { spikePositions = [0.62], width = 900, height = 100, animate = true, colorRisk = false } = {}) {
    const points = [];
    const steps = 140;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let y = height / 2 + Math.sin(t * Math.PI * 10) * 3; // gentle baseline wobble

        const nearSpike = spikePositions.some(sp => Math.abs(t - sp) < 0.02);
        if (nearSpike) {
            const local = spikePositions.find(sp => Math.abs(t - sp) < 0.02);
            const d = (t - local) / 0.02; // -1..1
            y = height / 2 - Math.cos(d * Math.PI / 2) * (height * 0.42) * (1 - Math.abs(d));
        }
        points.push([t * width, y]);
    }

    const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
    const lineClass = colorRisk ? 'spike' : '';

    el.innerHTML = `
    <svg class="pulse-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <path class="pulse-line ${lineClass}" d="${path}"
        stroke-dasharray="${animate ? 1400 : 0}"
        stroke-dashoffset="${animate ? 1400 : 0}"
        style="${animate ? 'animation: draw 2.6s ease-out forwards;' : ''}"/>
    </svg>`;

    if (animate && !document.getElementById('pulse-keyframes')) {
        const style = document.createElement('style');
        style.id = 'pulse-keyframes';
        style.textContent = `@keyframes draw { to { stroke-dashoffset: 0; } }`;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-pulse]').forEach((el) => {
        const spikes = el.dataset.pulseSpikes ? JSON.parse(el.dataset.pulseSpikes) : [0.62];
        renderPulse(el, { spikePositions: spikes });
    });
});