import { nanoid } from "nanoid";

export default class Controller {
  constructor(/** @type {import("../main").State} */ state) {
    this.state = state;
  }

  /**
   * @param {import("../main").Message} message
   */
  add(message) {
    this.state.messages.byId[message.id] = message;
    this.state.messages.allIds.push(message.id);
  }

  /**
   * @param {Pick<import("../main").Message, "body" | "userId">} messageProps
   * @returns {import("../main").Message}
   */
  create(messageProps) {
    return {
      ...messageProps,
      id: nanoid(),
      createdAt: new Date(),
    };
  }

  /**
   * @param {import("../main").Message["id"]} id
   */
  get(id) {
    return this.state.messages.byId[id];
  }

  /**
   * @returns {string[]}
   */
  getAll() {
    return this.state.messages.allIds;
  }

  /**
   * @param {import("../main").Message["id"]} id
   */

  remove(id) {
    delete this.state.messages.byId[id];
    this.state.messages.allIds = this.state.messages.allIds.filter(
      ID => ID !== id,
    );
  }
}
