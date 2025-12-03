import { nanoid } from "nanoid";
import { Server } from "socket.io";

export default class Controller {
  constructor(/** @type {import("../main").State} */ state) {
    this.state = state;
  }

  /**
   * @param {import("../main").User} user
   */
  add(user) {
    this.state.users.byId[user.id] = user;
    this.state.users.allIds.push(user.id);
  }

  /**
   * @param {import("../main").User["id"]} id
   */
  getById(id) {
    const user = this.state.users.byId[id];

    if (!user) return null;

    return user;
  }

  /**
   * @param {import("../main").User["name"]} username
   */
  getByUsername(username) {
    const users = this.getAll();
    const target = users.find(user => user.name === username);

    if (!target) return null;

    return target;
  }

  getAll() {
    return this.state.users.allIds.reduce((result, currentId) => {
      const currentUser = /** @type {import("../main").User} */ (
        this.state.users.byId[currentId]
      );

      result.push(currentUser);

      return result;
    }, /** @type {Array<import("../main").User>} */ ([]));
  }

  /**
   * @param {import("../main").User["id"]} id
   */
  remove(id) {
    delete this.state.users.byId[id];
    this.state.users.allIds = this.state.users.allIds.filter(ID => ID !== id);
  }

  /**
   * @param {string} username
   * @returns {import("../main").User}
   */
  create(username) {
    return {
      id: nanoid(),
      name: username,
      isLoggedIn: true,
    };
  }

  /**
   * @param {string} username
   * @param {Server} connection
   * @returns {boolean}
   */
  isUserAlreadyLoggedIn(username, connection) {
    const user = this.getByUsername(username);

    if (!user) return false;

    for (const connectedSocket of connection.sockets.sockets.values()) {
      /**
       * @type {import("../main").User | null}
       */
      const connectedUser = connectedSocket.data.user;

      if (connectedUser && connectedUser.name === username) return true;
    }

    return user.isLoggedIn;
  }

  /**
   * @param {string} username
   * @returns {boolean}
   */
  isUserAlreadyExist(username) {
    const user = this.getByUsername(username);

    return Boolean(user);
  }
}
