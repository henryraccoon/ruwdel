import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout, signup } from './login';

const formLogin = document.querySelector('.form_login');
const formSignup = document.querySelector('.form_signup');
const logOutButton = document.querySelector('.logout-button');
const signupButton = document.querySelector('.signup-btn');

if (formLogin)
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutButton) logOutButton.addEventListener('click', logout);

if (formSignup)
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
