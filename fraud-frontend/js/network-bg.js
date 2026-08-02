// network-bg.js — animated node network background for the auth page
// Represents transactions as nodes; occasional red pulses = fraud detected

(function () {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, nodes;
    const NODE_COUNT = 46;
    const LINK_DIST = 140;
    const COLORS = { node: 'rgba(199, 204, 211, 0.55)', link: 'rgba(31, 111, 107, 0.35)', risk: 'rgba(192, 57, 43, 0.85)' };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createNodes() {
        nodes = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.6 + 1.2,
            pulse: Math.random() < 0.06, // this node occasionally "flags" red
            pulsePhase: Math.random() * Math.PI * 2
        }));
    }

    function step(time) {
        ctx.clearRect(0, 0, width, height);

        // update positions
        nodes.forEach((n) => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;
        });

        // draw links between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.strokeStyle = COLORS.link;
                    ctx.globalAlpha = 1 - dist / LINK_DIST;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;

        // draw nodes
        nodes.forEach((n) => {
            let color = COLORS.node;
            let radius = n.r;

            if (n.pulse) {
                const glow = (Math.sin(time / 500 + n.pulsePhase) + 1) / 2; // 0..1
                color = COLORS.risk;
                radius = n.r + glow * 2.2;
                ctx.shadowColor = 'rgba(192, 57, 43, 0.6)';
                ctx.shadowBlur = 8 * glow;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(step);
    }

    resize();
    createNodes();
    window.addEventListener('resize', () => { resize(); createNodes(); });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        step(0); // draw one static frame, no animation loop
    } else {
        requestAnimationFrame(step);
    }
})();