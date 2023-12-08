import API from "./apiClient";

export const PembayaranService = {
    getAll: async () => {
        const response = await API.get("/pembayaran/getAll");
        return response;
    },
    getByUserId: async (id) => {
        const response = await API.get(`/userPembayaran/getByUserId/${id}`);
        return response;
    },
    getByMonth: async (month) => {
        const response = await API.get(`/pembayaran/getByMonth/${month}`);
        return response;
    },
    create: async (data) => {
        const response = await API.post(`/pembayaran/create`, data);
        return response;
    },
    update: async (id, data) => {
        const response = await API.put(`/pembayaran/update/${id}`, data);
        return response;
    },
    delete: async (id) => {
        const response = await API.delete(`/pembayaran/delete/${id}`);
        return response;
    },
};