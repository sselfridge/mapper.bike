import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

// VScode says this is unused but it is mistaken
import styles from './styles.css';

render(
  <App />,
  document.getElementById('root')
);
