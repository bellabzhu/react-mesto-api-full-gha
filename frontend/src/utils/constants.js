const baseUrl = 'https://api.mestobella.nomoredomains.work';

export const apiConfig = {
  baseUrl: baseUrl,
  headers: {
    Accept: "application/json",
    'Content-Type': 'application/json'
  },
  userInfo: `${baseUrl}/users/me`,
  cards: `${baseUrl}/cards`,
  avatar: `${baseUrl}/users/me/avatar`,
  likes: `${baseUrl}/cards/cardId/likes`,
};
