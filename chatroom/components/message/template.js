import { state } from "../../state";
import DotsIcon from "../../assets/dots-vertical.svg";

/**
 * @param {Omit<import("../../server/main").Message, "createdAt">} props
 */
export const create = props => {
  const { body, userId, id } = props;

  const isMine = state.userId === userId;

  const root = document.createElement("div");
  root.id = id;
  root.classList.add("message");

  const header = document.createElement("div");
  header.classList.add("message__header");

  const icon = document.createElement("div");
  icon.classList.add("icon", "icon--small", "message__more-actions");

  const img = document.createElement("img");
  img.setAttribute("src", DotsIcon);

  if (isMine) root.classList.add("message--mine");
  else {
    /** @type {{id: string, name: string} | undefined} */
    const user = state.users[userId];

    header.textContent = user?.name ?? "";
  }

  icon.appendChild(img);
  header.appendChild(icon);
  root.appendChild(header);

  const bodyEl = document.createElement("div");
  bodyEl.classList.add("message__body");
  bodyEl.textContent = body ?? "";

  root.appendChild(bodyEl);

  const footer = document.createElement("div");
  footer.classList.add("message__footer");
  footer.textContent = new Date().toLocaleDateString();

  root.appendChild(footer);

  return root;
};

/**
 * @param {HTMLElement} messageElement
 */
export const render = messageElement => {
  const messages =
    /** @type {HTMLSectionElement | null} */
    document.getElementById("messages");

  messages?.appendChild(messageElement);
};

/**
 * @param {HTMLElement} message
 */
export const remove = message => {
  message.remove();
};
