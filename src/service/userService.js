import axios from "axios";

const API_URL = "http://localhost:5070/api/users";

const getUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const addUser = async (user) => {
  const res = await axios.post(API_URL, user);
  return res.data;
};

const updateUser = async (id, user) => {
  const res = await axios.put(`${API_URL}/${id}`, user);
  return res.data;
};

const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export default {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
