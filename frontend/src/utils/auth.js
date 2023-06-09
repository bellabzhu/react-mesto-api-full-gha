import { apiConfig } from './constants.js'

class Auth {
  constructor (apiConfig) {
    this._config = apiConfig;
  }

  register (email, password) {
    return fetch(`${this._config.baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: `${password}`,
        email: `${email}`
      }),
      credentials: 'include',
    })
    .then(this._checkResponse);
  };

  login (email, password) {
    return fetch(`${this._config.baseUrl}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: `${password}`,
        email: `${email}`
      }),
      credentials: 'include',
    })
    .then(this._checkResponse);
  };

  logout () {
    return fetch(`${this._config.baseUrl}/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
  }

  checkToken () {
    return fetch(`${this._config.baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    .then(this._checkResponse)
  };

  _checkResponse (res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

export const auth = new Auth (apiConfig);