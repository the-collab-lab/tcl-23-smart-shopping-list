export function checkLocalStorage(key, value) {
  const saveToken = window.localStorage.getItem(key);
  console.log(saveToken);
  return saveToken ? JSON.parse(saveToken) : value;
}
