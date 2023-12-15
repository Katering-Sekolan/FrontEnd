import API from "./apiClient";

export const WhatsAppService = {
  sendMessages: async (data) => {
    const response = await API.post("/wa/sendMessage", data);
    return response;
  },
};
