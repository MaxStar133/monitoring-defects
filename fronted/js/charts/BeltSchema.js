// js/charts/BeltSchema.js
// Схема конвейерной ленты — точные координаты из Figma

const DESIGN_W = 1221;
const DESIGN_H = 147.04;

// Ролики: left/top — координаты левого верхнего угла (56×56)
const ROLLERS = [
  { left: 0.5,    top: 0    },  // Ellipse 5 (левый ведущий)
  { left: 99.5,   top: 70   },  // Ellipse 4
  { left: 178.5,  top: 63   },  // Ellipse 3
  { left: 281.5,  top: 66   },  // Ellipse 1
  { left: 348.5,  top: 91   },  // Ellipse 2
  { left: 1167.5, top: 66   },  // Ellipse 6 (правый ведущий)
];
const ROLLER_D = 56; // диаметр

// Дефекты: точные данные из Figma
const DEFECTS = [
  { x: 861,    y: 61,     w: 79,     h: 17,     angle: 0,    color: 'rgba(234,90,63,0.7)'   },
  { x: 54,     y: 49,     w: 79,     h: 17,     angle: 2.74, color: 'rgba(234,90,63,0.7)'   },
  { x: 386.54, y: 93.84,  w: 27.32,  h: 55.34,  angle: 2.74, color: 'rgba(234,90,63,0.7)'   },
  { x: 921,    y: 110,    w: 79,     h: 17,     angle: 0,    color: 'rgba(254,250,137,0.7)' },
  { x: 289.43, y: 13.61,  w: 305.49, h: 17,     angle: 5.16, color: 'rgba(255,131,6,0.7)'   },
  { x: 212,    y: 123,    w: 79,     h: 17,     angle: 5.16, color: 'rgba(255,131,6,0.7)'   },
];

export class BeltSchema {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
  }

  render() {
    if (!this.canvas) return;

    const PAD  = 10; // отступ сверху и снизу в px
    const dpr  = window.devicePixelRatio || 1;
    const cssW = this.canvas.parentElement.clientWidth || DESIGN_W;
    const cssH = Math.round(cssW * (DESIGN_H / DESIGN_W)) + PAD * 2;

    this.canvas.style.width  = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.canvas.width  = cssW * dpr;
    this.canvas.height = cssH * dpr;

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.translate(0, PAD); // сдвиг вниз на padding

    const sx = cssW / DESIGN_W;
    const sy = (cssH - PAD * 2) / DESIGN_H;

    // --- 1. Ролики ---
    this._drawRollers(ctx, sx, sy);

    // --- 2. Контур ленты (поверх роликов) ---
    this._drawBelt(ctx, sx, sy);

    ctx.restore();
  }

  _drawBelt(ctx, sx, sy) {
    // Вычисляем центры роликов
    const r = ROLLER_D / 2;
    const rollers = ROLLERS.map(ro => ({
      cx: (ro.left + r) * sx,
      cy: (ro.top  + r) * sy,
      rx: r * sx,
      ry: r * sy,
    }));

    const [r0, r1, r2, r3, r4, r5] = rollers;

    ctx.save();
    ctx.strokeStyle = '#274381';
    ctx.lineWidth   = 6 * sx;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    // Путь ленты — касательные между роликами
    // Верхняя касательная: r0 (вверх) → r5
    // Нижняя: r5 → r4 → r3 → r2 → r1 → r0

    ctx.beginPath();

    // Верхняя ветвь: от верхней точки r0 до верхней точки r5
    ctx.moveTo(r0.cx, r0.cy - r0.ry);
    ctx.lineTo(r5.cx, r5.cy - r5.ry);

    // Правый ведущий ролик: верх → низ (по правой стороне)
    ctx.arc(r5.cx, r5.cy, r5.rx, -Math.PI / 2, Math.PI / 2, false);

    // Нижняя ветвь к r4 (от нижней точки r5 к правому экватору r4)
    ctx.lineTo(r4.cx + r4.rx, r4.cy);
    // Поверх r4 (CCW сверху) — нижний ролик правой пары
    ctx.arc(r4.cx, r4.cy, r4.rx, 0, Math.PI, true);

    // Под r3 (CW снизу) — верхний ролик правой пары
    ctx.lineTo(r3.cx + r3.rx, r3.cy);
    ctx.arc(r3.cx, r3.cy, r3.rx, 0, Math.PI, false);

    // Под r2 — r2 внутри нижней петли
    ctx.lineTo(r2.cx + r2.rx, r2.cy);
    ctx.arc(r2.cx, r2.cy, r2.rx, 0, Math.PI, false);

    // Над r1 — r1 внутри верхней петли
    ctx.lineTo(r1.cx + r1.rx, r1.cy);
    ctx.arc(r1.cx, r1.cy, r1.rx, 0, Math.PI, true);

    // Левый ведущий ролик: снизу → вверх (по левой стороне)
    ctx.lineTo(r0.cx, r0.cy + r0.ry);
    ctx.arc(r0.cx, r0.cy, r0.rx, Math.PI / 2, -Math.PI / 2, false);

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  _drawRollers(ctx, sx, sy) {
    const r = ROLLER_D / 2;
    ROLLERS.forEach(ro => {
      const cx = (ro.left + r) * sx;
      const cy = (ro.top  + r) * sy;
      const rx = r * sx;
      const ry = r * sy;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle   = 'rgba(167,172,7,0.8)';
      ctx.fill();
      ctx.strokeStyle = '#5a5e00';
      ctx.lineWidth   = 1.5 * sx;
      ctx.stroke();
      ctx.restore();
    });
  }

  _drawDefects(ctx, sx, sy) {
    DEFECTS.forEach(d => {
      ctx.save();

      const cx = (d.x + d.w / 2) * sx;
      const cy = (d.y + d.h / 2) * sy;

      ctx.translate(cx, cy);
      ctx.rotate((d.angle * Math.PI) / 180);

      ctx.filter    = 'blur(2.5px)';
      ctx.fillStyle = d.color;
      ctx.fillRect(
        -(d.w / 2) * sx,
        -(d.h / 2) * sy,
        d.w * sx,
        d.h * sy
      );

      ctx.restore();
    });
  }
}
