import { Menu } from ".";

/**
 * @type {{
 * members: string[]
 * }}
 */
const state = { members: [] };

/**
 * @param {string} count
 */
export const setCount = count => {
  const membersCount = document.getElementById("chat-members-count");

  if (!membersCount) return;

  membersCount.textContent = count;
};

/**
 * @param {string[]} members
 */
export const setMembers = members => {
  state.members = members;
};

/**
 * @returns {string[]}
 */
export const getMembers = () => {
  return state.members;
};

/**
 * @returns {Array<import("./menu").MenuItem>}
 */
export const createMembers = () => {
  const usernames = getMembers();

  return usernames.reduce((result, currentUsername) => {
    const member = {
      title: currentUsername,
      iconSrc: "",
      onClick: () => {
        Menu.hide();
      },
    };

    result.push(member);

    return result;
  }, /** @type {Array<import("./menu").MenuItem>} */ ([]));
};

/**
 * @param {MouseEvent} event
 */
export const handleMembersClick = event => {
  const eventReciever = /** @type {HTMLElement| null} */ (event.target);

  if (!eventReciever) return;

  if (Menu.isOpen()) Menu.hide();
  else {
    const memberItems = createMembers();
    Menu.setItems(memberItems);
    Menu.setAnchor(eventReciever);
    Menu.setPlacement("bottom");
    Menu.show();
  }
};

export const attachEvents = () => {
  const chatMembers = document.getElementById("chat-members");

  chatMembers?.addEventListener("click", handleMembersClick);
};

export const detachEvent = () => {
  const chatMembers = document.getElementById("chat-members");

  chatMembers?.removeEventListener("click", handleMembersClick);
};
