import "dotenv/config";

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { MessageController, UserController } from "./controllers";

/**
 * @typedef {{
 * id: string;
 * body: string;
 * userId: string;
 * createdAt: Date;
 * }} Message;
 *
 * @typedef {{
 * id: string;
 * name: string;
 * isLoggedIn: boolean
 * }} User;
 *
 * @typedef {{
 * byId: Record<string, Message>;
 * allIds: Array<string>;
 * }} Messages
 *
 * @typedef {{
 * byId: Record<string, User>;
 * allIds: Array<string>;
 * }} Users
 *
 * @typedef {{
 * messages: Messages;
 * users: Users;
 * }} State
 */

/** @type {State} */
const state = {
  messages: {
    byId: {},
    allIds: [],
  },
  users: {
    byId: {},
    allIds: [],
  },
};

const port = process.env.VITE_WS_PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const messageController = new MessageController(state);
const userController = new UserController(state);

io.on("connection", socket => {
  console.log("a socket connected");

  socket.on(
    "message:add",
    (/** @type {Pick<Message, "body" | "userId">} */ msg) => {
      const message = messageController.create(msg);
      messageController.add(message);

      // broadcasting a message
      io.emit("message:add", message);
    },
  );

  socket.on("message:remove", (/** @type {string} */ id) => {
    messageController.remove(id);
  });

  socket.on("message:get:all", () => {
    messageController.getAll();
  });

  socket.on("message:get", id => {
    messageController.get(/** @type {string} */ (id));
  });

  socket.on("typing", (/**@type {string} */ user) => {
    socket.broadcast.emit("typing", user);
  });

  socket.on("user:login", (/** @type {string} */ username) => {
    if (userController.isUserAlreadyExist(username)) {
      if (userController.isUserAlreadyLoggedIn(username, io)) {
        socket.emit("user:login", {
          status: "failure",
          user: null,
        });

        socket.data.user = null;

        io.emit("users:all", userController.getAll());
        io.emit("users:connected:all:count", io.sockets.sockets.size);

        const connectedSockets = Array.from(io.sockets.sockets.values());

        /**@type {string[]} */
        const connectedUsernames = connectedSockets
          .map(socket => socket.data?.user?.name)
          .filter(Boolean);

        io.emit("users:connected:all", connectedUsernames);

        return;
      }

      const user = userController.getByUsername(username);

      if (!user) return;

      user.isLoggedIn = true;

      socket.data.user = user;

      socket.emit("user:login", {
        user,
        status: "success",
      });

      io.emit("users:all", userController.getAll());
      io.emit("users:connected:all:count", io.sockets.sockets.size);
      socket.emit(
        "messages:all",
        messageController.getAll().reduce((result, currentId) => {
          /** @type {Message | undefined} */
          const message = messageController.get(currentId);
          result.push(message);
          return result;
        }, /** @type {Array<Message | undefined>} */ ([])),
      );

      const connectedSockets = Array.from(io.sockets.sockets.values());

      /**@type {string[]} */
      const connectedUsernames = connectedSockets
        .map(socket => socket.data?.user?.name)
        .filter(Boolean);

      io.emit("users:connected:all", connectedUsernames);

      return;
    }

    const user = userController.create(username);

    userController.add(user);

    socket.data.user = user;

    socket.emit("user:login", {
      user,
      status: "success",
    });

    io.emit("users:all", userController.getAll());
    io.emit("users:connected:all:count", io.sockets.sockets.size);

    const connectedSockets = Array.from(io.sockets.sockets.values());

    /**@type {string[]} */
    const connectedUsernames = connectedSockets
      .map(socket => socket.data?.user?.name)
      .filter(Boolean);

    io.emit("users:connected:all", connectedUsernames);
  });

  socket.on("user:logout", (/** @type {string} */ id) => {
    const user = userController.getById(id);

    if (user) user.isLoggedIn = false;

    socket.data.user = null;

    io.emit("users:all", userController.getAll());
    io.emit("users:connected:all:count", io.sockets.sockets.size);
    const connectedSockets = Array.from(io.sockets.sockets.values());
    /**@type {string[]} */
    const connectedUsernames = connectedSockets
      .map(socket => socket.data?.user?.name)
      .filter(Boolean);

    io.emit("users:connected:all", connectedUsernames);
  });

  socket.on("user:remove", (/** @type {string} */ id) => {
    userController.remove(id);
  });

  socket.on("user:get:all", () => {
    userController.getAll();
  });

  socket.on("user:get", id => {
    userController.getById(/** @type {string} */ (id));
  });

  socket.on("disconnect", () => {
    /**
     * @type {User | null}
     */
    const user = socket.data.user;

    if (user) user.isLoggedIn = false;

    io.emit("users:all", userController.getAll());
    io.emit("users:connected:all:count", io.sockets.sockets.size);
    const connectedSockets = Array.from(io.sockets.sockets.values());
    /**@type {string[]} */
    const connectedUsernames = connectedSockets
      .map(socket => socket.data?.user?.name)
      .filter(Boolean);

    io.emit("users:connected:all", connectedUsernames);
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
