// Coordenadas aproximadas das zonas eleitorais de Brasília
const coordinates = {
  "1": [-15.81695, -47.90073], // Asa sul
  "2": [-15.723, -47.873], // Paranoá, Varjão, Itapoã, Lago Norte
  "3": [-15.81331, -48.06690], // Taguatinga
  "4": [-16.023, -47.987], // Santa Maria
  "5": [-15.65056, -47.78538], // Sobradinho
  "6": [-15.61936, -47.65577], // Planaltina
  "8": [-15.8162, -48.1019], // Ceilandia Centro
  "9": [-15.810, -47.979], // Guará
  "10": [-15.872, -47.965], // Núcleo Bandeirante, Riacho Fundo, Park Way, Candangolândia
  "11": [-15.783, -47.935], // Cruzeiro, Sudoeste, Octogonal
  "13": [-15.873, -48.086], // Samambaia
  "14": [-15.76293, -47.88357], // Asa Norte
  "15": [-15.837, -48.027], // Aguas Claras
  "16": [-15.7706, -48.1407], // Ceilandia Norte, Brazlandia
  "17": [-16.014, -48.066], // Gama
  "18": [-15.851, -47.872], // Lago Sul, Jardim Botanico, São Sebastião
  "19": [-15.82025, -48.04132], // Taguatinga, Vicente Pires
  "20": [-15.8321, -48.0916], // Ceilandia Sul
  "21": [-15.917, -48.102], // Recanto das Emas
};

const zonasNomes = {
  "1": "Asa sul",
  "2": "Paranoá, Varjão, Itapoã, Lago Norte",
  "3": "Taguatinga",
  "4": "Santa Maria",
  "5": "Sobradinho",
  "6": "Planaltina",
  "8": "Ceilandia Centro",
  "9": "Guará",
  "10": "Núcleo Bandeirante, Riacho Fundo, Park Way, Candangolândia",
  "11": "Cruzeiro, Sudoeste, Octogonal",
  "13": "Samambaia",
  "14": "Asa Norte",
  "15": "Aguas Claras",
  "16": "Ceilandia Norte, Brazlandia",
  "17": "Gama",
  "18": "Lago Sul, Jardim Botanico, São Sebastião",
  "19": "Taguatinga, Vicente Pires",
  "20": "Ceilandia Sul",
  "21": "Recanto das Emas"
}

// Inicializar o mapa centrado em Brasília
const map = L.map('map').setView([-15.8243, -47.9025], 11);
console.log('Mapa inicializado:', map);

// Adicionar camada de mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Layer group para os círculos
const circlesLayer = L.layerGroup().addTo(map);

// Função para calcular o raio baseado na quantidade (escala logarítmica para melhor visualização)
function getRadius(quantidade) {
  return Math.sqrt(quantidade) * 55; // Ajuste o multiplicador conforme necessário
}

// Função para parsear CSV
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(line => line);
  const data = {};
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    if (parts.length >= 5) {
      const zona = parts[0].trim();
      const votos = parseInt(parts[3].trim());
      if (zona && !isNaN(votos)) {
        if (!data[zona]) data[zona] = 0;
        data[zona] += votos;
      }
    }
  }
  return Object.keys(data).map(zona => ({ zona, quantidade: data[zona] }));
}

// Função para atualizar o mapa com novos dados
function updateMap(data) {
  console.log('Dados para mapa:', data);
  circlesLayer.clearLayers();
  data.forEach(item => {
    const coord = coordinates[item.zona];
    console.log(`Zona ${item.zona}: coord ${coord}, votos ${item.quantidade}`);
    if (coord) {
      L.circle(coord, {
        color: 'gold',
        fillColor: 'rgb(16, 173, 45)',
        fillOpacity: 0.5,
        radius: getRadius(item.quantidade)
      }).addTo(circlesLayer).bindPopup(`<b>Zona ${item.zona} - ${zonasNomes[item.zona] || 'Desconhecido'}</b><br>Votos: ${item.quantidade}`);
    }
  });

  // Atualizar resumo lateral
  const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML = '<h2>Resumo por Zona</h2><ul>' +
    data.map(item => `<li><strong>Zona ${item.zona} - ${zonasNomes[item.zona] || 'Desconhecido'}</strong>: ${item.quantidade} votos</li>`).join('') +
    '</ul>';
}

// Função para carregar dados de um CSV
async function loadData(filename) {
  try {
    console.log('Carregando dados de:', filename);
    const response = await fetch(filename);
    const csvText = await response.text();
    console.log('CSV carregado, tamanho:', csvText.length);
    const data = parseCSV(csvText);
    console.log('Dados parseados:', data);
    updateMap(data);
    document.querySelector('h1').textContent = `Votação 2022 Wellington Luiz - por Zona`;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

// Carregar dados iniciais (removido, agora só no botão)