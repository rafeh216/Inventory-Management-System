import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getItems = () => API.get("/items");
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const restockItem = (id, restockData) => API.post(`/items/restock/${id}`, restockData);

export const getSalesHistory = () => API.get("/sales/history");
export const deleteSale = (id) => API.delete(`/sales/${id}`);
export const getTotalCash = () => API.get("/sales/total-cash");

export const resetItemStats = () => API.post("/items/reset-stats");

export default API;
