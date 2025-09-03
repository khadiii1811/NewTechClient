import axios from "axios";

const API_URL = "http://localhost:5070/api/customers";
const getCustomers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const addCustomer = async (customer) => {
  const res = await axios.post(API_URL, customer);
  return res.data;
};

const updateCustomer = async (id, customer) => {
  const res = await axios.put(`${API_URL}/${id}`, customer);
  return res.data;
};

const deleteCustomer = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export default {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
