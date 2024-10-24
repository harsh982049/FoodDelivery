const host = "https://food-delivery-api-five.vercel.app";

export const loginRoute = `${host}/api/auth/login`;
export const adminLoginRoute = `${host}/api/auth/adminLogin`;
export const registerRoute = `${host}/api/auth/register`;
export const getMenu = `${host}/api/restaurant/getMenu`;
export const getCartItems = `${host}/api/restaurant/getCartItems`;
export const increaseCartItem = `${host}/api/restaurant/increaseCartItem`;
export const decreaseCartItem = `${host}/api/restaurant/decreaseCartItem`;
export const removeCartItem = `${host}/api/restaurant/removeCartItem`;
export const removeUserCart = `${host}/api/restaurant/removeUserCart`;
export const removeMenuItem = `${host}/api/restaurant/removeMenuItem`;
export const addToMenu = `${host}/api/restaurant/addToMenu`;
export const addOrder = `${host}/api/restaurant/addOrder`;
export const fetchOrders = `${host}/api/restaurant/fetchOrders`;
export const fetchUserOrder = `${host}/api/restaurant/fetchUserOrder`;
export const updateOrderStatus = `${host}/api/restaurant/updateOrderStatus`;
