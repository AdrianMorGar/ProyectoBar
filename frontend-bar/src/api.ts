import axios from 'axios';

// const API_URL = 'https://rubber-stesha-adrianmorgar-e368679c.koyeb.app/bar/api';
const API_URL = 'http://localhost:8080/bar/api';

// Usuarios
export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/usuarios`);
  return response.data;
};

export const fetchUserById = async (userId: number) => {
  const response = await axios.get(`${API_URL}/usuarios/${userId}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/usuarios`, userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: any) => {
  const response = await axios.put(`${API_URL}/usuarios/${userId}`, userData);
  return response.data;
};

export const toggleUserStatus = async (userId: number) => {
  await axios.put(`${API_URL}/usuarios/${userId}/toggle`);
};

export const changePassword = async (userId: number, passwordData: { vieja: string; nueva: string }) => {
  await axios.put(`${API_URL}/usuarios/${userId}/password`, passwordData);
};

// Platos (Públicos)
export const fetchDishes = async () => {
  const response = await axios.get(`${API_URL}/platos`);
  return response.data;
};

export const fetchDishById = async (dishId: number) => {
  const response = await axios.get(`${API_URL}/platos/${dishId}`);
  return response.data;
};

// Platos (Protegidos - DUENO)
export const createDish = async (dishData: any) => {
  const response = await axios.post(`${API_URL}/platos`, dishData);
  return response.data;
};

export const updateDish = async (dishId: number, dishData: any) => {
  const response = await axios.put(`${API_URL}/platos/${dishId}`, dishData);
  return response.data;
};

export const toggleDishAvailability = async (dishId: number) => {
  await axios.patch(`${API_URL}/platos/${dishId}/toggle/habilitado`);
};

export const toggleDishDisponibility = async (dishId: number) => {
  await axios.patch(`${API_URL}/platos/${dishId}/toggle/Disponible`);
};

// Público
export const searchDishesByName = async (name: string) => {
  const response = await axios.get(`${API_URL}/platos/buscar?nombre=${name}`);
  return response.data;
};

// Tipos de platos (Públicos)
export const fetchTypes = async () => {
  const response = await axios.get(`${API_URL}/tipos`);
  return response.data;
};

export const fetchTypeById = async (typeId: number) => {
  const response = await axios.get(`${API_URL}/tipos/${typeId}`);
  return response.data;
};

// Tipos de platos (Protegidos - DUENO)
export const createType = async (typeData: any) => {
  const response = await axios.post(`${API_URL}/tipos`, typeData);
  return response.data;
};

export const updateType = async (typeId: number, typeData: any) => {
  const response = await axios.put(`${API_URL}/tipos/${typeId}`, typeData);
  return response.data;
};

export const deleteType = async (typeId: number) => {
  await axios.delete(`${API_URL}/tipos/${typeId}`);
};

// Pedidos (Protegidos - DUENO/TRABAJADOR)
export const fetchOrders = async () => {
  const response = await axios.get(`${API_URL}/pedidos`);
  return response.data;
};

export const fetchOrderById = async (orderId: number) => {
  const response = await axios.get(`${API_URL}/pedidos/${orderId}`);
  return response.data;
};

export const fetchOrderBill = async (orderId: number) => {
  const response = await axios.get(`${API_URL}/pedidos/${orderId}/cuenta`);
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await axios.post(`${API_URL}/pedidos`, orderData);
  return response.data;
};

export const updateOrder = async (orderId: number, orderData: any) => {
  const response = await axios.put(`${API_URL}/pedidos/${orderId}`, orderData);
  return response.data;
};

// Pedidos (Protegidos - DUENO)
export const deleteOrder = async (orderId: number) => {
  await axios.delete(`${API_URL}/pedidos/${orderId}`);
};

interface MonthlySales {
  [key: string]: number;
}

export const fetchDailySalesDetails = async (year: number, month: number, day: number) => {
  const response = await axios.get(`${API_URL}/pedidos/ventas/detalles/${year}/${month}/${day}`);
  return response.data;
};

export const fetchDailySalesByMonth = async (year: number, month: number) => {
  const response = await axios.get(`${API_URL}/pedidos/ventas/mes/${year}/${month}`);
  return response.data;
};

export const fetchMonthlySalesByYear = async (year: number): Promise<MonthlySales> => {
  const response = await axios.get(`${API_URL}/pedidos/ventas/anio/${year}`);
  return response.data;
};

// Pedidos (Protegidos - DUENO/TRABAJADOR)
export const fetchActiveOrdersForTable = async (tableNumber: number) => {
  const response = await axios.get(`${API_URL}/pedidos/activos/${tableNumber}`);
  return response.data;
};

export const fetchActiveOrders = async () => {
  const response = await axios.get(`${API_URL}/pedidos`);
  return response.data;
};

// Detalles de pedidos (Protegidos - DUENO/TRABAJADOR)
export const fetchOrderDetails = async () => {
  const response = await axios.get(`${API_URL}/detalles-pedido`);
  return response.data;
};

export const fetchOrderDetailById = async (detailId: number) => {
  const response = await axios.get(`${API_URL}/detalles-pedido/${detailId}`);
  return response.data;
};

export const createOrderDetail = async (detailData: any) => {
  const response = await axios.post(`${API_URL}/detalles-pedido`, detailData);
  return response.data;
};

export const updateOrderDetail = async (detailId: number, detailData: any) => {
  const response = await axios.put(`${API_URL}/detalles-pedido/${detailId}`, detailData);
  return response.data;
};

export const deleteOrderDetail = async (detailId: number) => {
  await axios.delete(`${API_URL}/detalles-pedido/${detailId}`);
};

export const cancelOrderDetail = async (detailId: number) => {
  await axios.patch(`${API_URL}/detalles-pedido/${detailId}/cancelar`);
};

export const markOrderDetailAsPending = async (detailId: number) => {
  await axios.patch(`${API_URL}/detalles-pedido/${detailId}/pendiente`);
};

export const serveOrderDetail = async (detailId: number) => {
  await axios.patch(`${API_URL}/detalles-pedido/${detailId}/servir`);
};

export const toggleOrderDetailStatus = async (detailId: number) => {
  await axios.patch(`${API_URL}/detalles-pedido/${detailId}/toggle-estado`);
};

export const fetchKitchenOrders = async () => {
  const response = await axios.get(`${API_URL}/detalles-pedido/activo`);
  return response.data;
};

export const fetchDrinkOrders = async () => {
  const response = await axios.get(`${API_URL}/detalles-pedido/bebidas`);
  return response.data;
};