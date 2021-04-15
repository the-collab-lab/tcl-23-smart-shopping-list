import getToken from './tokens';

export function checkLocalStorageForKey(key, defaultValue) {
  try {
    const saveToken = window.localStorage.getItem(key);
    return saveToken ? JSON.parse(saveToken) : defaultValue;
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
}

export function addKeyValuePairToLocalStorage(key) {
  try {
    window.localStorage.setItem(key, JSON.stringify(getToken()));
  } catch (error) {
    console.log(error);
  }
}
