
const portfolio = {
  BTC: 0.005,
  ETH: 0.1,
  SOL: 2.5,
  ARB: 100,
  BNB: 1.2,
  LINK: 20
};

const coinSymbols = Object.keys(portfolio);
const fiat = 'idr';

async function fetchPrices() {
  const response = await fetch('https://api.binance.com/api/v3/ticker/price');
  const data = await response.json();

  const filtered = {};
  data.forEach(coin => {
    coinSymbols.forEach(symbol => {
      if (coin.symbol === symbol + 'USDT') {
        filtered[symbol] = parseFloat(coin.price);
      }
    });
  });

  const usdtIdrRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr');
  const usdtIdr = await usdtIdrRes.json();
  const usdtToIdr = usdtIdr.tether.idr;

  let total = 0;
  const list = document.getElementById('cryptoList');
  list.innerHTML = '';

  coinSymbols.forEach(symbol => {
    const amount = portfolio[symbol];
    const price = filtered[symbol] || 0;
    const valueIdr = amount * price * usdtToIdr;
    total += valueIdr;

    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.innerHTML = `
      <div class="name">
        <img src="https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/32" onerror="this.style.display='none'" />
        ${symbol}
      </div>
      <div class="amount">${amount.toFixed(3)} ${symbol}</div>
    `;
    list.appendChild(item);
  });

  document.getElementById('totalAsset').textContent = 'Rp ' + total.toLocaleString('id-ID', {maximumFractionDigits: 0});
}

fetchPrices();
setInterval(fetchPrices, 60000);
