import { storage } from ".";

export const isAuthenticated = () => {
  const user = /**
   * @type {(
   * Omit<import("../server/main").User, "isLoggedIn"> &
   * { expiresAt: number }
   * ) | null}
   */ (storage.read("user"));

  if (user === null) return false;
  if (user.expiresAt < Date.now()) return false;

  return true;
};
/**
 * @param {import("../server/main").User} user
 */
export const login = user => {
  const hours = 24;
  const expireDate = Date.now() + hours * 3600 * 1000;
  const userInfo = {
    id: user.id,
    name: user.name,
    expiresAt: expireDate,
  };

  storage.write("user", userInfo);
};

export const logout = () => {
  storage.remove("user");
};
