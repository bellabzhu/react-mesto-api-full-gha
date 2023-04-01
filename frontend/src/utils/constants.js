const baseUrl = 'http://localhost:3030';

export const apiConfig = {
  baseUrl: baseUrl,
  headers: {
    authorization: '558a80cb-3690-42b7-804d-cc5d2ae305e4',
    'Content-Type': 'application/json'
  },
  fetchUserInfo: `${baseUrl}/users/me`,
  fetchCards: `${baseUrl}/cards`,
  fetchAvatar: `${baseUrl}/users/me/avatar`,
  fetchLikes: `${baseUrl}/cards/cardId/likes`,
}

export const authConfig = {
  baseUrl: baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
}