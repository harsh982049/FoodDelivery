import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import Cart from "./pages/Cart";
import Order from "./pages/Order";

function App()
{
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/adminLogin" element={<AdminLogin/>}/>
				<Route path="/register" element={<Register/>}/>
				<Route path="/adminRegister" element={<AdminRegister/>}/>
				<Route path="/cart" element={<Cart/>}/>
				<Route path="/order" element={<Order/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
