import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null; info: ErrorInfo | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, fontFamily: 'monospace', color: '#fff', background: '#1a0a2e', minHeight: '100vh' }}>
          <h2 style={{ color: '#ef4444' }}>💥 Erreur fatale</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{String(this.state.error?.stack || this.state.error)}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, opacity: 0.7 }}>{this.state.info?.componentStack}</pre>
          <button onClick={() => { localStorage.clear(); location.reload(); }} style={{ marginTop: 20, padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 0, borderRadius: 8 }}>
            Reset localStorage + reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
