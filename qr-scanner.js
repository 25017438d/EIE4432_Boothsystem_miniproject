/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
:root {
  --booth-available: #198754;
  --booth-reserved: #dc3545;
  --booth-selected: #fbc02d;
}

body {
  background: #f3f5f8;
}

.card {
  border: none;
  border-radius: 1rem;
}

.navbar-brand {
  letter-spacing: 0.04em;
}

.booth-map-wrapper {
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.booth-map-wrapper {
  overflow: auto;
  max-height: 72vh;
}

.booth-controls-table {
  max-height: 48vh;
  overflow-y: auto;
}

.booth-controls-table table {
  margin-bottom: 0;
}

#boothMap .booth rect,
.admin-map .booth rect {
  fill: #e9ecef;
  stroke: #adb5bd;
  stroke-width: 3;
  transition: transform 0.15s ease, fill 0.2s ease, stroke 0.2s ease;
}

#boothMap .booth.booth--available rect,
.admin-map .booth.booth--available rect {
  fill: rgba(25, 135, 84, 0.12);
  stroke: var(--booth-available);
}

#boothMap .booth.booth--reserved rect,
.admin-map .booth.booth--reserved rect {
  fill: rgba(220, 53, 69, 0.18);
  stroke: var(--booth-reserved);
}

#boothMap .booth.booth--disabled rect,
.admin-map .booth.booth--disabled rect {
  fill: rgba(108, 117, 125, 0.18);
  stroke: #6c757d;
  stroke-dasharray: 6;
}

#boothMap .booth.booth--selected rect {
  fill: rgba(251, 192, 45, 0.25);
  stroke: var(--booth-selected);
  stroke-width: 4;
}

#boothMap .booth.booth--available:hover rect,
#boothMap .booth.booth--available:focus rect {
  transform: translateY(-4px);
  cursor: pointer;
}

.map-title {
  font-size: 1.2rem;
  font-weight: 600;
  fill: #495057;
}

.booth-label {
  font-size: 1.4rem;
  font-weight: 600;
  fill: #212529;
}

.booth-theme {
  font-size: 0.75rem;
  fill: #495057;
}

.booth-tier {
  font-size: 0.7rem;
  fill: #6c757d;
}

.selected-booths {
  border: 1px dashed rgba(13, 110, 253, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  background: rgba(248, 249, 252, 0.6);
}

.selected-booth-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.selected-booth-item:last-child {
  border-bottom: none;
}

.metric-tile {
  background: rgba(13, 110, 253, 0.08);
  border-radius: 0.75rem;
  padding: 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.metric-value {
  font-size: 1.3rem;
  font-weight: 700;
}

.metric-label {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.event-card img {
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.object-fit-cover {
  object-fit: cover;
}

.profile-avatar img {
  width: 160px;
  height: 160px;
  object-fit: cover;
}

.placeholder-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(13, 202, 240, 0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #0d6efd;
  margin: 0 auto 1rem;
}

.suggestion-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.suggestion-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.suggestion-item:hover,
.suggestion-item:focus {
  background: rgba(13, 110, 253, 0.08);
}

.suggestion-item.active {
  background: rgba(13, 110, 253, 0.12);
}

.admin-map .map-status {
  font-size: 0.7rem;
  fill: #343a40;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ticket-card {
  border-radius: 1.5rem;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.08), rgba(13, 202, 240, 0.08));
}

.ticket-field {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 0.75rem;
  border: 1px solid rgba(13, 110, 253, 0.1);
}

.ticket-field .label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #6c757d;
}

.ticket-field .value {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
}

.analytics-chart-wrapper {
  height: 340px;
  max-height: 520px;
}

.analytics-chart-wrapper canvas {
  width: 100%;
  height: 100% !important;
  display: block;
}

@media (max-width: 992px) {
  .sticky-top {
    position: static !important;
  }
}

