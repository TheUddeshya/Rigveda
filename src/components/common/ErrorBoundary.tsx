import React from 'react';
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: any) { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { /* Could log */ }
  render() { if (this.state.hasError) return <div>Something went wrong.</div>; return this.props.children; }
}
export default ErrorBoundary;
