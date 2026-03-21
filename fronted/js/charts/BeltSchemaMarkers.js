// Тепловые маркеры поверх схемы конвейерной ленты (SVG-оверлей)

const BELT_PATH_D = 'M822.5 120.5C822.5 120.5 331.5 70 314 70C296.5 70 286.3 80 285.5 98C284.7 116 298 124.5 313 124.5C328 124.5 358.6 93.5 381 95.5C403.4 97.5 409.359 107.169 409.5 122.5C409.715 146 389 150.5 381 150L144.5 129C128.833 129.333 98.5 123.7 102.5 98.5C106.5 73.3 130.5 75 133.5 75C151 75 186.5 122.5 211 122.5C224 122.5 238 111.5 238 98.5C238 91 233.5 68 214.5 68C195.5 68 26 58.5 26 58.5C13.5 57.5 2.99999 45.5 3 29C3.00001 12.5562 15 3 29.5 3C44 3 827 72 827 72H1197.5C1207.5 72 1224 77.5 1224 98C1224 118.5 1206.83 123.167 1197.5 123L822.5 120.5Z';

const SVG_VIEWBOX = '0 0 1227 154';

const STROKE_COLORS = {
  high:   'rgba(234, 90, 63, 0.75)',
  medium: 'rgba(255, 131, 6, 0.75)',
  low:    'rgba(33, 166, 0, 0.75)',
};

const MARKER_W = 14;

export class BeltSchemaMarkers {
  constructor(containerId) {
    this.container  = document.getElementById(containerId);
    this._svg       = null;
    this._tooltip   = null;
    this._data      = null;
    this._pathLen   = null;
    this._measureEl = null;
  }

  _totalLength() {
    if (this._pathLen !== null) return this._pathLen;
    this._ensureMeasurePath();
    this._pathLen = this._measureEl.getTotalLength();
    return this._pathLen;
  }

  // Скрытый path для замеров
  _ensureMeasurePath() {
    if (this._measureEl) return;
    const ns  = 'http://www.w3.org/2000/svg';
    const tmp = document.createElementNS(ns, 'svg');
    tmp.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:0;';
    this._measureEl = document.createElementNS(ns, 'path');
    this._measureEl.setAttribute('d', BELT_PATH_D);
    tmp.appendChild(this._measureEl);
    document.body.appendChild(tmp);
  }

  // Создаёт SVG-оверлей и рисует маркеры и нулевую заклёпку
  render(data) {
    if (!this.container || !data) return;
    this._data = data;

    if (this._svg) this._svg.remove();

    const ns  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', SVG_VIEWBOX);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;overflow:visible;';
    this._svg = svg;

    const L = this._totalLength();
    const { beltLength, zeroPosition = 0, segments } = data;

    segments.forEach(seg => {
      const color = STROKE_COLORS[seg.density];
      if (!color) return;

      const absStart = ((zeroPosition + seg.start) % beltLength + beltLength) % beltLength;
      const p0       = (absStart / beltLength) * L;
      const segLen   = ((seg.end - seg.start) / beltLength) * L;

      const path = this._makePath(color, MARKER_W, p0, segLen, L);
      path.style.cursor        = 'pointer';
      path.style.pointerEvents = 'visibleStroke';

      path.addEventListener('mouseenter', (e) => this._showTooltip(e, `${seg.start} – ${seg.end} м`));
      path.addEventListener('mousemove',  (e) => this._moveTooltip(e));
      path.addEventListener('mouseleave', ()  => this._hideTooltip());

      svg.appendChild(path);
    });

    const zeroP   = (zeroPosition / beltLength) * L;
    const zeroLen = Math.max(4, L * 0.007);
    svg.appendChild(this._makePath('rgba(39,67,129,0.95)', MARKER_W + 6, zeroP, zeroLen, L));

    const pt = this._measureEl.getPointAtLength(zeroP + zeroLen / 2);
    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', pt.x);
    text.setAttribute('y', pt.y + 0.5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '8');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('font-family', 'Inter, sans-serif');
    text.setAttribute('pointer-events', 'none');
    text.textContent = '0';
    svg.appendChild(text);

    this.container.appendChild(svg);
  }

  _makePath(color, strokeW, p0, segLen, L) {
    const ns   = 'http://www.w3.org/2000/svg';
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', BELT_PATH_D);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', strokeW);
    path.setAttribute('stroke-linecap', 'butt');
    path.setAttribute('stroke-dasharray', `0 ${p0} ${segLen} ${L}`);
    return path;
  }

  _showTooltip(e, text) {
    if (!this._tooltip) {
      this._tooltip           = document.createElement('div');
      this._tooltip.className = 'belt-marker-tooltip';
      document.body.appendChild(this._tooltip);
    }
    this._tooltip.textContent = text;
    this._moveTooltip(e);
  }

  _moveTooltip(e) {
    if (!this._tooltip) return;
    this._tooltip.style.left = (e.clientX + 14) + 'px';
    this._tooltip.style.top  = (e.clientY - 36) + 'px';
  }

  _hideTooltip() {
    if (this._tooltip) {
      this._tooltip.remove();
      this._tooltip = null;
    }
  }
}
