import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '16px',
          margin: '16px',
          borderRadius: '8px',
          border: '1px solid rgb(254, 202, 202)',
          backgroundColor: 'rgb(254, 242, 242)',
          color: 'rgb(185, 28, 28)',
          fontSize: '14px'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>
            Erro inesperado
          </p>
          <p style={{ color: 'rgb(107, 114, 128)', fontSize: '12px' }}>
            {this.state.error?.message || 'Tente recarregar a página'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
