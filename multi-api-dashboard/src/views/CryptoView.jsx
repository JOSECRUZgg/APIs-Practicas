import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function CryptoView() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false')
      .then(res => res.json())
      .then(data => {
        setCoins(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Criptomonedas (CoinGecko)</h1>
        <p>Precios del mercado en tiempo real de las principales criptomonedas (Alternativa a Nomics).</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid-cards">
          {coins.map((coin, index) => {
            const isPositive = coin.price_change_percentage_24h >= 0;
            return (
              <div key={coin.id} className="glass-card p-6 flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img src={coin.image} alt={coin.name} style={{ width: '40px', height: '40px' }} />
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>{coin.name}</h3>
                    <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem' }}>{coin.symbol}</span>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {formatCurrency(coin.current_price)}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isPositive ? 'var(--success)' : 'var(--danger)', fontWeight: '500' }}>
                    {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24h)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CryptoView;
