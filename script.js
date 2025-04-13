const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cityRadius = 6;
const cities = [];
const visitedCities = [];
const totalCities = 6;

let totalDistance = 0;

function getRandomPosition() {
  const padding = 30;
  return {
    x: Math.floor(Math.random() * (canvas.width - padding * 2)) + padding,
    y: Math.floor(Math.random() * (canvas.height - padding * 2)) + padding
  };
}

function generateCities() {
  for (let i = 0; i < totalCities; i++) {
    cities.push(getRandomPosition());
  }
}

function drawCities() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '14px Arial';

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    ctx.beginPath();
    ctx.arc(city.x, city.y, cityRadius, 0, Math.PI * 2);
    ctx.fillStyle = visitedCities.includes(i) ? 'gray' : 'red';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(`C${i + 1}`, city.x + 8, city.y - 8);
  }

  // Draw path
  ctx.beginPath();
  ctx.moveTo(cities[visitedCities[0]]?.x ?? 0, cities[visitedCities[0]]?.y ?? 0);
  for (let i = 1; i < visitedCities.length; i++) {
    const city = cities[visitedCities[i]];
    ctx.lineTo(city.x, city.y);
  }
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function getClickedCity(x, y) {
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const dx = x - city.x;
    const dy = y - city.y;
    if (Math.sqrt(dx * dx + dy * dy) <= cityRadius + 5 && !visitedCities.includes(i)) {
      return i;
    }
  }
  return null;
}

function calculateDistance(c1, c2) {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const cityIndex = getClickedCity(x, y);

  if (cityIndex !== null) {
    if (visitedCities.length > 0) {
      const prevCity = cities[visitedCities[visitedCities.length - 1]];
      const currentCity = cities[cityIndex];
      totalDistance += calculateDistance(prevCity, currentCity);
    }
    visitedCities.push(cityIndex);
    drawCities();

    if (visitedCities.length === cities.length) {
      document.getElementById('info').innerText =
        `All cities visited! Total distance: ${totalDistance.toFixed(2)} units.`;
    }
  }
}

function resetGame() {
  cities.length = 0;
  visitedCities.length = 0;
  totalDistance = 0;
  document.getElementById('info').innerText = 'Click cities to visit them in order.';
  generateCities();
  drawCities();
}

canvas.addEventListener('click', handleClick);
resetGame(); // initialize
