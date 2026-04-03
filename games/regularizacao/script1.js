// Coordenadas aproximadas das RAs de Brasília
const coordinates = {
  "CEILÂNDIA": [-15.818, -48.096],
  "PLANO PILOTO": [-15.79399, -47.88271],
  "SAMAMBAIA": [-15.873, -48.086],
  "TAGUATINGA": [-15.837, -48.056],
  "GAMA": [-16.014, -48.066],
  "SANTA MARIA": [-16.023, -47.987],
  "RECANTO DAS EMAS": [-15.917, -48.102],
  "SOBRADINHO": [-15.65056, -47.78538],
  "PLANALTINA": [-15.61936, -47.65577],
  "RIACHO FUNDO": [-15.882, -48.015],
  "GUARÁ": [-15.810, -47.979],
  "PARANOÁ": [-15.768, -47.779],
  "SÃO SEBASTIÃO": [-15.903, -47.772],
  "BRAZLÂNDIA": [-15.677, -48.201],
  "ÁGUAS CLARAS": [-15.837, -48.027],
  "CANDANGOLÂNDIA": [-15.851, -47.951],
  "NÚCLEO BANDEIRANTE": [-15.872, -47.965],
  "ITAPOÃ": [-15.745, -47.764],
  "CRUZEIRO": [-15.783, -47.935],
  "SCIA/ESTRUTURAL": [-15.78304, -47.98751],
  "VICENTE PIRES": [-15.805, -48.031],
  "VARJÃO": [-15.710, -47.876],
  "LAGO NORTE": [-15.723, -47.873],
  "LAGO SUL": [-15.851, -47.872],
  "PARK WAY": [-15.86420, -47.97193],
  "SUDOESTE": [-15.80076, -47.92425],
  "FERCAL": [-15.601, -47.871],
  "SOL NASCENTE/PÔR DO SOL": [-15.822, -48.129],
  "JARDIM BOTÂNICO": [-15.859, -47.797],
  "ARNIQUEIRA": [-15.85935, -48.01223],
  "SIA": [-15.805, -47.959],
  "SOBRADINHO II": [-15.64461, -47.82623],
  "ARAPOANGA": [-15.6432, -47.6518],
  "ÁGUA QUENTE": [-15.94062, -48.23290],
  "ÁGUAS LINDAS DE GOIÁS(ENTORNO)": [-15.73666, -48.27856],
  "VALPARAÍSO DE GOIÁS (ENTORNO)": [-16.0739, -47.9828],
  "LUZIÂNIA (ENTORNO)": [-16.2473, -47.9382],
  "NOVO GAMA (ENTORNO)": [-16.05052, -48.03034],
  "CIDADE OCIDENTAL (ENTORNO)": [-16.10264, -47.94846],
  "SANTO ANTÔNIO DO DESCOBERTO (ENTORNO)": [-15.94474, -48.26225],
  "FORMOSA (ENTORNO)": [-15.5448, -47.3367]
};

const datasetLabel = {
  crf: 'CRF',
  fichadescritiva: 'Ficha Descritiva'
};

const aliasesRa = {
  'BRAZLANDIA': 'BRAZLÂNDIA',
  'TAGUATINGA/AREAL': 'TAGUATINGA',
  'RIACHO FUNDO I': 'RIACHO FUNDO',
  'RIACHO FUNDO II': 'RIACHO FUNDO',
  'SOL NASCENTE': 'SOL NASCENTE/PÔR DO SOL',
  'ESTRUTURAL': 'SCIA/ESTRUTURAL'
};

function normalizeRa(text) {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findCoordinatesByRa(ra) {
  if (!ra) return null;

  const direct = coordinates[ra];
  if (direct) return direct;

  const normalized = normalizeRa(ra);

  for (const key of Object.keys(coordinates)) {
    if (normalizeRa(key) === normalized) {
      return coordinates[key];
    }
  }

  if (aliasesRa[ra.toUpperCase()]) {
    const aliasKey = aliasesRa[ra.toUpperCase()];
    return coordinates[aliasKey] || null;
  }

  if (aliasesRa[normalized]) {
    const aliasKey = aliasesRa[normalized];
    return coordinates[aliasKey] || null;
  }

  return null;
}

function parseCsvLine(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cols.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cols.push(current);
  return cols.map(cell => cell.trim());
}

function parseCSVByYear(csvText, year) {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]).map(h => h.replace(/"/g, '').trim().toUpperCase());
  const raIndex = header.findIndex(h => h === 'RA');
  const yearIndex = header.findIndex(h => h === String(year));

  if (raIndex === -1 || yearIndex === -1) {
    console.warn('Cabeçalho CSV sem RA ou ano', header);
    return [];
  }

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    const raRaw = (row[raIndex] || '').replace(/"/g, '').trim();
    if (!raRaw) continue;

    const raUpper = raRaw.toUpperCase();
    if (raUpper.includes('TOTAL')) continue;

    const valueRaw = (row[yearIndex] || '').replace(/"/g, '').trim();
    const quantidade = valueRaw === '-' || valueRaw === '' ? 0 : parseInt(valueRaw.replace(/\./g, ''), 10);

    data.push({ ra: raRaw, quantidade: Number.isNaN(quantidade) ? 0 : quantidade });
  }

  return data;
}

// Inicializar o mapa centrado em Brasília
const map = L.map('map').setView([-15.7999, -47.8640], 11);

// Adicionar camada de mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Layer groups para os círculos
const circlesLayer = L.layerGroup().addTo(map);
const empreendimentosLayer = L.layerGroup().addTo(map);

// Elementos para a lista lateral
const regionListElement = document.getElementById('regionList');
const missingRaListElement = document.getElementById('missingRaList');

// Auxiliares para destacar seleção
const circlesByRa = {};
let currentSelectedRa = null;

const baseCircleStyle = {
  color: 'blue',
  fillColor: 'rgb(25, 0, 255)',
  fillOpacity: 0.5,
  weight: 2
};

const highlightCircleStyle = {
  color: 'gold',
  fillColor: 'rgba(255, 215, 0, 0.5)',
  weight: 4
};

let currentDataset = 'crf';
let currentYear = 2019;

function clearSelection() {
  if (!currentSelectedRa) return;

  const previousCircle = circlesByRa[currentSelectedRa];
  if (previousCircle) {
    previousCircle.setStyle(baseCircleStyle);
  }

  const previousListItem = document.querySelector(`#regionList li[data-ra="${CSS.escape(currentSelectedRa)}"]`);
  if (previousListItem) {
    previousListItem.classList.remove('selected');
  }

  currentSelectedRa = null;
}

function highlightRegion(ra) {
  if (!ra) return;
  clearSelection();

  const circle = circlesByRa[ra];
  if (!circle) return;

  circle.setStyle(highlightCircleStyle);
  circle.bringToFront();
  circle.openPopup();

  const coord = findCoordinatesByRa(ra);
  if (coord) {
    map.setView(coord, Math.max(map.getZoom(), 12));
  }

  const listItem = document.querySelector(`#regionList li[data-ra="${CSS.escape(ra)}"]`);
  if (listItem) {
    listItem.classList.add('selected');
    listItem.scrollIntoView({ block: 'nearest' });
  }

  currentSelectedRa = ra;
}

function updateMap(data) {
  circlesLayer.clearLayers();
  regionListElement.innerHTML = '';
  missingRaListElement.innerHTML = '';
  Object.keys(circlesByRa).forEach(key => delete circlesByRa[key]);
  currentSelectedRa = null;

  const sortedData = [...data].sort((a, b) => b.quantidade - a.quantidade);

  const total = sortedData.reduce((sum, item) => sum + item.quantidade, 0);
  const totalItem = document.createElement('li');
  totalItem.innerHTML = `<strong>TOTAL</strong><br><span style="font-size:0.9em;">${total.toLocaleString()} candidatos</span>`;
  regionListElement.appendChild(totalItem);

  sortedData.forEach(item => {
    const coord = findCoordinatesByRa(item.ra);
    if (!coord) {
      const missingItem = document.createElement('li');
      missingItem.innerHTML = `<strong>${item.ra}</strong><br><span style="font-size:0.9em;">${item.quantidade.toLocaleString()} candidatos</span>`;
      missingRaListElement.appendChild(missingItem);
      return;
    }

    const circle = L.circle(coord, {
      ...baseCircleStyle,
      radius: getRadius(item.quantidade)
    }).addTo(circlesLayer);

    circle.bindPopup(`<b>${item.ra}</b><br>Candidatos: ${item.quantidade}`);
    circle.on('click', () => highlightRegion(item.ra));

    circlesByRa[item.ra] = circle;

    const listItem = document.createElement('li');
    listItem.dataset.ra = item.ra;
    listItem.innerHTML = `<strong>${item.ra}</strong><br><span style="font-size:0.9em;">${item.quantidade.toLocaleString()} candidatos</span>`;
    listItem.addEventListener('click', () => highlightRegion(item.ra));

    regionListElement.appendChild(listItem);
  });
}

function getRadius(quantidade) {
  return Math.max(quantidade, 1) * 150; // Ajusta radiações para ser visível
}

async function loadData(filename, year) {
  try {
    const response = await fetch(filename);
    const csvText = await response.text();
    const data = parseCSVByYear(csvText, year);
    updateMap(data);

    const title = document.getElementById('title');
    title.textContent = `Beneficiários de escrituras Regularização ${datasetLabel[currentDataset]} ${year}`;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

function setDataset(dataset) {
  currentDataset = dataset;
  highlightDatasetButtons();
  loadCurrentData();
}

function setYear(year) {
  currentYear = year;
  highlightYearButtons();
  loadCurrentData();
}

function loadCurrentData() {
  const filename = currentDataset === 'crf' ? 'crf.csv' : 'fichadescritiva.csv';
  loadData(filename, currentYear);
}

function highlightDatasetButtons() {
  const btnFicha = document.getElementById('btnFicha');
  const btnCrf = document.getElementById('btnCrf');
  btnFicha.classList.toggle('selected', currentDataset === 'fichadescritiva');
  btnCrf.classList.toggle('selected', currentDataset === 'crf');
}

function highlightYearButtons() {
  document.querySelectorAll('#yearButtons button').forEach(btn => {
    btn.classList.toggle('selected', Number(btn.dataset.year) === currentYear);
  });
}

function setupControls() {
  document.getElementById('btnFicha').addEventListener('click', () => setDataset('fichadescritiva'));
  document.getElementById('btnCrf').addEventListener('click', () => setDataset('crf'));

  const yearButtonsContainer = document.getElementById('yearButtons');
  yearButtonsContainer.innerHTML = '';

  for (let year = 2019; year <= 2026; year++) {
    const btn = document.createElement('button');
    btn.textContent = year;
    btn.dataset.year = year;
    btn.addEventListener('click', () => setYear(year));
    yearButtonsContainer.appendChild(btn);
  }

  highlightDatasetButtons();
  highlightYearButtons();
}

function init() {
  setupControls();
  loadCurrentData();
}

init();
