import React from 'react';
import styled from "styled-components";
import {Link, useNavigate} from 'react-router-dom';
import {FaShoppingCart} from "react-icons/fa";
import {IoBagCheckSharp} from "react-icons/io5";

function Navbar()
{
    const navigate = useNavigate();

    function handleCartClick()
    {
        navigate('/cart');
    }

    function handleMyOrdersClick()
    {
        navigate('/myorders');
    }

    function handleLogin()
    {
        if(localStorage.getItem('food-app-user'))
        {
            localStorage.removeItem('food-app-user');
        }
        navigate('/login');
    }

    return (
        <Container>
            <div>
                <h1>Tomato.</h1>
            </div>
            <div className='navlinks'>
                <Link to='/'>Home</Link>
                <Link to='/contactus'>Contact Us</Link>
            </div>
            <div className='restaurant-sections'>
                <div className='shopping-cart' onClick={handleCartClick}>
                    <FaShoppingCart/>
                </div>
                <div className='my-orders' onClick={handleMyOrdersClick}>
                    <IoBagCheckSharp/>
                </div>
                <button onClick={handleLogin}>{localStorage.getItem('food-app-user') ? 'Sign Out' : 'Sign In'}</button>
            </div>
        </Container>
    );
}

const Container = styled.div`
    height: 10vh;
    width: 100%;
    display: flex;
    /* position: fixed; */
    align-items: center;
    justify-content: space-between;
    /* background-color: lightblue; */

    // Navbar should stay at top
    /* position: fixed;
    top: 0;
    left: 0;
    z-index: 2000; 
    background-color: white; 
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
    padding: 1rem 2rem;
    /* margin-bottom: 10vh; */
    h1
    {
        /* padding-left: 9rem; */
        font-size: 2.5rem;
        color: #f16233;
        /* margin-right: auto; */
    }
    .navlinks
    {
        justify-self: center;
        display: flex;
        gap: 1.5rem;
        font-size: 1.2rem;

        a {
            color: black;
            text-decoration: none;
            transition: color 0.3s ease;

            &:hover {
                color: #f16233;
            }
        }
    }
    .restaurant-sections
    {
        display: flex;
        /* justify-content: center; */
        align-items: center;
        gap: 1.3rem;
        /* margin-left: auto; */
        /* margin-right: 1rem; */
        .shopping-cart, .my-orders
        {
            font-size: 1.7rem;
            cursor: pointer;

            transition: transform 0.2s ease, color 0.3s ease;

            &:hover {
                transform: scale(1.2);
                color: #2b2b2b;
            }
        }
        button
        {
            /* margin-bottom: 0.5rem; */
            border-radius: 1rem;
            /* border: 1px solid #15f4ee; */
            border: 1px solid #f16233;
            padding: 0.7rem;
            font-weight: bold;
            cursor: pointer;

            background-color: white;
            color: #f16233;
            transition: all 0.3s ease;

            &:hover {
                background-color: #f16233;
                color: white;
                transform: scale(1.05);
            }
        }
    }
`;

export default Navbar;