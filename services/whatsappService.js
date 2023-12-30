import API from "./apiClient";

export const WhatsAppService = {
  sendMessages: async (data) => {
    const response = await API.post("/wa/sendMessage", data);
    return response;
  },
  broadcastMessages: async (month) => {
    const response = await API.post(`/wa/broadcastMessage/${month}`);
    return response;
  },
  logout: async () => {
    const response = await API.post("/wa/logout");
    return response;
  },
};
