import api from "./api";

export const chatService = {
  createChat: (title) => api.post("/chats", { title }),
  getChats: () => api.get("/chats"),
  getChat: (id) => api.get(`/chats/${id}`),
  deleteChat: (id) => api.delete(`/chats/${id}`),
  sendMessage: (chatId, content, messageType = "text") =>
    api.post(`/chats/${chatId}/messages`, { content, message_type: messageType }),
  getMessages: (chatId) => api.get(`/chats/${chatId}/messages`),
};

export const snippetService = {
  saveSnippet: (data) => api.post("/snippets", data),
  getSnippets: () => api.get("/snippets"),
  deleteSnippet: (id) => api.delete(`/snippets/${id}`),
};

export const aiService = {
  generateCode: (prompt, language) =>
    api.post("/ai/generate", { prompt, language }),
  explainCode: (code, language) =>
    api.post("/ai/explain", { code, language }),
  debugCode: (code, language, error) =>
    api.post("/ai/debug", { code, language, error }),
  convertCode: (code, fromLang, toLang) =>
    api.post("/ai/convert", { code, from_language: fromLang, to_language: toLang }),
  optimizeCode: (code, language) =>
    api.post("/ai/optimize", { code, language }),
};

export const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (data) => api.put("/users/me", data),
  getStats: () => api.get("/users/stats"),
};
