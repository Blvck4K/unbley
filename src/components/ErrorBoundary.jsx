import React from 'react';
import { Link } from 'react-router-dom';
import { reportClientError } from '../lib/runtimeMonitoring';

function MiniBugGame({ onRetry, error }) {
  const BEST_SCORE_KEY = 'unbley-error-game-best-score';
  const BASE_MOVE_MS = 760;
  const MIN_MOVE_MS = 260;

  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(12);
  const [bug, setBug] = React.useState({ x: 50, y: 46 });
  const [hitPulse, setHitPulse] = React.useState(false);
  const [bestScore, setBestScore] = React.useState(() => {
    try {
      const saved = Number(window.localStorage.getItem(BEST_SCORE_KEY) || 0);
      return Number.isFinite(saved) ? saved : 0;
    } catch {
      return 0;
    }
  });

  const moveInterval = React.useMemo(() => {
    return Math.max(MIN_MOVE_MS, BASE_MOVE_MS - Math.min(score * 36, BASE_MOVE_MS - MIN_MOVE_MS));
  }, [score]);

  React.useEffect(() => {
    if (timeLeft <= 0) return undefined;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft]);

  React.useEffect(() => {
    if (timeLeft <= 0) return undefined;

    const moveBug = setInterval(() => {
      setBug({
        x: 16 + Math.random() * 68,
        y: 18 + Math.random() * 52,
      });
    }, moveInterval);

    return () => clearInterval(moveBug);
  }, [timeLeft, moveInterval]);

  React.useEffect(() => {
    if (!hitPulse) return undefined;

    const timeout = setTimeout(() => setHitPulse(false), 120);
    return () => clearTimeout(timeout);
  }, [hitPulse]);

  const handleCatch = () => {
    if (timeLeft <= 0) return;

    const nextScore = score + 1;
    setScore(nextScore);
    setHitPulse(true);

    const updatedBest = Math.max(bestScore, nextScore);
    setBestScore(updatedBest);

    try {
      window.localStorage.setItem(BEST_SCORE_KEY, String(updatedBest));
    } catch {
      // ignore localStorage storage errors
    }

    setBug({
      x: 16 + Math.random() * 68,
      y: 18 + Math.random() * 52,
    });
  };

  const done = timeLeft <= 0;

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-12px) rotate(2deg) scale(1.04); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 201, 132, 0.15); }
          50% { box-shadow: 0 0 38px rgba(255, 201, 132, 0.36); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (max-width: 640px) {
          .error-actions { flex-direction: column; }
          .error-actions a, .error-actions button { width: 100%; }
          .error-card { padding: 22px 14px 18px !important; }
          .status-row { gap: 8px !important; }
          .status-pill { font-size: 11px !important; padding: 7px 10px !important; }
          .game-box { height: 180px !important; }
          .error-title { font-size: 28px !important; }
          .error-text { font-size: 15px !important; }
          .game-hint { font-size: 10px !important; }
        }
      `}</style>

      <div className="error-card" style={styles.card}>
        <div style={styles.badge}>Error page</div>

        <div className="status-row" style={styles.topRow}>
          <div className="status-pill" style={styles.scorePill}>Score: {score}</div>
          <div className="status-pill" style={styles.scorePill}>Best: {bestScore}</div>
          <div className="status-pill" style={styles.timerPill}>{done ? 'Time up' : `${timeLeft}s`}</div>
        </div>

        <div className="game-box" style={styles.gameBox}>
          <div className="game-hint" style={styles.gameHint}>Catch the bug before it escapes</div>
          <button
            type="button"
            onClick={handleCatch}
            aria-label="Catch the bug"
            style={{
              ...styles.bug,
              left: `${bug.x}%`,
              top: `${bug.y}%`,
              opacity: done ? 0.2 : 1,
              transform: `translate(-50%, -50%) scale(${hitPulse ? 1.22 : 1})`,
              boxShadow: hitPulse ? '0 0 30px rgba(255, 201, 132, 0.52)' : '0 12px 18px rgba(106, 62, 31, 0.18)',
            }}
          >
            <span style={styles.bugFace}>×</span>
          </button>
        </div>

        <h1 className="error-title" style={styles.title}>{done ? 'We hit a problem.' : 'Something went wrong.'}</h1>
        <p className="error-text" style={styles.text}>
          {done
            ? `You caught ${score} bug${score === 1 ? '' : 's'}. The page is safe again, and you can head back home.`
            : 'This page hit an unexpected error. While the bug is being squashed, you can keep going.'}
        </p>
        <p style={styles.joke}>Error detected. Recovery mode activated.</p>

        <div className="error-actions" style={styles.actions}>
          <Link to="/" style={styles.primaryButton}>Back to Home</Link>
          <button onClick={onRetry} style={styles.secondaryButton}>{done ? 'Play Again' : 'Try Again'}</button>
        </div>

        {error && <pre style={styles.errorBox}>{error?.message || error?.toString()}</pre>}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    reportClientError({ source: 'react-error', message: error?.message || String(error) });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <MiniBugGame onRetry={this.handleReload} error={this.state.error} />;
    }

    return this.props.children;
  }
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    background: 'radial-gradient(circle at top, #fff9f2 0%, #f6efe7 28%, #eee3d6 100%)',
    color: '#221510',
    fontFamily: 'Inter, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '760px',
    borderRadius: '30px',
    padding: '32px 24px 28px',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(106, 62, 31, 0.08)',
    boxShadow: '0 30px 80px rgba(34, 21, 16, 0.12)',
    textAlign: 'center'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 14px',
    borderRadius: '999px',
    background: '#fff1dd',
    color: '#7a461d',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginTop: '20px',
    marginBottom: '12px'
  },
  scorePill: {
    padding: '8px 12px',
    borderRadius: '999px',
    background: '#f8efe6',
    color: '#6a3e1f',
    fontWeight: 700,
    fontSize: '13px'
  },
  timerPill: {
    padding: '8px 12px',
    borderRadius: '999px',
    background: '#fffaf1',
    color: '#7a461d',
    fontWeight: 800,
    fontSize: '13px'
  },
  gameBox: {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #fffaf1 0%, #f7e7d7 100%)',
    border: '1px solid rgba(106, 62, 31, 0.08)',
    marginBottom: '18px'
  },
  gameHint: {
    position: 'absolute',
    left: '16px',
    top: '14px',
    color: '#8d5b36',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  bug: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    border: 'none',
    background: 'radial-gradient(circle at 30% 30%, #f5f0ee 0%, #d57f4d 28%, #7c3f22 100%)',
    boxShadow: '0 12px 18px rgba(106, 62, 31, 0.18)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    animation: 'floaty 1.2s ease-in-out infinite'
  },
  bugFace: {
    display: 'block',
    fontSize: '24px',
    lineHeight: 1,
    fontWeight: 900,
    transform: 'translateY(-2px)'
  },
  title: {
    margin: '6px 0 12px',
    fontSize: 'clamp(28px, 4vw, 50px)',
    lineHeight: 1.12,
    fontWeight: 800,
    letterSpacing: '-0.04em'
  },
  text: {
    margin: '0 auto',
    maxWidth: '560px',
    color: '#5e4b40',
    fontSize: '17px',
    lineHeight: 1.7
  },
  joke: {
    margin: '10px auto 0',
    color: '#8d5b36',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  actions: {
    marginTop: '28px',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 24px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6a3e1f 0%, #9c5a2a 100%)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 800,
    boxShadow: '0 14px 24px rgba(106, 62, 31, 0.18)'
  },
  secondaryButton: {
    padding: '14px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(106,62,31,0.18)',
    background: '#fffaf5',
    color: '#4d382d',
    fontWeight: 700,
    cursor: 'pointer'
  },
  errorBox: {
    marginTop: '22px',
    padding: '14px 16px',
    background: '#fffaf5',
    border: '1px solid rgba(106, 62, 31, 0.1)',
    borderRadius: '12px',
    color: '#754c3f',
    fontSize: '12px',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    overflowX: 'auto'
  }
};

export default ErrorBoundary;
