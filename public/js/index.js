import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login';

const formElement = document.querySelector('.form');
const logOutButton = document.querySelector('.logout-button');

if (formElement)
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutButton) logOutButton.addEventListener('click', logout);
