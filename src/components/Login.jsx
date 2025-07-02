import { useState, useRef } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'pass') {
      onLogin();
    } else {
      setMsg('Invalid credentials');
      setShowToast(true);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2200);
    }
  };

  return (
    <div className="animated-bg" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Animated SVG waves at the bottom */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '180px',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#a1c4fd"
          fillOpacity="0.5"
          d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,320L0,320Z;
              M0,200L80,186.7C160,173,320,147,480,154.7C640,163,800,205,960,197.3C1120,189,1280,131,1360,106.7L1440,82L1440,320L0,320Z;
              M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,320L0,320Z
            "
          />
        </path>
      </svg>
      {/* Heartbeat wave SVG */}
      <svg
        width="320"
        height="60"
        viewBox="0 0 320 60"
        style={{
          position: 'absolute',
          top: '7%',
          right: '8%',
          zIndex: 0,
          opacity: 0.22,
          pointerEvents: 'none',
        }}
      >
        <polyline
          fill="none"
          stroke="#ff6b81"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          points="0,30 30,30 40,10 50,50 60,30 100,30 110,20 120,40 130,30 170,30 180,10 190,50 200,30 320,30"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-320"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,320;320,0;0,320"
            dur="2s"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>
      {/* Toast notification */}
      {showToast && (
        <div style={styles.toast}>
          <span style={styles.toastIcon}>❌</span>
          {msg}
        </div>
      )}
      <div style={styles.brand}>Healthify</div>
      <div style={styles.cardBorder}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <div
            style={styles.avatarBox}
            tabIndex={-1}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={styles.avatar}>🩺</span>
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <div style={styles.subtitle}>Sign in to your health dashboard</div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={styles.input}
            autoFocus
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #007BFF44')}
            onBlur={e => (e.target.style.boxShadow = '0 1px 2px #007bff08')}
          />
          <div style={{ width: '100%', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #007BFF44')}
              onBlur={e => (e.target.style.boxShadow = '0 1px 2px #007bff08')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={styles.showBtn}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Login
          </button>
          <div style={styles.hint}>Try user/pass: <b>user</b> / <b>pass</b></div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    top: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    padding: '14px 28px',
    fontWeight: 600,
    fontSize: '1.1rem',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#b00',
    animation: 'fadeIn 0.5s',
  },
  toastIcon: {
    fontSize: '1.2rem',
    marginRight: '4px',
  },
  brand: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    fontWeight: 900,
    fontSize: '2.5rem',
    color: '#007BFF',
    letterSpacing: '2.5px',
    marginBottom: '32px',
    marginTop: '-40px',
    textShadow: '0 4px 24px #007bff22, 0 1px 0 #fff',
    filter: 'drop-shadow(0 2px 8px #007bff22)',
    transition: 'text-shadow 0.3s',
    userSelect: 'none',
  },
  cardBorder: {
    background: 'linear-gradient(120deg, #007BFF 0%, #00c6ff 100%)',
    padding: '2px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    animation: 'fadeIn 1s',
  },
  card: {
    background: '#fff',
    padding: '36px 28px 28px 28px',
    borderRadius: '18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    minWidth: '320px',
    alignItems: 'center',
    position: 'relative',
    animation: 'fadeIn 1.2s',
  },
  avatarBox: {
    background: 'linear-gradient(135deg, #007BFF 0%, #00c6ff 100%)',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    boxShadow: '0 2px 8px rgba(0,123,255,0.10)',
    transition: 'transform 0.2s',
    outline: 'none',
  },
  avatar: {
    fontSize: '2.2rem',
    color: '#fff',
    userSelect: 'none',
  },
  title: {
    margin: 0,
    fontWeight: 700,
    color: '#007BFF',
    fontSize: '1.5rem',
    letterSpacing: '0.5px',
  },
  subtitle: {
    color: '#888',
    fontSize: '1rem',
    marginBottom: '8px',
    textAlign: 'center',
  },
  input: {
    padding: '10px',
    borderRadius: '7px',
    border: '1.5px solid #e0e0e0',
    width: '100%',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s, box-shadow 0.2s',
    marginBottom: '2px',
    boxSizing: 'border-box',
    background: '#f8fafd',
    boxShadow: '0 1px 2px #007bff08',
  },
  showBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#007BFF',
    padding: 0,
    outline: 'none',
  },
  button: {
    padding: '12px 0',
    background: 'linear-gradient(90deg, #007BFF 0%, #0056b3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '7px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    marginTop: '6px',
    boxShadow: '0 2px 8px rgba(0,123,255,0.08)',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
  },
  hint: {
    fontSize: '0.92rem',
    color: '#888',
    marginTop: '8px',
    textAlign: 'center',
  },
  // Keyframes for fadeIn (inject in your global CSS if needed)
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};