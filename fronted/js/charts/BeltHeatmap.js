// Тепловая карта дефектов ленты по ширине (canvas)

const DENSITY_COLORS = {
  none:   '#274ea6',
  low:    '#9aac5a',
  medium: '#c0614c',
  high:   '#d4893a',
};

const RULER_H    = 28;
const BELT_H     = 280;
const TICK_MAJOR = 150;
const TICK_MINOR = 30;

export class BeltHeatmap {
  constructor(canvasId) {
    this.canvas   = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx      = this.canvas.getContext('2d');
    this._tooltip = null;
    this._segments    = [];
    this._scale       = 1;
    this._beltY       = RULER_H;
    this._beltH       = BELT_H;
    this.canvas.addEventListener('mousemove',  (e) => this._onMove(e));
    this.canvas.addEventListener('mouseleave', ()  => this._hideTooltip());
  }

  render(data) {
    if (!this.canvas || !data) return;

    const { beltLength, segments } = data;

    const dpr  = window.devicePixelRatio || 1;
    const cssW = this.canvas.parentElement.clientWidth || 1340;
    const cssH = RULER_H * 2 + BELT_H;

    this.canvas.style.width  = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.canvas.width  = cssW * dpr;
    this.canvas.height = cssH * dpr;

    const ctx   = this.ctx;
    ctx.scale(dpr, dpr);

    const beltY = RULER_H;
    const scale = cssW / beltLength;

    this._segments = segments;
    this._scale    = scale;

    ctx.clearRect(0, 0, cssW, cssH);

    ctx.fillStyle = DENSITY_COLORS.none;
    ctx.fillRect(0, beltY, cssW, BELT_H);

    segments.forEach(seg => {
      const x = seg.start * scale;
      const w = (seg.end - seg.start) * scale;
      ctx.fillStyle = DENSITY_COLORS[seg.density] ?? DENSITY_COLORS.none;
      ctx.fillRect(x, beltY, w, BELT_H);
    });

    this._drawRuler(ctx, 0,                beltLength, scale, 'top');
    this._drawRuler(ctx, RULER_H + BELT_H, beltLength, scale, 'bottom');
  }

  _onMove(e) {
    const rect  = this.canvas.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;

    if (y < this._beltY || y > this._beltY + this._beltH) {
      this._hideTooltip();
      return;
    }

    const mm  = x / this._scale;
    const seg = this._segments.find(s => s.density !== 'none' && mm >= s.start && mm <= s.end);
    if (seg) {
      this._showTooltip(e, `${seg.start} – ${seg.end} мм`);
    } else {
      this._hideTooltip();
    }
  }

  _showTooltip(e, text) {
    if (!this._tooltip) {
      this._tooltip           = document.createElement('div');
      this._tooltip.className = 'belt-marker-tooltip';
      document.body.appendChild(this._tooltip);
    }
    this._tooltip.textContent = text;
    this._tooltip.style.left  = (e.clientX + 14) + 'px';
    this._tooltip.style.top   = (e.clientY - 36) + 'px';
  }

  _hideTooltip() {
    if (this._tooltip) {
      this._tooltip.remove();
      this._tooltip = null;
    }
  }

  // Рисует линейку с делениями сверху или снизу ленты
  _drawRuler(ctx, y, beltLength, scale, position) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let mm = 0; mm <= beltLength; mm += TICK_MINOR) {
      const x       = Math.round(mm * scale);
      const isMajor = mm % TICK_MAJOR === 0;
      const tickLen = isMajor ? 10 : 5;

      ctx.beginPath();
      if (position === 'top') {
        ctx.moveTo(x, y + RULER_H);
        ctx.lineTo(x, y + RULER_H - tickLen);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + tickLen);
      }
      ctx.stroke();

      if (isMajor) {
        ctx.fillStyle = '#333';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = mm === 0 ? 'left' : mm === beltLength ? 'right' : 'center';

        const label = mm === 0 ? '0 мм' : mm === beltLength ? `${mm} мм` : String(mm);
        const textY = position === 'top'
          ? y + RULER_H - tickLen - 4
          : y + tickLen + 13;

        ctx.fillText(label, x, textY);
      }
    }
  }
}
