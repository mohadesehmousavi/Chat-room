import { Input } from ".";
import { state } from "../../state";
import { KeyboardEventKeys } from "../../constants";
import { sendMessage } from "../../socket-client";

const buttonElement = document.getElementById("send-msg-btn");

export const enable = () => {
  buttonElement?.removeAttribute("disabled");
};

export const disable = () => {
  buttonElement?.setAttribute("disabled", "");
};

/**@param {MouseEvent} event*/
const handleClick = event => {
  const inputElement = Input.getInputElement();

  if (!inputElement || !Input.hasValue()) event.preventDefault();
  else {
    sendMessage({
      body: inputElement.value,
      userId: state.userId,
    });

    Input.reset();
  }
};

/**@param {KeyboardEvent} e*/
const handleKeydown = e => {
  const inputElement = Input.getInputElement();

  if (
    e?.key === KeyboardEventKeys.ENTER &&
    (!inputElement || !Input.hasValue)
  ) {
    e.preventDefault();
  } else if (e?.key === KeyboardEventKeys.ENTER) {
    if (!inputElement) return;

    sendMessage({
      body: inputElement.value,
      userId: state.userId,
    });

    Input.reset();
  }
};

export const attachEvents = () => {
  buttonElement?.addEventListener("click", handleClick);

  buttonElement?.addEventListener("keydown", handleKeydown);
};

export const detachEvent = () => {
  buttonElement?.removeEventListener("click", handleClick);

  buttonElement?.removeEventListener("keydown", handleKeydown);
};
