import { io } from "socket.io-client";
import { authentication } from "./services";
import { state } from "./state";
import { AuthModal, Message } from "./components";
import { Members } from "./components";

const port = import.meta.env.VITE_WS_PORT ?? 3000;

/** @type {number} */
let typingTimeoutRef = -1;

const socket = io(`localhost:${port}`, { autoConnect: false });

export const connect = () => {
  socket.connect();
};

/**
 * @param {Pick<import("./server/main").Message, "body" | "userId">} message
 */
export const sendMessage = message => {
  socket.emit("message:add", message);
};

/** @param {string} username */
export const requestLogin = username => {
  socket.emit("user:login", username);
};

/** @param {string} userId */
export const requestLogout = userId => {
  socket.emit("user:logout", userId);
};

/**
 * @param {string} id
 */
export const removeMessage = id => {
  socket.emit("message:remove", id);
};

/**
 * @param {string} user
 */
export const sendTypingUser = user => {
  socket.emit("typing", user);
};

socket.on(
  "message:add",
  (/** @type {import("./server/main").Message} */ message) => {
    const messageEl = Message.create({
      id: message.id,
      userId: message.userId,
      body: message.body,
    });

    Message.render(messageEl);
  },
);

socket.on(
  "messages:all",
  (
    /** @type {Array<Omit<import("./server/main").Message, "createdAt">>} */ messages,
  ) => {
    if (!messages) return;
    messages.forEach(message => {
      const messageElement = Message.create(message);
      Message.render(messageElement);
    });
  },
);

socket.on("user:login", response => {
  const { status, user } = /**
   * @type {{
   * status: "success";
   * user: import("./server/main").User;
   * } | {
   * status: "failure";
   * user: null;
   * }}
   */ (response);

  if (status === "success") {
    authentication.login(user);

    state.userId = user.id;
    state.username = user.name;

    AuthModal.hide();
  } else {
    authentication.logout();

    requestLogout(state.userId);

    state.userId = "";
    state.username = "";

    AuthModal.show();
  }
});

socket.on(
  "users:all",
  (/** @type {import("./server/main").User[]} */ users) => {
    state.users = users.reduce((result, user) => {
      result[user.id] = user;

      return result;
    }, /** @type {Record<string, import("./server/main").User>} */ ({}));
  },
);

socket.on("users:connected:all:count", (/** @type {number} */ count) => {
  Members.setCount(String(count));
});

socket.on("users:connected:all", (/** @type {String[]}} */ usernames) => {
  Members.setMembers(usernames);
});

socket.on("typing", (/** @type {String} */ username) => {
  window.clearTimeout(typingTimeoutRef);

  /** @type {HTMLElement | null} */
  const typingIndicator = document.getElementById("typing-indicator");

  if (!typingIndicator) return;

  typingIndicator.textContent = `${username} is typing...`;

  typingTimeoutRef = window.setTimeout(() => {
    typingIndicator.textContent = "";
  }, 500);
});
