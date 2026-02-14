import api from "./api";

// create a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};

// get order by id

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};
