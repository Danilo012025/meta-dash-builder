
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Check if it's a Firebase URL parsing error
  if (event.error && 
      event.error.message && 
      event.error.message.includes('Cannot parse Firebase url')) {
    console.warn('Firebase URL configuration error. Please check your databaseURL in firebase.ts');
    
    // You can add custom error UI handling here if needed
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
