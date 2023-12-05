import API from "./apiClient";

export const PelangganService = {
  getAll: async () => {
    const response = await API.get("/user");
    return response;
  },
  getOne: async (id) => {
    const response = await API.get(`/user/${id}`);
    return response;
  },
  create: async (data) => {
    const response = await API.post(`/user/create`, data);
    return response;
  },
  update: async (id, data) => {
    const response = await API.put(`/user/update/${id}`, data);
    return response;
  },
};
