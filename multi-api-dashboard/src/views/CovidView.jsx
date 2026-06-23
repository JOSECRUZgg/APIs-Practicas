import { useState, useEffect } from 'react';
import { Activity, Users, AlertTriangle, Crosshair } from 'lucide-react';

function CovidView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.covidtracking.com/v1/us/current.json')
      .then(res => res.json())
      .then(json => {
        if(json && json.length > 0) {
          setData(json[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">COVID Tracking API</h1>
        <p>Datos históricos acumulados del Proyecto COVID Tracking (US) hasta 2021.</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : data ? (
        <div className="grid-cards">
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <div style={{ color: '#ef4444', marginBottom: '1rem' }}><Activity size={40} /></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Casos Positivos</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {formatNumber(data.positive)}
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <div style={{ color: '#f59e0b', marginBottom: '1rem' }}><AlertTriangle size={40} /></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Hospitalizados Acumulados</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {formatNumber(data.hospitalizedCumulative)}
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <div style={{ color: '#10b981', marginBottom: '1rem' }}><Users size={40} /></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Recuperados</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {formatNumber(data.recovered)}
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <div style={{ color: '#6366f1', marginBottom: '1rem' }}><Crosshair size={40} /></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Muertes</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {formatNumber(data.death)}
            </p>
          </div>
          
          <div className="glass-card p-6" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>Metadatos de la API</h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <li><strong>Fecha del reporte:</strong> {data.dateChecked ? new Date(data.dateChecked).toLocaleDateString() : 'N/A'}</li>
              <li><strong>Total de tests:</strong> {formatNumber(data.totalTestResults)}</li>
              <li><strong>Estados reportados:</strong> {data.states}</li>
            </ul>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--danger)' }}>Error al cargar los datos.</p>
      )}
    </div>
  );
}

export default CovidView;
