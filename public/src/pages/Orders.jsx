import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from 'axios';
import {fetchOrders, updateOrderStatus} from '../utils/APIroutes';
import parcel_icon from "../utils/frontend_assets/parcel_icon.png";
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

function Orders()
{
	const [orders, setOrders] = useState([]);
	const [orderStatus, setOrderStatus] = useState([]);
	
	const fetchAllOrders = async () => {
		// console.log(fetchOrders);
		const {data: {status, orderItems, msg}} = await axios(`${fetchOrders}`);
        if(status)
		{
			setOrders(orderItems);
			const status = [];
			orderItems.forEach(item => status.push(item.orderStatus));
			setOrderStatus(status);
		}
        else toast.error(`${msg}`, toastOptions);
	};

	useEffect(() => {
		fetchAllOrders();
	}, []);

	const handleStatusChange = async (e, _id) => {
		const {value} = e.target;
		console.log(value);
		const {data: {status, updatedOrder, msg}} = await axios.patch(`${updateOrderStatus}/${_id}`, {value});
		if(status)
		{
			toast.success(`Status updated successfully`, toastOptions);
			console.log(updatedOrder);
			const newOrders = [];
			const status = [];
			orders.forEach((order) => {
				if(order._id === updatedOrder._id)
				{
					newOrders.push({...order, orderStatus: updatedOrder.orderStatus});
					status.push(updatedOrder.orderStatus);
				}
				else
				{
					newOrders.push(order);
					status.push(order.orderStatus);
				}
				console.log(newOrders);
				console.log(status);
			});
			setOrders(newOrders);
			setOrderStatus(status);
		}
		else toast.error(`${msg}`, toastOptions);
	};

    return (
        <>
            <Container>
                <Title>Order Page</Title>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <OrderCard key={order._id}>
                            <ParcelIcon src={parcel_icon} alt="Parcel Icon"/>
                            <OrderDetails>
                                <ItemInfo>
                                    {order.orders.map((item, index) => (
                                        <span key={index}>{item.name} x {item.quantity}{index !== order.orders.length - 1 && ', '}</span>
                                    ))}
                                </ItemInfo>
								<CustomerInfo>
									<strong>{order.userInfo.firstName} {order.userInfo.lastName}</strong>
									<p>{order.userInfo.address}, {order.userInfo.city}, {order.userInfo.state}, {order.userInfo.pincode}</p>
									<p style={{marginTop: "0.4rem"}}>{order.userInfo.phone}</p>
								</CustomerInfo>
                            </OrderDetails>
							<OrderMeta>
								<ItemsCount>Items: {order.orders.length}</ItemsCount>
								<TotalPrice>${order.totalPrice}</TotalPrice>
							</OrderMeta>
							<OrderStatus>
								<StatusSelect value={orderStatus[index]} onChange={(e) => handleStatusChange(e, order._id)}>
									<option value="Food Processing">Food Processing</option>
									<option value="Out for Delivery">Out for Delivery</option>
									<option value="Delivered">Delivered</option>
								</StatusSelect>
							</OrderStatus>
                        </OrderCard>
                    ))
                ) : (
                    <NoOrdersMessage>No orders available</NoOrdersMessage>
                )}
            </Container>
            <ToastContainer/>
        </>
    );
}

const Container = styled.div`
	height: 100%;
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h1`
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #333;
`;

const OrderCard = styled.div`
    display: flex;
    align-items: flex-start;
	justify-content: space-between;
    width: 100%;
    border: 1px solid #d8b9b2;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ParcelIcon = styled.img`
    width: 4rem;
    /* height: 2rem; */
    /* margin-right: 1.5rem; */
`;

const OrderDetails = styled.div`
	width: 30vw;
	/* background-color: red; */
    /* flex: 1; */
    display: flex;
    flex-direction: column;
`;

const ItemInfo = styled.div`
    font-size: 1.1rem;
    margin-bottom: 1rem;
`;

const OrderMeta = styled.div`
    display: flex;
    justify-content: space-between;
	gap: 5rem;
    margin-bottom: 1rem;
    font-size: 1rem;
`;

const ItemsCount = styled.div`
    color: #666;
`;

const TotalPrice = styled.div`
    font-weight: bold;
    color: #333;
`;

const CustomerInfo = styled.div`
    /* margin-bottom: 1rem; */
    color: #333;
    font-size: 0.9rem;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;

	/* strong
	{
		margin-bottom: 0rem;
	} */
`;

const OrderStatus = styled.div`
    display: flex;
    /* justify-content: flex-end; */
`;

const StatusSelect = styled.select`
    padding: 0.7rem;
    /* border-radius: 5px; */
    border: 1px solid #d8b9b2;
    background-color: #fce4d6;
	cursor: pointer;

	&:focus
	{
		outline: none;
	}
`;

const NoOrdersMessage = styled.p`
    font-size: 1.5rem;
    color: #888;
`;

export default Orders;