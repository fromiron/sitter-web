import axios from "axios";

export const axiosClient = axios.create({
  timeout: 3000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
