const stocksDiv = document.getElementById("stocks");

// List of stocks with initial prices
const stockSymbols = {
  AAPL: 150,
  MSFT: 300,
  GOOGL: 2800,
  TSLA: 750,
  AMZN: 3400
};

let previousPrices = {};
let charts = {};
let priceHistory = {};

// Initialize stocks
for (let symbol in stockSymbols) {
  createStockCard(symbol, stockSymbols[symbol]);
}

// Simulate price updates every 2 seconds
setInterval(() => {
  for (let symbol in stockSymbols) {
    // Simulate random price change
    let change = (Math.random() - 0.5) * (stockSymbols[symbol] * 0.01); // ±1%
    let newPrice = +(stockSymbols[symbol] + change).toFixed(2);
    updateStock(symbol, newPrice);
    stockSymbols[symbol] = newPrice; // update current price
  }
}, 2000);

function createStockCard(symbol, price) {
  const stockDiv = document.createElement("div");
  stockDiv.className = "stock";
  stockDiv.id = symbol;
  stockDiv.innerHTML = `
    <h2>${symbol}</h2>
    <span class="price">${price}</span>
    <canvas id="chart-${symbol}" width="200" height="50"></canvas>
  `;
  stocksDiv.appendChild(stockDiv);

  previousPrices[symbol] = price;
  priceHistory[symbol] = [price];

  const ctx = document.getElementById(`chart-${symbol}`).getContext("2d");
  charts[symbol] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array(priceHistory[symbol].length).fill(''),
      datasets: [{
        data: priceHistory[symbol],
        borderColor: '#3498db',
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}

function updateStock(symbol, newPrice) {
  const stockDiv = document.getElementById(symbol);
  const prevPrice = previousPrices[symbol];
  previousPrices[symbol] = newPrice;

  // Set up/down color
  const changeClass = newPrice > prevPrice ? "up" : newPrice < prevPrice ? "down" : "";
  stockDiv.className = "stock " + changeClass;

  // Update price
  stockDiv.querySelector(".price").innerText = newPrice;

  // Update chart
  priceHistory[symbol].push(newPrice);
  if (priceHistory[symbol].length > 10) priceHistory[symbol].shift();
  charts[symbol].data.datasets[0].data = priceHistory[symbol];
  charts[symbol].update();

  // Blink animation
  if (prevPrice !== newPrice) {
    stockDiv.classList.add("blink");
    setTimeout(() => stockDiv.classList.remove("blink"), 300);
  }
}
