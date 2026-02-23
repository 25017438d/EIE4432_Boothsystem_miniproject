/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
(function () {
  const mapWrapper = document.querySelector('.booth-map-wrapper');
  const svg = document.getElementById('editorMap');
  const selectedPanel = document.getElementById('editorSelected');
  let selectedEl = null;
  let dragState = null;
  const deletedIds = new Set();
  let sections = Array.isArray(window.__eventSections) ? window.__eventSections.slice() : [];
  const deletedSections = new Set();
  const boothWidth = 140;
  const boothHeight = 120;
  const gapY = 24;
  const floorSpacing = 60;
  let scale = 1;
  const minScale = 0.5;
  const maxScale = 2.0;
  const scaleStep = 0.05;
  function getViewBoxSize() {
    try {
      const vb = svg.viewBox.baseVal;
      return { w: vb.width || svg.clientWidth || 800, h: vb.height || svg.clientHeight || 760 };
    } catch (e) {
      const vbAttr = svg.getAttribute('viewBox') || '0 0 820 760';
      const parts = vbAttr.split(/[ ,]+/).map(Number);
      return { w: parts[2] || 820, h: parts[3] || 760 };
    }
  }

  const applyScale = (s, centerClientX, centerClientY) => {
    s = Math.max(minScale, Math.min(maxScale, s));
    if (!mapWrapper) return (scale = s);
    const vb = getViewBoxSize();
    const prevWidth = vb.w * scale;
    const prevHeight = vb.h * scale;
    const newWidth = Math.round(vb.w * s);
    const newHeight = Math.round(vb.h * s);

    if (typeof centerClientX !== 'undefined') {
      const rect = mapWrapper.getBoundingClientRect();
      const offsetX = centerClientX - rect.left + mapWrapper.scrollLeft;
      const offsetY = centerClientY - rect.top + mapWrapper.scrollTop;
      const relX = prevWidth > 0 ? offsetX / prevWidth : 0;
      const relY = prevHeight > 0 ? offsetY / prevHeight : 0;

      svg.style.width = newWidth + 'px';
      svg.style.height = newHeight + 'px';

      mapWrapper.scrollLeft = Math.round(relX * newWidth - (centerClientX - rect.left));
      mapWrapper.scrollTop = Math.round(relY * newHeight - (centerClientY - rect.top));
    } else {
      svg.style.width = newWidth + 'px';
      svg.style.height = newHeight + 'px';
    }

    scale = s;
    const range = document.getElementById('zoomRange');
    if (range) range.value = Math.round(scale * 100);
  };

  function setupZoomPan() {
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const zoomReset = document.getElementById('zoomReset');
    const zoomRange = document.getElementById('zoomRange');
    if (!mapWrapper || !svg) return;

    mapWrapper.addEventListener('wheel', (ev) => {
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault();
        const delta = ev.deltaY > 0 ? -scaleStep : scaleStep;
        applyScale(scale + delta, ev.clientX, ev.clientY);
      }
    }, { passive: false });

    if (zoomIn) zoomIn.addEventListener('click', () => applyScale(scale + scaleStep));
    if (zoomOut) zoomOut.addEventListener('click', () => applyScale(scale - scaleStep));
    if (zoomReset) zoomReset.addEventListener('click', () => applyScale(1));

    if (zoomRange) {
      zoomRange.addEventListener('input', (ev) => {
        const v = Number(ev.target.value) / 100;
        applyScale(v);
      });
    }

    let panning = false;
    let panStart = { x: 0, y: 0, left: 0, top: 0 };
    mapWrapper.addEventListener('pointerdown', (ev) => {
      if (ev.target === mapWrapper || ev.target === svg || ev.target.tagName === 'rect' && ev.target.parentElement === svg) {
        panning = true;
        mapWrapper.setPointerCapture && mapWrapper.setPointerCapture(ev.pointerId);
        panStart = { x: ev.clientX, y: ev.clientY, left: mapWrapper.scrollLeft, top: mapWrapper.scrollTop };
        mapWrapper.style.cursor = 'grabbing';
      }
    });
    window.addEventListener('pointermove', (ev) => {
      if (!panning) return;
      const dx = ev.clientX - panStart.x;
      const dy = ev.clientY - panStart.y;
      mapWrapper.scrollLeft = panStart.left - dx;
      mapWrapper.scrollTop = panStart.top - dy;
    });
    window.addEventListener('pointerup', (ev) => {
      if (!panning) return;
      panning = false;
      mapWrapper.style.cursor = '';
      try { mapWrapper.releasePointerCapture && mapWrapper.releasePointerCapture(ev.pointerId); } catch (e) {}
    });
  }

  function getTranslate(el) {
    const t = el.getAttribute('transform') || 'translate(0, 0)';
    const m = t.match(/translate\(([-0-9\.]+)[,\s]+([-0-9\.]+)\)/);
    if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
    return { x: 0, y: 0 };
  }

  function extendSvgBy(delta) {
    const vb = getViewBoxSize();
    const newH = Math.round(vb.h + delta);
    svg.setAttribute('viewBox', `0 0 ${vb.w} ${newH}`);
    svg.style.height = newH + 'px';
    return vb.h;
  }

  function ensureHeadingForSection(s) {
    if (!svg) return;
    const floorKey = String(s.floor);
    let heading = svg.querySelector(`text.map-title[data-floor="${floorKey}"]`);
    if (heading) {
      heading.textContent = s.floorLabel || ('Floor ' + floorKey);
      return;
    }
    const addHeight = boothHeight + gapY + floorSpacing;
    const prevH = extendSvgBy(addHeight);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const vb = getViewBoxSize();
    const midX = vb.w / 2;
    const y = prevH + 30;
    text.setAttribute('x', String(midX));
    text.setAttribute('y', String(y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'map-title');
    text.setAttribute('data-floor', floorKey);
    text.textContent = s.floorLabel || ('Floor ' + floorKey);
    svg.appendChild(text);
  }

  function setTranslate(el, x, y) {
    el.setAttribute('transform', `translate(${x}, ${y})`);
    el.dataset.x = x;
    el.dataset.y = y;
  }

  function onSelect(el) {
    if (selectedEl) selectedEl.classList.remove('editing');
    selectedEl = el;
    selectedEl.classList.add('editing');
    renderSelectedForm(selectedEl);
  }

  function renderSelectedForm(el) {
    const id = el.dataset.boothId;
    const label = el.dataset.boothLabel || '';
    const tier = el.dataset.boothTier || '';
    const price = el.dataset.boothPrice || '';
    const disabled = el.dataset.boothDisabled === 'true';
    selectedPanel.innerHTML = `
      <form id="selectedForm">
        <div class="mb-2">
          <label class="form-label">Booth ID / Code</label>
          <input class="form-control" name="id" value="${id}" disabled />
        </div>
        <div class="mb-2">
          <label class="form-label">Label</label>
          <input class="form-control" name="label" value="${escapeHtml(label)}" />
        </div>
        <div class="mb-2">
          <label class="form-label">Tier</label>
          <select class="form-select" name="tier">
            <option value="premium" ${tier === 'premium' ? 'selected' : ''}>Premium</option>
            <option value="standard" ${tier === 'standard' ? 'selected' : ''}>Standard</option>
            <option value="economy" ${tier === 'economy' ? 'selected' : ''}>Economy</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="form-label">Section</label>
          <select class="form-select" name="section" id="selectedSectionSelect">
            ${sections.map(s => `<option value="${escapeHtml(s.floor)}" ${String(s.floor) === String(el.dataset.boothFloor || '') ? 'selected' : ''}>${escapeHtml(s.floorLabel || ('Floor ' + s.floor))}</option>`).join('')}
          </select>
        </div>
        <div class="mb-2">
          <label class="form-label">Price (HK$)</label>
          <input class="form-control" name="price" value="${price}" />
        </div>
        <div class="form-check form-switch mb-2">
          <input class="form-check-input" type="checkbox" id="disabledSwitch" name="disabled" ${disabled ? 'checked' : ''} />
          <label class="form-check-label" for="disabledSwitch">Disabled</label>
        </div>
        <div class="d-grid gap-2 mt-2">
          <button type="submit" class="btn btn-primary">Apply</button>
          <div class="d-flex gap-2">
            <button type="button" id="deleteBoothBtn" class="btn btn-sm btn-danger">Delete Booth</button>
            <button type="button" id="deselectBtn" class="btn btn-outline-secondary">Deselect</button>
          </div>
        </div>
      </form>
    `;

    document.getElementById('selectedForm').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const form = ev.target;
      const labelV = form.label.value.trim();
      const tierV = form.tier.value;
      const priceV = form.price.value.trim();
      const disabledV = !!form.disabled.checked;
      const sectionV = form.section ? form.section.value : null;
      selectedEl.dataset.boothLabel = labelV;
      selectedEl.dataset.boothTier = tierV;
      selectedEl.dataset.boothPrice = priceV;
      selectedEl.dataset.boothDisabled = disabledV;
      const labelNode = selectedEl.querySelector('.booth-label');
      if (labelNode) labelNode.textContent = labelV;
      const statusNode = selectedEl.querySelector('.map-status');
      if (statusNode) statusNode.textContent = `${tierV}${priceV ? ' • HK$'+priceV : ''}`;
      if (sectionV) {
        const sec = sections.find(s => String(s.floor) === String(sectionV));
        selectedEl.dataset.boothFloor = String(sectionV);
        selectedEl.dataset.boothFloorLabel = sec ? (sec.floorLabel || '') : '';
      }
    });

    document.getElementById('deselectBtn').addEventListener('click', () => {
      if (selectedEl) selectedEl.classList.remove('editing');
      selectedEl = null;
      selectedPanel.innerHTML = '<p class="text-muted">No booth selected. Click a booth to edit.</p>';
    });

    document.getElementById('deleteBoothBtn').addEventListener('click', () => {
      if (!selectedEl) return;
      const id = selectedEl.dataset.boothId;
      if (id && !id.startsWith('new-')) {
        deletedIds.add(id);
      }
      selectedEl.remove();
      selectedEl = null;
      selectedPanel.innerHTML = '<p class="text-muted">No booth selected. Click a booth to edit.</p>';
    });
  }

  function createBoothNode(opts) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('booth', 'editable-booth');
    const id = opts.id || `new-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    g.dataset.boothId = id;
    g.dataset.boothLabel = opts.label || id;
    g.dataset.boothTier = opts.tier || 'standard';
    g.dataset.boothPrice = opts.price || '';
  g.dataset.boothDisabled = !!opts.disabled;
  g.dataset.boothFloor = (typeof opts.floor !== 'undefined') ? String(opts.floor) : (sections[0] ? String(sections[0].floor) : '1');
  g.dataset.boothFloorLabel = opts.floorLabel || (sections[0] ? sections[0].floorLabel || '' : '');
    g.setAttribute('transform', `translate(${opts.x||70}, ${opts.y||70})`);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', 140);
    rect.setAttribute('height', 120);
    rect.setAttribute('rx', 12);
    rect.setAttribute('ry', 12);
    const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t1.setAttribute('x', 70);
    t1.setAttribute('y', 46);
    t1.setAttribute('text-anchor', 'middle');
    t1.classList.add('booth-label');
    t1.textContent = opts.label || id;
    const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t2.setAttribute('x', 70);
    t2.setAttribute('y', 74);
    t2.setAttribute('text-anchor', 'middle');
    t2.classList.add('booth-theme');
    t2.textContent = opts.theme || '';
    const t3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t3.setAttribute('x', 70);
    t3.setAttribute('y', 98);
    t3.setAttribute('text-anchor', 'middle');
    t3.classList.add('map-status');
    t3.textContent = `${opts.tier || 'standard'}${opts.price ? ' • HK$'+opts.price : ''}`;
    g.appendChild(rect);
    g.appendChild(t1);
    g.appendChild(t2);
    g.appendChild(t3);
    return g;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":"&#39;"})[c]);
  }

  function enableDragging() {
    const booths = svg.querySelectorAll('.editable-booth');
    booths.forEach((g) => {
      g.style.touchAction = 'none';
      g.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        g.setPointerCapture && g.setPointerCapture(ev.pointerId);
        const start = getTranslate(g);
        const potential = {
          el: g,
          startX: ev.clientX,
          startY: ev.clientY,
          origX: start.x,
          origY: start.y,
          moved: false
        };

        const pointerMoveHandler = (moveEv) => {
          const dx = moveEv.clientX - potential.startX;
          const dy = moveEv.clientY - potential.startY;
          const distSq = dx * dx + dy * dy;
          const threshold = 6 * 6;
          if (!potential.moved && distSq > threshold) {
            potential.moved = true;
            dragState = {
              el: g,
              startX: moveEv.clientX,
              startY: moveEv.clientY,
              origX: potential.origX,
              origY: potential.origY
            };
            g.style.cursor = 'grabbing';
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
          }
        };

        const pointerUpHandler = (upEv) => {
          if (!potential.moved) {
            upEv.stopPropagation && upEv.stopPropagation();
            onSelect(g);
          }
          try { g.releasePointerCapture && g.releasePointerCapture(ev.pointerId); } catch (e) {}
          window.removeEventListener('pointermove', pointerMoveHandler);
          window.removeEventListener('pointerup', pointerUpHandler);
        };

        window.addEventListener('pointermove', pointerMoveHandler);
        window.addEventListener('pointerup', pointerUpHandler);
      });
      g.addEventListener('click', (ev) => {
        ev.stopPropagation();
        onSelect(g);
      });
    });

    svg.addEventListener('click', (ev) => {
      if (ev.target === svg) {
        if (selectedEl) selectedEl.classList.remove('editing');
        selectedEl = null;
        selectedPanel.innerHTML = '<p class="text-muted">No booth selected. Click a booth to edit.</p>';
      }
    });
  }

  function onPointerMove(ev) {
    if (!dragState) return;
    const dx = ev.clientX - dragState.startX;
    const dy = ev.clientY - dragState.startY;
    const newX = Math.round(dragState.origX + dx);
    const newY = Math.round(dragState.origY + dy);
    setTranslate(dragState.el, newX, newY);
  }

  function onPointerUp(ev) {
    if (!dragState) return;
    try {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dragState.el.style.cursor = 'grab';
    } finally {
      dragState = null;
    }
  }

  function gatherBoothPayload() {
    const booths = Array.from(svg.querySelectorAll('.editable-booth')).map((el) => {
      const tr = getTranslate(el);
      return {
        id: el.dataset.boothId,
        label: el.dataset.boothLabel,
        tier: el.dataset.boothTier,
        price: el.dataset.boothPrice || null,
        disabled: el.dataset.boothDisabled === 'true' || el.dataset.boothDisabled === true,
        x: Math.round(tr.x),
        y: Math.round(tr.y),
        floor: el.dataset.boothFloor || null,
        floorLabel: el.dataset.boothFloorLabel || null
      };
    });
    return booths;
  }

  function saveLayout() {
    const payload = {
      eventId: (new URLSearchParams(window.location.search)).get('eventId'),
      booths: gatherBoothPayload(),
      deletedIds: Array.from(deletedIds),
      sections: sections,
      deletedSections: Array.from(deletedSections)
    };
    fetch('/admin/booths/save-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) {
          alert('Layout saved successfully. Public map updated.');
        } else {
          alert('Failed to save layout. Check console.');
          console.error('Save failed', json);
        }
      })
      .catch((err) => {
        console.error('Save error', err);
        alert('Error saving layout. See console.');
      });
  }

  function resetPositions() {
    if (!confirm('Reset positions to automatic layout? This will remove any manual X/Y positions stored.')) return;
    const payload = { eventId: (new URLSearchParams(window.location.search)).get('eventId'), reset: true };
    fetch('/admin/booths/reset-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) {
          location.reload();
        } else {
          alert('Failed to reset layout');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Error resetting layout');
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    enableDragging();
    setupZoomPan();
    document.getElementById('saveLayout').addEventListener('click', saveLayout);
    document.getElementById('resetPositions').addEventListener('click', resetPositions);
    document.getElementById('addBooth').addEventListener('click', () => {
      const rect = mapWrapper.getBoundingClientRect();
      const x = Math.round(mapWrapper.scrollLeft + rect.width / 2 - 70);
      const y = Math.round(mapWrapper.scrollTop + rect.height / 2 - 60);
      const node = createBoothNode({ x, y, label: 'New Booth' });
      svg.appendChild(node);
      enableDragging();
      onSelect(node);
    });

    function renderSections() {
      const list = document.getElementById('sectionsList');
      if (!list) return;
      list.innerHTML = '';
      sections.forEach((s, idx) => {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex align-items-center justify-content-between gap-2';
        item.innerHTML = `
          <div class="d-flex gap-2 align-items-center">
            <input class="form-control form-control-sm section-floor" data-idx="${idx}" style="width:80px" value="${escapeHtml(String(s.floor))}" />
            <input class="form-control form-control-sm section-label" data-idx="${idx}" value="${escapeHtml(s.floorLabel || '')}" />
          </div>
          <div>
            <button class="btn btn-sm btn-outline-danger delete-section-btn" data-idx="${idx}">Delete</button>
          </div>
        `;
        list.appendChild(item);
      });

      list.querySelectorAll('.section-floor').forEach((el) => {
        el.addEventListener('change', (ev) => {
          const idx = Number(ev.target.dataset.idx);
          sections[idx].floor = String(ev.target.value);
        });
      });
      list.querySelectorAll('.section-label').forEach((el) => {
        el.addEventListener('change', (ev) => {
          const idx = Number(ev.target.dataset.idx);
          sections[idx].floorLabel = ev.target.value;
          const floorKey = String(sections[idx].floor);
          svg.querySelectorAll('.editable-booth').forEach((b) => {
            if (String(b.dataset.boothFloor) === floorKey) b.dataset.boothFloorLabel = sections[idx].floorLabel || '';
          });
          ensureHeadingForSection(sections[idx]);
        });
      });
      list.querySelectorAll('.delete-section-btn').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          const idx = Number(ev.target.dataset.idx);
          const floorToRemove = String(sections[idx].floor);
          const conflict = Array.from(svg.querySelectorAll('.editable-booth')).find(b => String(b.dataset.boothFloor) === floorToRemove);
          if (conflict) {
            alert('Cannot delete a section that has booths. Reassign or remove those booths first.');
            return;
          }
          deletedSections.add(floorToRemove);
          const heading = svg.querySelector(`text.map-title[data-floor="${floorToRemove}"]`);
          if (heading) heading.remove();
          sections.splice(idx, 1);
          renderSections();
        });
      });
    }

    document.getElementById('addSectionBtn')?.addEventListener('click', () => {
      const numeric = sections.map(s => Number(s.floor)).filter(n => !isNaN(n));
      const next = numeric.length ? Math.max(...numeric) + 1 : (sections.length ? sections.length + 1 : 1);
      sections.push({ floor: String(next), floorLabel: `Floor ${next}` });
      renderSections();
      ensureHeadingForSection(sections[sections.length - 1]);
    });

    document.getElementById('saveSectionsBtn')?.addEventListener('click', () => {
      saveLayout();
    });

    renderSections();
  });
})();
