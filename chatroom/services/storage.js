/** @return {Storage} */
const getStorage = () => {
  return window.localStorage;
};

/**
 * @param {string} key
 * @returns {unknown}
 */
export const read = key => {
  const storage = getStorage();
  const item = storage.getItem(key);
  if (item === null) return null;
  return JSON.parse(item);
};

/**
 * @param {string} key
 * @param {unknown} value
 */
export const write = (key, value) => {
  const storage = getStorage();
  storage.setItem(key, JSON.stringify(value));
};

/** @param {string} key*/
export const remove = key => {
  const storage = getStorage();
  storage.removeItem(key);
};
