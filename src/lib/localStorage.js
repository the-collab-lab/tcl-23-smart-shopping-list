import getToken from './tokens';

export function checkForToken(key, value) {
  try {
    const saveToken = window.localStorage.getItem(key);
    return saveToken ? JSON.parse(saveToken) : value;
  } catch (error) {
    console.log(error);
    return value;
  }
}

export function addTokenToLocalStorage(key) {
  try {
    window.localStorage.setItem(key, JSON.stringify(getToken()));
  } catch (error) {
    console.log(error);
  }
}
