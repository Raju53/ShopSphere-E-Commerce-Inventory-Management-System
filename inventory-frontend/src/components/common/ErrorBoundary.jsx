import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
                    <h2>Oops! Something went wrong in the {this.props.name || 'component'}.</h2>
                    <button onClick={() => window.location.reload()} className="btn-primary">
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;