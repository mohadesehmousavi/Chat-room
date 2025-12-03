import { shift } from "@floating-ui/core";
import { computePosition } from "@floating-ui/dom";

/**
 * @typedef {{
 * title: string;
 * iconSrc?: string;
 * onClick: (event: MouseEvent) => void;
 * }} MenuItem;
 */

/** @type {{
 * open: boolean;
 * anchor: HTMLElement | null;
 * placement: import("@floating-ui/dom").Placement;
 * }} */
const state = { open: false, anchor: null, placement: "bottom" };

export const getMenu = () => document.getElementById("menu");

export const isOpen = () => state.open;

/**
 * @param {HTMLElement} anchorElement
 */
export const setAnchor = anchorElement => {
  state.anchor = anchorElement;
};

/**
 * @param {import("@floating-ui/dom").Placement} placement
 */
export const setPlacement = placement => {
  state.placement = placement;
};

/**
 * @param {MouseEvent} event
 */
const handleClickOutside = event => {
  const target = /** @type {HTMLElement | null} */ (event.target);

  if (!target) return;

  const menu = getMenu();

  if (!menu) return;

  // If target was in menu do nothing, because it's not outside
  if (menu.contains(target)) return;

  // If target was the anchor element or a descendant of anchor element, do nothing
  if (target === state.anchor || state.anchor?.contains(target)) return;

  hide();
};

export const show = () => {
  const menu = getMenu();

  if (!menu) return;
  if (!state.anchor) return;

  computePosition(state.anchor, menu, {
    placement: state.placement,
    strategy: "fixed",
    middleware: [shift()],
  }).then(position => {
    const { x, y } = position;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.classList.add("menu--open");

    document.addEventListener("click", handleClickOutside);

    state.open = true;
  });
};

export const hide = () => {
  const menu = getMenu();

  if (!menu) return;

  state.open = false;
  menu.classList.remove("menu--open");

  document.removeEventListener("click", handleClickOutside);
};

/**
 * @param {MenuItem} item
 * @returns {HTMLElement}
 */
const createItemElement = item => {
  const { onClick, title, iconSrc } = item;

  const menuItem = document.createElement("div");
  menuItem.classList.add("menu__list__item");

  if (iconSrc) {
    const icon = document.createElement("span");
    icon.classList.add("menu__list__item__icon", "icon", "icon--medium");

    const img = document.createElement("img");
    img.src = iconSrc;

    icon.appendChild(img);
    menuItem.appendChild(icon);
  }

  const text = document.createTextNode(title);

  menuItem.appendChild(text);
  menuItem.addEventListener("click", onClick);

  return menuItem;
};

/**
 * @param {Array<MenuItem>} items
 */
export const setItems = items => {
  const menu = getMenu();

  if (!menu) return;

  const list = /** @type {HTMLElement | null} */ (
    menu.querySelector(".menu__list")
  );

  if (!list) return;

  // Empty the list
  list.innerHTML = "";

  const fragment = document.createDocumentFragment();

  // Transform item data to item element and then append them to fragment
  items.map(createItemElement).forEach(menuItem => {
    fragment.appendChild(menuItem);
  });

  // Add fragment to list
  list.appendChild(fragment);
};
