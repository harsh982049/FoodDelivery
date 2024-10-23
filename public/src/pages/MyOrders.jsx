import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import styled from "styled-components";
import axios from 'axios';
import parcel_icon from "../utils/frontend_assets/parcel_icon.png";
import {fetchOrders} from '../utils/APIroutes';
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

function MyOrders()
{
    const [myOrders, setMyOrders] = useState([]);
    const userId = JSON.parse(localStorage.getItem('food-app-user')).userId;
    // console.log(myOrders);

    const getOrders = async () => {
        const {data: {status, orderItems, msg}} = await axios(`${fetchOrders}/${userId}`);
        if(status) setMyOrders(orderItems);
        else toast.error(`${msg}`, toastOptions);
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <>
            <Container>
                <Navbar/>
                <Content>
                    <h2>My Orders</h2>
                    <OrderList>
                        {myOrders.length > 0 ? myOrders.map((order) => (
                            <OrderCard key={order._id}>
                                <OrderImage>
                                    <img src={parcel_icon} alt="Package"/>
                                </OrderImage>
                                <OrderDetails>
                                    <div className='order-items'>{order.orders.map(item => `${item.name} x ${item.quantity}`).join(', ')}</div>
                                    <OrderPrice>${order.totalPrice}</OrderPrice>
                                    {/* <OrderInfo> */}
                                        <div>Items: {order.orders.length}</div>
                                        <OrderStatus>
                                            <StatusDot/>
                                            {order.orderStatus}
                                        </OrderStatus>
                                    {/* </OrderInfo> */}
                                </OrderDetails>
                                {/* <TrackButton>Track Order</TrackButton> */}
                            </OrderCard>
                        )) : <p>No orders found.</p>}
                    </OrderList>
                </Content>
            </Container>
            <ToastContainer/>
        </>
    );
}

const Container = styled.div`
    /* background-color: red; */
    height: 100vh;
    width: 80vw;
    display: flex;
    flex-direction: column;

    margin: 0 10vw 0 10vw;
`;

const Content = styled.div`
    width: 80vw;
    /* margin: 0 10vw; */
    padding-top: 2rem;

    h2
    {
        font-size: 24px;
        font-weight: bold;
    }
`;

const OrderList = styled.div`
    margin-top: 1rem;
`;

const OrderCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid #E2E2E2;
    border-radius: 0.4rem;
    margin-bottom: 1rem;
`;

const OrderImage = styled.div`
    /* background-color: red; */
    width: 4rem;
    /* img
    {
        width: 100%;
    } */
`;

const OrderDetails = styled.div`
    /* background-color: red; */
    flex: 1;
    margin-left: 1rem;
    display: flex;
    justify-content: space-between;
    /* flex-direction: column; */

    div
    {
        /* background-color: red; */
        /* align-self: flex-start; */
        font-size: 1rem;
        /* margin-bottom: 10px; */
    }

    .order-items
    {
        /* background-color: red; */
        width: 40vw;
    }
`;

const OrderPrice = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;

const OrderInfo = styled.div`
    background-color: red;
    display: flex;
    justify-content: space-between;
    gap: 5rem;
    /* margin-top: 10px; */
`;

const OrderStatus = styled.div`
    /* background-color: blue; */
    display: flex;
    justify-content: center;
    /* align-items: center; */
    /* justify-self: baseline; */
`;

const StatusDot = styled.span`
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    margin-right: 5px;
    margin-top: 0.15rem;
`;

const TrackButton = styled.button`
    background-color: #FDEDED;
    border: 1px solid #FDEDED;
    border-radius: 4px;
    padding: 10px 20px;
    color: #FF5757;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #FF5757;
        color: white;
    }
`;

export default MyOrders;