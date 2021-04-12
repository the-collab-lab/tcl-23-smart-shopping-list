import getToken from './tokens';

export function checkLocalStorage(key, value) {
  const saveToken = window.localStorage.getItem(key);
  console.log(saveToken);
  return saveToken ? JSON.parse(saveToken) : value;
}

export function addLocalStorage(key) {
  window.localStorage.setItem(key, JSON.stringify(getToken()));
}
