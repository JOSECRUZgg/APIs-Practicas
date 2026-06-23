import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2 } from 'lucide-react';

function JsonPlaceholderView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">JSON Placeholder</h1>
        <p>Un feed simulado usando posts de prueba.</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {posts.map((post) => (
            <div key={post.id} className="glass-card p-6" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  U{post.userId}
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>User {post.userId}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>hace 2 horas</span>
                </div>
              </div>
              <h3 style={{ textTransform: 'capitalize', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{post.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{post.body}</p>
              
              <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', color: 'var(--text-secondary)' }}>
                <button style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} className="hover:text-pink-500 transition-colors">
                  <Heart size={18} /> Me gusta
                </button>
                <button style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} className="hover:text-blue-500 transition-colors">
                  <MessageSquare size={18} /> Comentar
                </button>
                <button style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: 'auto' }}>
                  <Share2 size={18} /> Compartir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JsonPlaceholderView;
