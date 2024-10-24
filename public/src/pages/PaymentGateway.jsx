import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import {addOrder, removeUserCart} from '../utils/APIroutes';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    theme: "dark"
};


function PaymentGateway()
{
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState('');
    const {cart, total, shippingCost, discount, userInfo} = location.state;
    // console.log(cart);
    
    useEffect(() => {
        const foodUser = JSON.parse(localStorage.getItem('food-app-user'));
        if(!foodUser) navigate('/login');
        // if(localStorage.getItem('food-app-admin')) localStorage.removeItem('food-app-admin');
        setUserId(foodUser.userId);
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolderName: '',
        country: 'India',
    });

    // Handle input change for form fields
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validate form inputs
    const validateForm = () => {
        const {email, cardNumber, expiry, cvv, cardHolderName} = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cardNumberRegex = /^\d{16}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
        const cvvRegex = /^\d{3}$/;

        if(!email || !emailRegex.test(email))
        {
            toast.error("Please enter a valid email", toastOptions);
            return false;
        }
        if(!cardNumber || !cardNumberRegex.test(cardNumber))
        {
            toast.error("Please enter a valid 16-digit card number", toastOptions);
            return false;
        }
        if(!expiry || !expiryRegex.test(expiry))
        {
            toast.error("Please enter a valid expiry date (MM/YY)", toastOptions);
            return false;
        }
        if(!cvv || !cvvRegex.test(cvv))
        {
            toast.error("Please enter a valid 3-digit CVV", toastOptions);
            return false;
        }
        if(!cardHolderName)
        {
            toast.error("Please enter the cardholder's name", toastOptions);
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateForm())
        {
            // Mock payment submission (replace with actual API call)
            const {data: {status, msg}} = await axios.post(addOrder, {cart, total, userId, userInfo});
            if(status)
            {
                toast.success(`${msg}`, toastOptions);
                const {data: {status: deleteCartStatus, msg: deleteCartMsg}} = await axios.delete(`${removeUserCart}/${userId}`);
                if(deleteCartStatus) navigate('/myorders');
                else toast.error(`${deleteCartMsg}`, toastOptions);
            }
            else toast.error(`${msg}`, toastOptions);
        }
    };

    return (
        <Container>
            <OrderSummary>
                <h2>Pay Course</h2>
                <h3>${total}</h3>
                <OrderItems>
                    {cart.map((item, index) => (
                        <OrderItem key={index}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>${item.price * item.quantity} (${item.price} each)</span>
                        </OrderItem>
                    ))}
                    <OrderItem>
                        <span>Delivery Charge</span>
                        <span>${shippingCost}</span>
                    </OrderItem>
                    {discount > 0 && (
                        <OrderItem>
                            <span>Discount</span>
                            <span>${discount}</span>
                        </OrderItem>
                    )}
                </OrderItems>
            </OrderSummary>
            <PaymentForm onSubmit={handleSubmit}>
                <h2>Pay with card</h2>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <Input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    maxLength="16"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                />
                <ExpiryCVV>
                    <Input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={formData.expiry}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        maxLength="3"
                        value={formData.cvv}
                        onChange={handleInputChange}
                    />
                </ExpiryCVV>
                <Input
                    type="text"
                    name="cardHolderName"
                    placeholder="Cardholder name"
                    value={formData.cardHolderName}
                    onChange={handleInputChange}
                />
                <Select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                </Select>
                <SubmitButton type="submit">Pay</SubmitButton>
            </PaymentForm>
            <ToastContainer/>
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 80vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding: 20px; */
    /* max-width: 1000px; */
    margin: 0 auto;
`;

const OrderSummary = styled.div`
    flex: 1;
    padding-right: 20px;
    border-right: 1px solid #ccc;
`;

const OrderItems = styled.div`
    margin-top: 20px;
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
`;

const PaymentForm = styled.form`
    flex: 1;
    padding-left: 20px;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const ExpiryCVV = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    input {
        width: 48%;
    }
`;

const Select = styled.select`
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: #218838;
    }
`;

export default PaymentGateway;