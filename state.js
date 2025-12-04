/**
 * @type {{
 * userId: string;
 * username: string;
 * users: Record<string, import("./server/main").User>
 * }}
 */
export const state = {
  userId: "",
  username: "",
  users: {},
};
