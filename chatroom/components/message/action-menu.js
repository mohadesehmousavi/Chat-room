import { removeMessage } from "../../socket-client";
import CopyIcon from "../../assets/content-copy.svg";
import DeleteIcon from "../../assets/delete-outline.svg";
import { Menu, Message } from "..";

/**
 * @param {HTMLElement} messageElement
 * @returns {Array<import("../menu").MenuItem>}
 */
const createMenuItems = messageElement => {
  const isMine = messageElement.classList.contains("message--mine");
  const menuItems = [
    {
      title: "Copy",
      iconSrc: CopyIcon,
      onClick: () => {
        Menu.hide();

        const messageBody = /**@type {HTMLElement | null} */ (
          messageElement.querySelector(".message__body")
        );

        const content = messageBody?.textContent;

        if (!content) return;

        navigator.clipboard.writeText(content);
      },
    },
  ];

  if (isMine)
    menuItems.push({
      title: "Delete",
      iconSrc: DeleteIcon,
      onClick: () => {
        Menu.hide();
        Message.remove(messageElement);

        removeMessage(messageElement.id);
      },
    });
  return menuItems;
};

/**
 * @param {MouseEvent} event
 */
const handleMessagesClick = event => {
  const eventReciever = /** @type {HTMLElement| null} */ (event.target);

  if (!eventReciever) return;

  // Checking the ancestors to find the action element
  const actionsElement = /** @type {HTMLElement| null} */ (
    eventReciever.closest(".message__more-actions")
  );

  if (!actionsElement) return;

  // Get the root of the message element
  const messageElement = /** @type {HTMLElement| null} */ (
    eventReciever.closest(".message")
  );

  if (!messageElement) return;

  if (Menu.isOpen()) Menu.hide();
  else {
    const menuItems = createMenuItems(messageElement);

    Menu.setItems(menuItems);
    Menu.setPlacement("bottom");
    Menu.setAnchor(actionsElement);

    Menu.show();
  }
};

export const attachEvents = () => {
  const messages = document.getElementById("messages");

  messages?.addEventListener("click", handleMessagesClick);
};

export const detachEvent = () => {
  const messages = document.getElementById("messages");

  messages?.removeEventListener("click", handleMessagesClick);
};
