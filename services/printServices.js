import API from "./apiClient";

export const PrintService = {
    print: async (data) => {
        try {
            const response = await API.post(`/pdf/generatePdf`, data);
            return response.data;
        } catch (error) {
            console.error("Error printing kwitansi:", error);
            throw error;
        }
    },
};
