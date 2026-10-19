import React from 'react'
import ReactDOM from 'react-dom/client'
import "./styles/modal.css";
import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css'

import './styles/global.css'
import "./styles/responsive.css";
import "./styles/theme.css";

const savedTheme =
  localStorage.getItem("theme");

const preferredTheme =
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

document.documentElement.setAttribute(
  "data-theme",
  savedTheme || preferredTheme
);

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
