import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import PaymentGateway from "./pages/PaymentGateway";
import AdminNavbar from "./components/AdminNavbar";
import MenuItems from "./pages/MenuItems"; 
import AddToMenu from "./pages/AddToMenu"; 
import Orders from "./pages/Orders"; 
import MyOrders from "./pages/MyOrders";

function App()
{
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/admin" element={<AdminNavbar/>}>
					<Route path="orders" element={<Orders/>}/>
					<Route path="menuItems" element={<MenuItems/>}/>
					<Route path="addToMenu" element={<AddToMenu/>}/>
				</Route>
				<Route path="/login" element={<Login/>}/>
				<Route path="/adminLogin" element={<AdminLogin/>}/>
				<Route path="/register" element={<Register/>}/>
				<Route path="/cart" element={<Cart/>}/>
				<Route path="/order" element={<Order/>}/>
				<Route path="/myorders" element={<MyOrders/>}/>
				<Route path="/payment" element={<PaymentGateway/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
