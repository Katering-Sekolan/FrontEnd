import API from "./apiClient";

export const AdministratorService = {
  getAll: async () => {
    const response = await API.get("/admin");
    return response;
  },
  getOne: async (id) => {
    const response = await API.get(`/admin/${id}`);
    return response;
  },
  update: async (id, data) => {
    const response = await API.put(`/admin/update/${id}`, data);
    return response;
  },
  delete: async (id) => {
    const response = await API.delete(`/admin/delete/${id}`);
    return response;
  },
  create: async (data) => {
    const response = await API.post("/admin/create", data);
    return response;
  },
};
