import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
            ✕
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-red-800">
              Something went wrong
            </h3>
            {this.state.error && (
              <p className="max-w-md text-sm text-red-600 break-words">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 transition-colors duration-150"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children || null;
  }
}

export default ErrorBoundary;
