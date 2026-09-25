import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/pdf-drawer.css';
import './styles/guided-assistant.css';
import './styles/learning-profile.css';
import './styles/board.css';
import './styles/board-v2.css';
import './styles/lesson-experience.css';
import './styles/prep1-index.css';
import './styles/student-programs.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
