import API from "./apiClient";

export const HargaService = {
  getAll: async () => {
    const response = await API.get("/harga");
    return response;
  },
  getOne: async (id) => {
    const response = await API.get(`/harga/${id}`);
    return response;
  },
  update: async (id, data) => {
    const response = await API.put(`/harga/update/${id}`, data);
    return response;
  },
};
