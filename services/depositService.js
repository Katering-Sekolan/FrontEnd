import API from "./apiClient";

export const DepositService = {
  getAll: async () => {
    const response = await API.get("/deposit");
    return response;
  },
  getOne: async (id) => {
    const response = await API.get(`/deposit/${id}`);
    return response;
  },
  update: async (id, data) => {
    const response = await API.put(`/deposit/update/${id}`, data);
    return response;
  },
};
