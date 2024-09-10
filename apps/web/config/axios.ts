import axiosC, { AxiosInstance } from "axios";

const axios: AxiosInstance = axiosC.create({
  baseURL: `${process.env.API_BASE_URL}/api/v1`,
});

export default axios;
