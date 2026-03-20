import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioDataProvider } from './context/PortfolioDataContext';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioDataProvider>
            <App />
          </PortfolioDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

reportWebVitals();
