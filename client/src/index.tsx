import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <App />
);