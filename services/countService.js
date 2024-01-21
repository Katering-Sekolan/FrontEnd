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
  getCountTagihan: async () => {
    const response = await API.get("/count/countTagihan");
    return response;
  },
  getCountLunas: async () => {
    const response = await API.get("/count/countLunas");
    return response;
  }
};
