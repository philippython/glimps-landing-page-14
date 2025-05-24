
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './auth/AuthProvider';
import { LocaleProvider } from './locales/LocaleProvider';

// Create root first but don't render immediately
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = createRoot(rootElement);

// Render the app with all necessary providers
root.render(
  <LocaleProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LocaleProvider>
);
