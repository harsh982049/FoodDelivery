import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useNavigate, NavLink, Outlet} from 'react-router-dom';
import add_icon from "../utils/admin_assets/add_icon.png";
import order_icon from "../utils/admin_assets/order_icon.png";

function Navbar()
{
    const navigate = useNavigate();
    const [admin, setAdmin] = useState();

    useEffect(() => {
        const administrator = JSON.parse(localStorage.getItem('food-app-admin'));
        if(!administrator) navigate('/adminLogin');
        else if(localStorage.getItem('food-app-user')) localStorage.removeItem('food-app-user');
        else setAdmin(administrator);
    }, [navigate]);

    function handleLogin()
    {
        if(admin) localStorage.removeItem('food-app-admin');
        navigate('/adminLogin');
    }

    return (
        <>
            <Container style={{borderBottom: "1px solid black"}}>
                <div className='brand'>
                    <h1>Tomato.</h1>
                    <p>Admin Panel</p>
                </div>
                <div className='restaurant-sections'>
                    <button onClick={handleLogin}>{admin ? 'Sign Out' : 'Sign In'}</button>
                </div>
            </Container>
            {/* <hr/> */}
            <Layout>
                <Sidebar>
                    <NavLink to="/admin/addToMenu" className="nav-link" activeClassName="active">
                        <img src={add_icon} alt="Add Icon"/>
                        <span>Add Items</span>
                    </NavLink>
                    <NavLink to="/admin/menuItems" className="nav-link" activeClassName="active">
                        <img src={order_icon} alt="Order Icon"/>
                        <span>List Items</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className="nav-link" activeClassName="active">
                        <img src={order_icon} alt="Order Icon"/>
                        <span>Orders</span>
                    </NavLink>
                </Sidebar>
                <MainContent>
                    <Outlet/>
                </MainContent>
            </Layout>
        </>
    );
}

const Container = styled.div`
    height: 10vh;
    width: 100%;
    display: flex;
    /* position: fixed; */
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 1rem 2rem;

    .brand
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        h1
        {
            font-size: 2.5rem;
            color: #f16233;
        }
        p
        {
            font-weight: bold;
        }
    }

    .restaurant-sections
    {
        display: flex;
        align-items: center;
        gap: 1.3rem;
        button
        {
            border-radius: 1rem;
            border: 1px solid #f16233;
            padding: 0.7rem;
            font-weight: bold;
            cursor: pointer;

            background-color: white;
            color: #f16233;
            transition: all 0.3s ease;

            &:hover
            {
                background-color: #f16233;
                color: white;
                transform: scale(1.05);
            }
        }
    }
`;

const Layout = styled.div`
    display: flex;
    /* height: 100vh; */
    min-height: 100vh;
    /* border-right: 10px solid black; */
`;

const Sidebar = styled.aside`
    width: 20vw;
    padding: 1rem;
    /* background-color: #fff; */
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-right: 1px solid black;
    overflow-y: auto;

    .nav-link
    {
        padding: 0.4rem;
        display: flex;
        align-items: center;
        /* border-radius: 0.1rem; */
        /* font-weight: bold; */
        font-size: 1rem;
        color: #333;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid black;

        &:hover
        {
            background-color: #f9f9f9;
            border-color: #f16233;
            color: #f16233;
            cursor: pointer;
        }

        &.active
        {
            background-color: #fceae2;
            color: #f16233;
            border-color: #f16233;
        }

        span
        {
            margin-left: 1rem;
        }
    }
`;

const MainContent = styled.main`
    flex: 1;
    padding: 2rem;
    background-color: #f9f9f9;
    /* overflow-y: auto; */
    /* height: 100vh;  */
`;

export default Navbar;