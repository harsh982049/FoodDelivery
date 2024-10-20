const host = "http://localhost:5000";

export const loginRoute = `${host}/api/auth/login`;
export const adminLoginRoute = `${host}/api/auth/adminLogin`;
export const registerRoute = `${host}/api/auth/register`;
export const getMenu = `${host}/api/restaurant/getMenu`;
export const getCartItems = `${host}/api/restaurant/getCartItems`;
export const increaseCartItem = `${host}/api/restaurant/increaseCartItem`;
export const decreaseCartItem = `${host}/api/restaurant/decreaseCartItem`;
export const removeCartItem = `${host}/api/restaurant/removeCartItem`;
export const removeMenuItem = `${host}/api/restaurant/removeMenuItem`;
export const addToMenu = `${host}/api/restaurant/addToMenu`;