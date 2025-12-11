import axios from "axios";

export const api = axios.create({
  baseURL: "https://event-expenses-api.onrender.com",
});
