import API from "./apiClient";

export const WhatsAppService = {
  sendMessages: async (data) => {
    const response = await API.post("/wa/sendMessage", data);
    return response;
  },
  broadcastMessages: async () => {
    const response = await API.post("/wa/broadcastMessage");
    return response;
  },
  logout: async () => {
    const response = await API.post("/wa/logout");
    return response;
  },
};
