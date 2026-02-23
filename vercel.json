/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
(function () {
  function formatCurrency(value) {
    return Number(value || 0).toLocaleString();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const map = document.getElementById('boothMap');
    const mapWrapper = map ? map.closest('.booth-map-wrapper') : null;
    if (!map) {
      return;
    }

    const hiddenField = document.getElementById('boothIdsField');
    const submitButton = document.getElementById('confirmSelection');
    const selectedList = document.getElementById('selectedBoothsList');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryBreakdown = document.getElementById('summaryTierBreakdown');

    const pricing = (() => {
      try {
        return JSON.parse(map.dataset.pricing || '{}');
      } catch (error) {
        return {};
      }
    })();

    const selectedBooths = new Map();
    const boothElements = Array.from(map.querySelectorAll('.booth'));

    let scale = 1;
    const minScale = 0.5;
    const maxScale = 2.0;
    const scaleStep = 0.05;

    function getViewBoxSize() {
      try {
        const vb = map.viewBox.baseVal;
        return { w: vb.width || map.clientWidth || 800, h: vb.height || map.clientHeight || 760 };
      } catch (e) {
        const vbAttr = map.getAttribute('viewBox') || '0 0 800 760';
        const parts = vbAttr.split(/[ ,]+/).map(Number);
        return { w: parts[2] || 800, h: parts[3] || 760 };
      }
    }

    const applyScale = (s, centerClientX, centerClientY) => {
      s = Math.max(minScale, Math.min(maxScale, s));
      if (!mapWrapper) return (scale = s);
      const vb = getViewBoxSize();
      const prevW = vb.w * scale;
      const prevH = vb.h * scale;
      const newW = Math.round(vb.w * s);
      const newH = Math.round(vb.h * s);

      if (typeof centerClientX !== 'undefined') {
        const rect = mapWrapper.getBoundingClientRect();
        const offsetX = centerClientX - rect.left + mapWrapper.scrollLeft;
        const offsetY = centerClientY - rect.top + mapWrapper.scrollTop;
        const relX = prevW > 0 ? offsetX / prevW : 0;
        const relY = prevH > 0 ? offsetY / prevH : 0;

        map.style.width = newW + 'px';
        map.style.height = newH + 'px';

        mapWrapper.scrollLeft = Math.round(relX * newW - (centerClientX - rect.left));
        mapWrapper.scrollTop = Math.round(relY * newH - (centerClientY - rect.top));
      } else {
        map.style.width = newW + 'px';
        map.style.height = newH + 'px';
      }

      scale = s;
    };

    if (mapWrapper) {
      mapWrapper.addEventListener('wheel', (ev) => {
        if (ev.ctrlKey || ev.metaKey) {
          ev.preventDefault();
          const delta = ev.deltaY > 0 ? -scaleStep : scaleStep;
          applyScale(scale + delta, ev.clientX, ev.clientY);
        }
      }, { passive: false });

      let panning = false;
      let panStart = { x: 0, y: 0, left: 0, top: 0 };
      mapWrapper.addEventListener('pointerdown', (ev) => {
        if (ev.target === mapWrapper || ev.target === map || (ev.target.tagName === 'rect' && ev.target.parentElement === map)) {
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

      const toolbar = document.createElement('div');
      toolbar.className = 'map-toolbar';
      toolbar.style.position = 'absolute';
      toolbar.style.top = '8px';
      toolbar.style.right = '8px';
      toolbar.style.zIndex = 2000;
      toolbar.innerHTML = `
        <button class="btn btn-sm btn-outline-secondary" id="publicZoomOut">−</button>
        <button class="btn btn-sm btn-outline-secondary" id="publicZoomReset">Reset</button>
        <button class="btn btn-sm btn-outline-secondary" id="publicZoomIn">+</button>
      `;
      mapWrapper.style.position = 'relative';
      mapWrapper.appendChild(toolbar);
      document.getElementById('publicZoomIn').addEventListener('click', () => applyScale(scale + scaleStep));
      document.getElementById('publicZoomOut').addEventListener('click', () => applyScale(scale - scaleStep));
      document.getElementById('publicZoomReset').addEventListener('click', () => applyScale(1));
    }

    function updateHiddenField() {
      hiddenField.value = Array.from(selectedBooths.keys()).join(',');
      submitButton.disabled = selectedBooths.size === 0;
    }

    function renderSummary() {
      if (selectedBooths.size === 0) {
        selectedList.innerHTML = '<p class="text-muted mb-0">No booths selected yet.</p>';
        summaryTotal.textContent = '0';
        summaryBreakdown.textContent = '—';
        updateHiddenField();
        return;
      }

      const fragment = document.createDocumentFragment();
      const list = document.createElement('ul');
      list.className = 'list-unstyled mb-0';

      const tierTotals = {};
      let totalPrice = 0;

      selectedBooths.forEach((details, boothId) => {
        const item = document.createElement('li');
        item.className = 'selected-booth-item';
        item.innerHTML = `
          <div>
            <strong>${details.label}</strong>
            <div class="small text-muted">${details.floorLabel} • ${details.theme}</div>
            <div class="badge bg-light text-dark">${details.tierLabel} • HK$${formatCurrency(details.price)}</div>
          </div>
          <button type="button" class="btn btn-sm btn-outline-danger" data-remove-booth="${boothId}">Remove</button>
        `;
        list.appendChild(item);

        tierTotals[details.tier] = (tierTotals[details.tier] || 0) + 1;
        totalPrice += details.price;
      });

      fragment.appendChild(list);
      selectedList.innerHTML = '';
      selectedList.appendChild(fragment);

      const breakdownParts = Object.keys(tierTotals).map((tier) => {
        const label = tier.charAt(0).toUpperCase() + tier.slice(1);
        return `${label} × ${tierTotals[tier]}`;
      });

      summaryTotal.textContent = formatCurrency(totalPrice);
      summaryBreakdown.textContent = breakdownParts.join(' • ');

      updateHiddenField();
    }

    function toggleSelection(element) {
      if (
        element.classList.contains('booth--reserved') ||
        element.classList.contains('booth--disabled') ||
        element.dataset.disabled === 'true'
      ) {
        return;
      }

      const boothId = element.dataset.boothId;

      if (selectedBooths.has(boothId)) {
        selectedBooths.delete(boothId);
        element.classList.remove('booth--selected');
      } else {
        selectedBooths.set(boothId, {
          label: element.dataset.label || boothId,
          theme: element.dataset.theme,
          floor: element.dataset.floor,
          floorLabel: element.dataset.floorLabel || `Floor ${element.dataset.floor}`,
          tier: element.dataset.tier,
          tierLabel: (element.dataset.tier || '').replace(/^./, (char) => char.toUpperCase()),
          price: Number(element.dataset.price || pricing[element.dataset.tier] || 0)
        });
        element.classList.add('booth--selected');
      }

      renderSummary();
    }

    boothElements.forEach((booth) => {
      booth.setAttribute('role', 'button');
      booth.setAttribute('tabindex', '0');

      booth.addEventListener('click', () => toggleSelection(booth));
      booth.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleSelection(booth);
        }
      });
    });

    selectedList.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-booth]');
      if (!button) {
        return;
      }

      const boothId = button.getAttribute('data-remove-booth');
      const boothElement = boothElements.find((element) => element.dataset.boothId === boothId);

      if (boothElement) {
        boothElement.classList.remove('booth--selected');
      }

      selectedBooths.delete(boothId);
      renderSummary();
    });

    const preselected = (map.dataset.selected || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    preselected.forEach((boothId) => {
      const boothElement = boothElements.find((element) => element.dataset.boothId === boothId);
      if (
        boothElement &&
        !boothElement.classList.contains('booth--reserved') &&
        !boothElement.classList.contains('booth--disabled')
      ) {
        selectedBooths.set(boothId, {
          label: boothElement.dataset.label || boothId,
          theme: boothElement.dataset.theme,
          floor: boothElement.dataset.floor,
          floorLabel: boothElement.dataset.floorLabel || `Floor ${boothElement.dataset.floor}`,
          tier: boothElement.dataset.tier,
          tierLabel: (boothElement.dataset.tier || '').replace(/^./, (char) => char.toUpperCase()),
          price: Number(boothElement.dataset.price || pricing[boothElement.dataset.tier] || 0)
        });
        boothElement.classList.add('booth--selected');
      }
    });

    renderSummary();
  });
})();

