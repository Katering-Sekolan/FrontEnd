import API from "./apiClient";

export const PembayaranService = {
    getAll: async () => {
        const response = await API.get("/pembayaran/getAll");
        return response;
    },
    getByUserId: async (id, month) => {
        const response = await API.get(`/prosesPembayaran/getByUserIdBulan/${id}/${month}`);
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
    createTransaksi: async (data) => {
        const response = await API.post(`/userPembayaran/createTransaction`, data);
        return response;
    },
    update: async (id, data) => {
        const response = await API.put(`/pembayaran/update/${id}`, data);
        return response;
    },
    bayarTunai: async (id, data) => {
        const response = await API.put(`/prosesPembayaran/bayarTunai/${id}`, data);
        return response;
    },
    delete: async (id) => {
        const response = await API.delete(`/pembayaran/delete/${id}`);
        return response;
    },
};