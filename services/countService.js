import API from "./apiClient";

export const CountService = {
  getCountUsers: async () => {
    const response = await API.get("/count/countUser");
    return response;
  },
  getCountAdmins: async () => {
    const response = await API.get("/count/countAdmin");
    return response;
  },
};
