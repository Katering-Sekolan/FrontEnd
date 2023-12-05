import API from "./apiClient";

export const TagihanService = {
  getAll: async () => {
    const response = await API.get("/semuaTagihanBulanan");
    return response;
  },
  getByMonth: async (month) => {
    const response = await API.get(`/tagihanBulanan/${month}`);
    return response;
  },
  create: async (data) => {
    const response = await API.post(`/tagihanBulanan/create`, data);
    return response;
  },
  update: async (id, data) => {
    const response = await API.put(`/tagihanBulanan/update/${id}`, data);
    return response;
  },
  delete: async (id) => {
    const response = await API.delete(`/tagihanBulanan/delete/${id}`);
    return response;
  },
};
