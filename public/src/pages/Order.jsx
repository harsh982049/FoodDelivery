import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
// import axios from 'axios';
// import {addOrder, removeUserCart} from '../utils/APIroutes';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    theme: "dark"
};

// Utility function to interact with IndexedDB
const useIndexedDB = (dbName, storeName) => {
    useEffect(() => {
        const openRequest = indexedDB.open(dbName, 1);
        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {keyPath: 'userId'});
            }
        };
    }, [dbName, storeName]);

    const saveToDB = (data) => {
        const openRequest = indexedDB.open(dbName, 1);
        openRequest.onsuccess = () => {
            const db = openRequest.result;
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            store.put(data); // Save user data using userId as key
        };
    };

    const getFromDB = (userId, callback) => {
        const openRequest = indexedDB.open(dbName, 1);
        openRequest.onsuccess = () => {
            const db = openRequest.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(userId); // Retrieve data using userId
            request.onsuccess = () => {
                callback(request.result);
            };
        };
    };

    return {saveToDB, getFromDB};
};

function Order()
{
    const navigate = useNavigate();
    const location = useLocation();
    const {saveToDB, getFromDB} = useIndexedDB('deliveryDB', 'deliveryInfo');
    const [userId, setUserId] = useState('');
    // axios.defaults.withCredentials = true;

    const {newCart: cart} = location.state;
    // console.log(cart);
    
    // State for user delivery info
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    // Fetch cart totals from session storage
    const [subtotal, setSubtotal] = useState(() => {
        const storedSubtotal = sessionStorage.getItem('subtotal');
        return JSON.parse(storedSubtotal);
    });
    const [shippingCost, setShippingCost] = useState(() => {
        const storedShipping = sessionStorage.getItem('shippingCost');
        return JSON.parse(storedShipping);
    });
    const [discount, setDiscount] = useState(() => {
        const storedDiscount = sessionStorage.getItem('discount');
        return JSON.parse(storedDiscount);
    });

    // On component mount, fetch delivery info if it exists
    useEffect(() => {
        const foodUser = JSON.parse(localStorage.getItem('food-app-user'));
        if(!foodUser) navigate('/login');
        // if(localStorage.getItem('food-app-admin')) localStorage.removeItem('food-app-admin');
        setUserId(foodUser.userId);
        getFromDB(userId, (data) => {
            if(data)
            {
                setUserInfo(data);
            }
        });
    }, [userId]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserInfo({...userInfo, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Save user information to IndexedDB
        saveToDB({...userInfo, userId}); // Add userId to the data
        toast.success('Delivery information saved!', toastOptions);
        const total = (subtotal + shippingCost - discount).toFixed(2);
        navigate('/payment', {state: {cart, total, shippingCost, discount, userInfo}});
    };

    return (
        <>
            <Container>
                <Navbar/>
                <ContentWrapper>
                    <FormSection>
                        <h2>Delivery Information</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{display: "flex", gap: "1rem"}}>
                                <Input
                                    type="text"
                                    name="firstName"
                                    value={userInfo.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="lastName"
                                    value={userInfo.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                            <Input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                            <Input
                                type="text"
                                name="address"
                                value={userInfo.address}
                                onChange={handleChange}
                                placeholder="Address"
                                required
                            />
                            <div style={{display: "flex", gap: "1rem"}}>
                                <Input
                                    type="text"
                                    name="city"
                                    value={userInfo.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="state"
                                    value={userInfo.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                />
                            </div>
                            <div style={{display: "flex", gap: "1rem"}}>
                                <Input
                                    type="text"
                                    name="pincode"
                                    value={userInfo.pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="phone"
                                    value={userInfo.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                    required
                                />
                            </div>
                            <SubmitButton type="submit">Proceed To Payment</SubmitButton>
                        </form>
                    </FormSection>
                    <CartSection>
                        <h2>Cart Totals</h2>
                        <TotalRow>
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </TotalRow>
                        <hr/>
                        <TotalRow>
                            <span>Delivery Fee:</span>
                            <span>${shippingCost.toFixed(2)}</span>
                        </TotalRow>
                        <hr/>
                        {discount !== 0 && <TotalRow>
                            <span>Discount:</span>
                            <span>- ${discount.toFixed(2)}</span>
                        </TotalRow>}
                        {discount !== 0 && <hr/>}
                        <TotalRow bold>
                            <span>Total:</span>
                            <span>${(subtotal + shippingCost - discount).toFixed(2)}</span>
                        </TotalRow>
                    </CartSection>
                </ContentWrapper>
            </Container>
            <ToastContainer />
        </>
    );
}

// Styled components for styling the page

const Container = styled.div`
    height: 100vh;
    width: 80vw;
    flex-direction: column;
    margin: 0 10vw 0 10vw;
`;

const ContentWrapper = styled.div`
    margin-top: 10vh;
    display: flex;
    justify-content: space-between;
`;

const FormSection = styled.div`
    width: 50%;
    h2
    {
        font-size: 1.7rem;
        margin-bottom: 2rem;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`;

const CartSection = styled.div`
    width: 40%;
    padding: 1rem;
    border-radius: 5px;
    h2
    {
        font-size: 1.7rem;
        margin-bottom: 1.5rem;
    }
`;

const Input = styled.input`
    font-size: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    &:focus
    {
        outline: none;
    }
`;

const SubmitButton = styled.button`
    font-size: 1.2rem;
    padding: 0.7rem 1rem;
    background-color: #fc5c23;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #db511f;
    }
`;

const TotalRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: ${props => (props.bold ? 'bold' : 'normal')};
    margin: 0.5rem 0 0.5rem 0;
`;

export default Order;