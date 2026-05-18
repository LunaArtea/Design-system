/* ============================================================
   DOCS.JS — Navegación, copy-to-clipboard, búsqueda
   Monitor Card Design System Documentation
   ============================================================ */

'use strict';

// ── Registro de componentes ──────────────────────────────────
const COMPONENT_REGISTRY = [
  // ÁTOMOS
  { id: 'home',            layer: 'home',      name: 'Inicio',              tags: ['home', 'overview'] },
  { id: 'css-variables',   layer: 'atoms',     name: 'Variables CSS',       tags: ['tokens', 'css', 'variables', 'custom properties'] },
  { id: 'colors',          layer: 'atoms',     name: 'Sistema de Colores',  tags: ['color', 'palette', 'estado', 'severidad'] },
  { id: 'typography',      layer: 'atoms',     name: 'Tipografía',          tags: ['font', 'text', 'type', 'scale'] },
  { id: 'spacing',         layer: 'atoms',     name: 'Espaciado',           tags: ['space', 'gap', 'padding', 'margin'] },
  { id: 'shadows',         layer: 'atoms',     name: 'Sombras',             tags: ['shadow', 'elevation', 'depth'] },
  { id: 'status-badge',    layer: 'atoms',     name: 'Status Badge',        tags: ['badge', 'pill', 'estado', 'tonal'] },
  { id: 'operator-avatar', layer: 'atoms',     name: 'Operator Avatar',     tags: ['avatar', 'operador', 'initials', 'circle'] },
  { id: 'variable-row',    layer: 'atoms',     name: 'Variable Row',        tags: ['row', 'variable', 'telemetry', 'severity'] },
  { id: 'alert-icon',      layer: 'atoms',     name: 'Alert Icon',          tags: ['icon', 'alert', 'warning', 'danger'] },
  // MOLÉCULAS
  { id: 'card-header',          layer: 'molecules', name: 'Card Header',          tags: ['header', 'card', 'status', 'color'] },
  { id: 'card-footer',          layer: 'molecules', name: 'Card Footer',          tags: ['footer', 'card', 'alerts', 'avatar'] },
  { id: 'variable-list',        layer: 'molecules', name: 'Variable List',        tags: ['list', 'variables', 'telemetry'] },
  { id: 'disconnected-overlay', layer: 'molecules', name: 'Disconnected Overlay', tags: ['overlay', 'blur', 'offline', 'disconnected'] },
  { id: 'category-tab',         layer: 'molecules', name: 'Category Tab',         tags: ['tab', 'category', 'glow', 'badge'] },
  { id: 'view-toggle',          layer: 'molecules', name: 'View Toggle',          tags: ['toggle', 'cards', 'table', 'switch'] },
  { id: 'popover',              layer: 'molecules', name: 'Popover',              tags: ['popover', 'tooltip', 'detail', 'float'] },
  { id: 'summary-strip',        layer: 'molecules', name: 'Summary Strip',        tags: ['summary', 'strip', 'count', 'status'] },
  // ORGANISMOS
  { id: 'monitor-card',        layer: 'organisms', name: 'Monitor Card',        tags: ['card', 'vehicle', 'monitor', 'complete'] },
  { id: 'category-tabs-bar',   layer: 'organisms', name: 'Category Tabs Bar',   tags: ['tabs', 'bar', 'navigation', 'category'] },
  { id: 'card-grid',           layer: 'organisms', name: 'Card Grid',           tags: ['grid', 'gridstack', 'responsive', 'layout'] },
  { id: 'data-grid-container', layer: 'organisms', name: 'Data Grid Container', tags: ['table', 'datagrid', 'devextreme', 'container'] },
  { id: 'page-header',         layer: 'organisms', name: 'Page Header',         tags: ['header', 'page', 'title', 'controls'] },
  // TEMPLATES
  { id: 'monitor-card-view-template',  layer: 'templates', name: 'Monitor Card View Template',  tags: ['template', 'layout', 'cards', 'grid'] },
  { id: 'monitor-table-view-template', layer: 'templates', name: 'Monitor Table View Template', tags: ['template', 'layout', 'table', 'datagrid'] },
  // PÁGINAS
  { id: 'vehicular-status-monitor', layer: 'pages', name: 'Vehicular Status Monitor', tags: ['vsm', 'vehicular', 'page', 'example'] },
  { id: 'health-monitor-cards',     layer: 'pages', name: 'Health Monitor Cards',     tags: ['hmc', 'health', 'page', 'example'] },
];

// ── Utilidades de color ──────────────────────────────────────
function getContrastTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1e293b' : '#ffffff';
}

function getStatusBadgeColors(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    bg: `rgba(${r},${g},${b},0.12)`,
    text: hex,
    border: `rgba(${r},${g},${b},0.3)`
  };
}

// ── Navegación ───────────────────────────────────────────────
function buildComponentIndex(registry) {
  const map = new Map();
  registry.forEach(c => map.set(`${c.layer}/${c.id}`, c));
  return map;
}

const componentIndex = buildComponentIndex(COMPONENT_REGISTRY);

function navigateTo(hash) {
  const raw = hash.replace('#', '');
  const parts = raw.split('/');
  const layer = parts[0] || 'home';
  const id    = parts[1] || (layer === 'home' ? 'home' : '');
  const key   = id ? `${layer}/${id}` : `home/home`;

  // Ocultar todas las secciones
  document.querySelectorAll('.docs-section').forEach(s => s.classList.remove('active'));

  // Mostrar la sección correspondiente
  const sectionId = `section-${layer}-${id || 'home'}`;
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active');
  } else {
    const fallback = document.getElementById('section-home-home');
    if (fallback) fallback.classList.add('active');
  }

  // Actualizar nav activo
  document.querySelectorAll('.docs-nav-items a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === hash || a.getAttribute('href') === `#${raw}`);
  });

  // Scroll al top
  const main = document.querySelector('.docs-main');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);

  // Re-highlight
  if (window.Prism) Prism.highlightAll();
}

// ── Búsqueda ─────────────────────────────────────────────────
function filterComponents(query) {
  query = query.trim().toLowerCase();
  if (!query) return COMPONENT_REGISTRY;

  return COMPONENT_REGISTRY
    .map(c => {
      let score = 0;
      if (c.name.toLowerCase().includes(query)) score += 10;
      if (c.id.toLowerCase().includes(query)) score += 8;
      c.tags.forEach(t => { if (t.toLowerCase().includes(query)) score += 5; });
      return { component: c, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.component);
}

function renderSearchResults(results, container) {
  container.innerHTML = '';
  if (!results.length) {
    container.innerHTML = '<li class="docs-search-empty">Sin resultados</li>';
    return;
  }
  results.slice(0, 8).forEach(c => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${c.layer}/${c.id}`;
    a.textContent = c.name;
    const badge = document.createElement('span');
    badge.className = 'nav-badge';
    badge.textContent = c.layer;
    a.appendChild(badge);
    li.appendChild(a);
    container.appendChild(li);
  });
}

// ── Copy to Clipboard ────────────────────────────────────────
async function copyCodeToClipboard(button) {
  const codeId = button.getAttribute('data-code-id');
  const codeEl = document.getElementById(codeId);
  if (!codeEl) return;

  const text = codeEl.textContent;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  button.classList.add('copied');
  button.textContent = '✓ Copiado';
  setTimeout(() => {
    button.classList.remove('copied');
    button.textContent = 'Copiar';
  }, 2000);
}

// ── Sidebar toggle groups ────────────────────────────────────
function initSidebarGroups() {
  document.querySelectorAll('.docs-nav-group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.docs-nav-group');
      group.classList.toggle('collapsed');
      btn.setAttribute('aria-expanded', !group.classList.contains('collapsed'));
    });
  });
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSidebarGroups();

  // Hash navigation
  window.addEventListener('hashchange', () => navigateTo(window.location.hash));

  // Initial navigation
  const hash = window.location.hash || '#home/home';
  navigateTo(hash);

  // Search
  const searchInput = document.getElementById('component-search');
  const searchResults = document.getElementById('search-results');

  if (searchInput && searchResults) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = searchInput.value;
        if (q.trim()) {
          const results = filterComponents(q);
          renderSearchResults(results, searchResults);
          searchResults.style.display = 'block';
        } else {
          searchResults.style.display = 'none';
        }
      }, 150);
    });

    document.addEventListener('click', e => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });

    searchResults.addEventListener('click', () => {
      searchResults.style.display = 'none';
      searchInput.value = '';
    });
  }

  // Copy buttons (delegated)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.docs-copy-btn');
    if (btn) copyCodeToClipboard(btn);
  });

  // Prism
  if (window.Prism) Prism.highlightAll();
});
