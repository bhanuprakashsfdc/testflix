import { useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      setError(event.error || new Error(event.message));
      event.preventDefault();
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center bg-background">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-neutral-400 text-sm mb-6 max-w-sm">
          An unexpected error occurred. Please try refreshing the page or go back to the home page.
        </p>
        <details className="mb-6 max-w-md text-left">
          <summary className="text-xs text-neutral-600 cursor-pointer hover:text-neutral-400">Error details</summary>
          <pre className="mt-2 p-3 bg-neutral-900 rounded-lg text-xs text-red-400 overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
        <div className="flex gap-3">
          <button
            onClick={() => { setError(null); window.location.reload(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e50914] text-white rounded-lg font-medium hover:bg-[#c40812] transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
