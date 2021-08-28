import Axios, { AxiosInstance } from 'axios';

const axios: AxiosInstance = Axios.create({
    // baseURL: process.env.REACT_APP_API_URL,
    baseURL: '/',
    withCredentials: true,
});
export default axios;
