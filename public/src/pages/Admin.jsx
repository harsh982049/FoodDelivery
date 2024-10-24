import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavbar from "../components/AdminNavbar";
import styled from "styled-components";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions =
{
    position: "bottom-right",
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    theme: "dark"
};

function Admin()
{
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem('food-app-admin'));
        if(!admin) navigate('/adminLogin');
    }, []);

    return (
        <AdminContainer>
            <Content>
                <WelcomeSection>
                    <h1>Welcome to the Admin Panel</h1>
                    <p>Here you can manage the restaurant's menu and orders efficiently.</p>
                </WelcomeSection>
                <ActionSection>
                    <div className="action-card">
                        <h2>Add Menu Items</h2>
                        <p>Easily add new items to the menu with customizable details like name, price, and category.</p>
                    </div>
                    <div className="action-card">
                        <h2>Manage Orders</h2>
                        <p>View customer orders and update the status of ongoing deliveries.</p>
                    </div>
                    <div className="action-card">
                        <h2>Remove Items</h2>
                        <p>Remove outdated or unavailable items from the menu with a click of a button.</p>
                    </div>
                </ActionSection>
            </Content>
        </AdminContainer>
    );
}

const AdminContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;
    background-color: #f9f9f9;
    overflow-y: auto;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
`;

const WelcomeSection = styled.div`
    text-align: center;
    margin-bottom: 2rem;
    h1 {
        font-size: 2.5rem;
        color: #333;
    }
    p {
        font-size: 1.2rem;
        color: #555;
    }
`;

const ActionSection = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    .action-card {
        background-color: #fff;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 25%;
        text-align: center;
        h2 {
            font-size: 1.8rem;
            color: #e63946;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1rem;
            color: #333;
        }
        &:hover {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            cursor: pointer;
        }
    }
`;

export default Admin;