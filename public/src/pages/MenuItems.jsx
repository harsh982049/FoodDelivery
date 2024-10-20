import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from 'axios';
import {getMenu, removeMenuItem} from '../utils/APIroutes';
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

function MenuItems()
{
    const [menu, setMenu] = useState([]);

    const fetchMenu = async () => {
        const {data: {status, menu: menuItems, msg}} = await axios(getMenu);
        if(!status) toast.error(`${msg}`, toastOptions);
        setMenu(menuItems);
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleRemove = async (_id) => {
        const {data} = await axios.delete(`${removeMenuItem}/${_id}`);
        if(!data.status) toast.error(`${data.msg}`, toastOptions);
        else
        {
            toast.success("Food Removed", {...toastOptions, position: "top-right"});
            fetchMenu();
        }
    };

    return (
        <>
            <Container>
                <p>All Foods List</p>
                <CartTable>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <ItemImage src={item.image} alt={item.name}/>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>${item.price}</td>
                                <td>
                                    <RemoveButton onClick={() => handleRemove(item._id)}>x</RemoveButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </CartTable>
            </Container>
            <ToastContainer/>
        </>
    );
}

const Container = styled.div`
    /* background-color: blue; */
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const CartTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;

    th, td
    {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    th
    {
        background-color: #f2f2f2;
        /* font-weight: bold; */
    }
    tr
    {
        border: 2px solid black;
        /* border-width: 1px 1px; */
    }
`;

const ItemImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: red;
    font-size: 1.2rem;
    cursor: pointer;
`;

export default MenuItems;