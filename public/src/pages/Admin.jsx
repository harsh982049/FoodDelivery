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

    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem('food-app-admin'));
        if(!admin) navigate('/adminLogin');
    }, []);

    return (
        <Container>
            <AdminNavbar/>
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    /* margin: 0 10vw 0 10vw; */
`;

export default Admin;