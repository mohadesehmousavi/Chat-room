import { requestLogin } from "../socket-client";

const modal = document.getElementById("modal");

const form =
  /** @type {HTMLFormElement | null} */
  (document.getElementById("modal__body__form"));

const usernameInput =
  /** @type {HTMLInputElement | null} */
  (document.getElementById("input-username"));

const submitDummyBtn =
  /** @type {HTMLButtonElement | null} */
  (document.getElementById("modal__body__form__dummy-submit"));

const submitBtn =
  /** @type {HTMLButtonElement | null} */
  (document.getElementById("modal__action-bar__submit-btn"));

export const show = () => {
  modal?.classList.add("modal--visible");
};

export const hide = () => {
  modal?.classList.remove("modal--visible");
};

const handleSubmitBtnClick = () => {
  submitDummyBtn?.click();
};

/**
 * @param {SubmitEvent} event
 */
const handleFormSubmit = event => {
  event.preventDefault();

  const username = usernameInput?.value.trim();

  if (!username) return;

  // Requesting to login user
  requestLogin(username);
};

form?.addEventListener("submit", handleFormSubmit);
submitBtn?.addEventListener("click", handleSubmitBtnClick);
