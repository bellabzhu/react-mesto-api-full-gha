import { authConfig } from './constants.js'

class Auth {
  constructor (authConfig) {
    this._authConfig = authConfig;
  }

  register (email, password) {
    return fetch(`${this._authConfig.baseUrl}/signup`, {
      method: "POST",
      headers: this._authConfig.headers,
      body: JSON.stringify({
        password: `${password}`,
        email: `${email}`
      }),
    })
    .then(this._checkResponse);
  };

  login (email, password) {
    return fetch(`${this._authConfig.baseUrl}/signin`, {
      method: "POST",
      headers: this._authConfig.headers,
      body: JSON.stringify({
        password: `${password}`,
        email: `${email}`
      }),
    })
    .then(this._checkResponse);
  };

  checkToken (jwt) {
    return fetch(`${this._authConfig.baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then(this._checkResponse);
  };

  _checkResponse (res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

export const auth = new Auth (authConfig);