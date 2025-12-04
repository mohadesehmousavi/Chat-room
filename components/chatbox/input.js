import { Button } from ".";
import { KeyboardEventKeys } from "../../constants";
import { sendMessage, sendTypingUser } from "../../socket-client";
import { state } from "../../state";

export const getInputElement = () =>
  /** @type {HTMLInputElement | null} */ (
    document.getElementById("chat-input")
  );

export const hasValue = () => !!getInputElement()?.value;

export const reset = () => {
  const inputElement = getInputElement();

  if (!inputElement) return;

  inputElement.value = "";
  Button.disable();
};

export const resizeHeight = () => {
  const inputElement = getInputElement();

  if (!inputElement) return;

  inputElement.style.height = "auto";
  inputElement.style.height = inputElement?.scrollHeight + "px";
};

/**
 * @param {KeyboardEvent} event
 */
const handleKeydown = event => {
  const inputElement = getInputElement();

  if (!inputElement) return;

  if (!hasValue()) resizeHeight();

  if (event.key === KeyboardEventKeys.ENTER) {
    event.preventDefault();

    if (!hasValue()) return;

    sendMessage({
      body: inputElement.value,
      userId: state.userId,
    });

    reset();
  }
};

const handleInput = () => {
  const inputElement = getInputElement();

  if (!inputElement) return;

  if (!hasValue()) {
    Button.disable();
    resizeHeight();
  } else {
    Button.enable();

    sendTypingUser(state.username);

    resizeHeight();
  }
};

export const attachEvents = () => {
  const inputElement = getInputElement();

  inputElement?.addEventListener("keydown", handleKeydown);
  inputElement?.addEventListener("input", handleInput);
};

export const detachEvent = () => {
  const inputElement = getInputElement();

  inputElement?.removeEventListener("keydown", handleKeydown);
  inputElement?.removeEventListener("input", handleInput);
};
