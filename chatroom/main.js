import "normalize.css";
import "./style.css";

import { Chatbox, AuthModal, Message, Members } from "./components";
import { connect, requestLogin } from "./socket-client";
import { authentication, storage } from "./services";
import { state } from "./state";

connect();

if (!authentication.isAuthenticated()) AuthModal.show();
else {
  const user = /**
   * @type {(
   * Omit<import("./server/main").User, "isLoggedIn"> &
   * { expiresAt: number }
   * )}
   */ (storage.read("user"));

  state.userId = user.id;
  state.username = user.name;

  requestLogin(state.username);
}

Chatbox.Button.attachEvents();
Chatbox.Input.attachEvents();
Message.ActionMenu.attachEvents();
Members.attachEvents();
