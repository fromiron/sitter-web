import axios, {AxiosInstance} from "axios";

export const axiosClient: AxiosInstance = axios.create({
    timeout: 3000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
