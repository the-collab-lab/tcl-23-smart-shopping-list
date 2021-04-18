export function checkLocalStorageForKey(key, defaultValue) {
  try {
    const saveToken = window.localStorage.getItem(key);
    return saveToken ? JSON.parse(saveToken) : defaultValue;
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
}

export function addKeyValuePairToLocalStorage(key, newValue) {
  try {
    window.localStorage.setItem(key, JSON.stringify(newValue));
  } catch (error) {
    console.log(error);
  }
}
