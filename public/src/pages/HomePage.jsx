// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import styled from "styled-components";
// import Card from 'react-bootstrap/Card';
// import axios from 'axios';
// import AnchorLink from "react-anchor-link-smooth-scroll";
// import BackgroundFood from "../utils/frontend_assets/header_img.png";
// import { menu_list, foodImages } from '../utils/frontend_assets/assets';
// import { getFoodMenu, getCartItems, updateCartItem } from '../utils/APIroutes';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const toastOptions = {
//     position: "bottom-right",
//     autoClose: 3000,
//     draggable: true,
//     pauseOnHover: true,
//     theme: "dark"
// };

// function HomePage() {
//     const [menu, setMenu] = useState([]);
//     const [cart, setCart] = useState({});

//     useEffect(() => {
//         fetchMenu();
//         fetchCart();
//     }, []);

//     const fetchMenu = async () => {
//         try {
//             const response = await axios.get(getFoodMenu);
//             if (response.data.status) {
//                 setMenu(response.data.menu);
//             } else {
//                 toast.error(response.data.msg || "Failed to fetch menu", toastOptions);
//             }
//         } catch (error) {
//             toast.error("Error fetching menu", toastOptions);
//         }
//     };

//     const fetchCart = async () => {
//         try {
//             const response = await axios.get(getCartItems);
//             if (response.data.status) {
//                 const cartObject = response.data.cart.reduce((acc, item) => {
//                     acc[item._id] = item.quantity;
//                     return acc;
//                 }, {});
//                 setCart(cartObject);
//             } else {
//                 toast.error(response.data.msg || "Failed to fetch cart", toastOptions);
//             }
//         } catch (error) {
//             toast.error("Error fetching cart", toastOptions);
//         }
//     };

//     const handleUpdateCart = async (itemId, action) => {
//         try {
//             const response = await axios.post(updateCartItem, { itemId, action });
//             if (response.data.status) {
//                 setCart(prevCart => ({
//                     ...prevCart,
//                     [itemId]: action === 'increase' 
//                         ? (prevCart[itemId] || 0) + 1 
//                         : Math.max((prevCart[itemId] || 0) - 1, 0)
//                 }));
//             } else {
//                 toast.error(response.data.msg || "Failed to update cart", toastOptions);
//             }
//         } catch (error) {
//             toast.error("Error updating cart", toastOptions);
//         }
//     };

//     const renderCuisines = () => (
//         <div className='cuisine-nav'>
//             {menu_list.map((cuisine) => (
//                 <div className='cuisine-div' key={cuisine.menu_name}>
//                     <img src={cuisine.menu_image} alt={cuisine.menu_name} />
//                     <p>{cuisine.menu_name}</p>
//                 </div>
//             ))}
//         </div>
//     );

//     const renderMenuItems = () => (
//         <div className='menu'>
//             {menu.map((item) => (
//                 <StyledCard key={item._id}>
//                     <Card.Img variant="top" src={foodImages.get(item.image)} />
//                     <Card.Body>
//                         <Card.Title>{item.name}</Card.Title>
//                         <Card.Text>{item.description}</Card.Text>
//                         <Card.Subtitle>${item.price}</Card.Subtitle>
//                         {cart[item._id] ? (
//                             <div className='item-update'>
//                                 <button onClick={() => handleUpdateCart(item._id, 'decrease')}>-</button>
//                                 <p>{cart[item._id]}</p>
//                                 <button onClick={() => handleUpdateCart(item._id, 'increase')}>+</button>
//                             </div>
//                         ) : (
//                             <button className='addToCart' onClick={() => handleUpdateCart(item._id, 'increase')}>
//                                 Add to Cart
//                             </button>
//                         )}
//                     </Card.Body>
//                 </StyledCard>
//             ))}
//         </div>
//     );

//     return (
//         <>
//             <Container>
//                 <Navbar />
//                 <div className='top-content'>
//                     <img src={BackgroundFood} alt="food-item" />
//                     <p className='heading line1'>Order your</p>
//                     <p className='heading line2'>favourite food here</p>
//                     <p className='description line1'>
//                         Choose from a diverse menu featuring a delectable array of dishes with the finest
//                     </p>
//                     <p className='description line2'>
//                         ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your
//                     </p>
//                     <p className='description line3'>
//                         dining experience, one delicious meal at a time.
//                     </p>
//                     <AnchorLink href="#menu">
//                         <button>View Menu</button>
//                     </AnchorLink>
//                 </div>
//                 <p style={{ marginTop: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>Explore Our Menu</p>
//                 <p style={{ marginTop: "1rem" }}>Choose from a diverse menu featuring a delectable array of dishes.</p>
//                 {renderCuisines()}
//                 <hr style={{ marginTop: "3rem" }} />
//                 <section id='menu'>
//                     {renderMenuItems()}
//                 </section>
//             </Container>
//             <ToastContainer />
//         </>
//     );
// }

// StyledCard and Container styled components remain unchanged





import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import styled from "styled-components";
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import AnchorLink from "react-anchor-link-smooth-scroll";
import BackgroundFood from "../utils/frontend_assets/header_img.png";
import {menu_list, foodImages} from '../utils/frontend_assets/assets';
import {getMenu, getMenuLength, getCartItems, increaseCartItem, decreaseCartItem} from '../utils/APIroutes';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const toastOptions =
{
    position: "bottom-right",
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    theme: "dark"
};


function HomePage()
{
    const navigate = useNavigate();
    const [itemsList, setItemsList] = useState([]); // Cart items with quantities
    const [menu, setMenu] = useState([]); // Food menu items
    const [user, setUser] = useState();
    // console.log('Hi');
    
    useEffect(() => {
        const foodUser = JSON.parse(localStorage.getItem('food-app-user'));
        if(!foodUser)
        {
            navigate('/login');
        }
        // console.log("This was ran first");
        setUser(foodUser);
        const fetchMenu = async () => {
            try
            {
                const {data} = await axios(getMenu);
                if(data.status)
                {
                    setMenu(data.menu);
                }
                else
                {
                    toast.error(`${data.msg}`, toastOptions);
                }
            }
            catch(error)
            {
                toast.error("Failed to load menu", toastOptions);
            }
        };
        fetchMenu();
        initializeList(foodUser);
        // console.log(itemsList);
        // const user = JSON.parse(localStorage.getItem("food-app-user"));
        // if(user)
        // {
            Cookies.set("username", foodUser.username, {expires: 7}); // Expires in 7 days
            Cookies.set("email", foodUser.email, {expires: 7});
            Cookies.set("userId", foodUser.userId, {expires: 7});
        // }
    }, [navigate]);

    // Fetch the cart items and initialize state
    async function initializeList(foodUser)
    {
        try
        {
            // console.log(foodUser);
            const {userId} = foodUser;
            // console.log(`${getCartItems}/${userId}`);
            const {data} = await axios(`${getCartItems}/${userId}`);
            if(data.status)
            {
                const {cart} = data;
                // console.log(cart);
                const {data: {length}} = await axios(getMenuLength);
                // console.log(length);
                let index = 0;
                const arr = [];
                for(let i = 0; i < length; ++i)
                {
                    arr.push({
                        _id: i+1,
                        quantity: 0
                    });
                    if(index < cart.length && Number(cart[index]._id) === i+1)
                    {
                        arr[i] = {...arr[i], quantity: cart[index++].quantity};
                    }
                }
                // console.log(arr);
                setItemsList(arr);
            }
            else
            {
                toast.error(`${data.msg}`, toastOptions);
            }
        }
        catch(error)
        {
            toast.error("Failed to load cart items", toastOptions);
        }
    }

    // Fetch food menu from the backend
    // useEffect(() => {
        
    // }, []);

    // Function to increase quantity of an item
    async function increaseQuantity(_id)
    {
        try
        {            
            const {userId} = user;
            // console.log(`${increaseCartItem}/${_id}/${userId}`);
            const {data} = await axios.patch(`${increaseCartItem}/${_id}/${userId}`, {quantity: itemsList[_id - 1].quantity});
            // console.log(data);
            if(data.status)
            {
                // const updatedItemsList = itemsList.map(item => item._id === _id ? {...item, quantity: item.quantity + 1} : item);
                initializeList(user);
                // setItemsList(updatedItemsList);
            }
            else
            {
                toast.error(`${data.msg}`, toastOptions);
            }
        }
        catch(error)
        {
            toast.error("Error increasing quantity", toastOptions);
        }
    }

    // Function to decrease quantity of an item
    async function decreaseQuantity(_id)
    {
        try
        {
            const {userId} = user;
            const {data} = await axios.patch(`${decreaseCartItem}/${_id}/${userId}`, {quantity: itemsList[_id - 1].quantity});
            if(data.status)
            {
                // const updatedItemsList = itemsList.map(item =>item._id === _id ? { ...item, quantity: item.quantity - 1 } : item);
                initializeList(user);
                // setItemsList(updatedItemsList);
            }
            else
            {
                toast.error(`${data.msg}`, toastOptions);
            }
        }
        catch(error)
        {
            toast.error("Error decreasing quantity", toastOptions);
        }
    }

    // Display each cuisine type
    function displayCuisine()
    {
        return menu_list.map((cuisine) => (
            <div className='cuisine-div' key={cuisine.menu_name}>
                <img src={cuisine.menu_image} alt={cuisine.menu_name} />
                <p>{cuisine.menu_name}</p>
            </div>
        ));
    }

    // Display food menu with Add/Increase/Decrease buttons
    const menuContainer = menu.map((item) => {
        let _id = Number(item._id);
        const cartItem = itemsList.find(i => i._id === _id); // Find item in cart

        return (
            <StyledCard key={_id}>
                <Card.Img variant="top" src={foodImages.get(item.image)} />
                <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Subtitle>${item.price}</Card.Subtitle>
                    {cartItem && cartItem.quantity > 0 ? (
                        <div className='item-update'>
                            <button className='plus' onClick={() => increaseQuantity(_id)}>+</button>
                            <p>{cartItem.quantity}</p>
                            <button className='minus' onClick={() => decreaseQuantity(_id)}>-</button>
                        </div>
                    ) : (
                        <button className='addToCart' onClick={() => increaseQuantity(_id)}>Add to Cart</button>
                    )}
                </Card.Body>
            </StyledCard>
        );
    });

    return (
        <>
            <Container>
                <Navbar />
                {itemsList && (
                    <>
                        <div className='top-content'>
                            <img src={BackgroundFood} alt="food-item" />
                            <p className='heading line1'>Order your</p>
                            <p className='heading line2'>favourite food here</p>
                            <p className='description line1'>
                                Choose from a diverse menu featuring a delectable array of dishes with the finest
                            </p>
                            <p className='description line2'>
                                ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your
                            </p>
                            <p className='description line3'>
                                dining experience, one delicious meal at a time.
                            </p>
                            <AnchorLink href="#menu">
                                <button>View Menu</button>
                            </AnchorLink>
                        </div>
                        <p style={{ marginTop: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>Explore Our Menu</p>
                        <p style={{ marginTop: "1rem" }}>Choose from a diverse menu featuring a delectable array of dishes.</p>
                        <div className='cuisine-nav'>{displayCuisine()}</div>
                        <hr style={{ marginTop: "3rem" }} />
                        <section id='menu' className='menu'>
                            {menuContainer}
                        </section>
                    </>
                )}
            </Container>
            <ToastContainer/>
        </>
    );
}

// function HomePage()
// {
//     // console.log(foodImages);
    
//     // () => initializeList()
//     const [itemsList, setItemsList] = useState([]);
//     const [menu, setMenu] = useState([]);

//     async function initializeList()
//     {
//         const {data} = await axios(getCartItems);
//         // console.log(data);
//         if(data.status)
//         {
//             setItemsList(data.cart)
//         }
//         else
//         {
//             toast.error(`${data.msg}`, toastOptions);
//         }
//         // console.log(data.cart);
//         // setItemsList(data.cart);
//         // console.log(itemsList);
//     }

//     // async function initializeList()
//     // {
//     //     const {data} = await axios(getCartItems);
//     //     console.log(data.cart);
//     //     return data.cart
//     //     // if(cart.status)
//     //     // {
//     //     //     // setMenu(data.menu);
//     //     // }
//     //     // else
//     //     // {
//     //     //     toast.error(`${cart.msg}`, toastOptions);
//     //     // }
//     //     // console.log(cart);
//     //     // const arr = [];
//     //     // for(let i = 0; i < 32; ++i)
//     //     // {
//     //     //     arr.push({
//     //     //         _id: i+1,
//     //     //         quantity: 0 
//     //     //     })
//     //     // }
//     //     // return arr;
//     // }

//     useEffect(() => {
//         const fetchMenu = async () => {
//             const {data} = await axios(getFoodMenu);
//             if(data.status)
//             {
//                 setMenu(data.menu);
//             }
//             else
//             {
//                 toast.error(`${data.msg}`, toastOptions);
//             }
//         };
//         fetchMenu();
//         const setUpInitialList = async () => {
//             const {data} = await axios(getMenuLength);
//             // console.log(data.cart);
//             const arr = [];
//             console.log(data.length);
//             for(let i = 0; i < data.length; ++i)
//             {
//                 arr.push({
//                     _id: i+1,
//                     quantity: 0
//                 });
//             }
//             setItemsList(arr);
//         };
//         setUpInitialList();
//     }, []);

//     function displayCuisine()
//     {
//         return menu_list.map((cuisine) => {
//             return <div className='cuisine-div'>
//                 <img src={cuisine.menu_image} alt={cuisine.menu_name}/>
//                 <p>{cuisine.menu_name}</p>
//             </div>
//         });
//     }

//     async function increaseQuantity(_id)
//     {
//         try {
//             // First, make the API call to update the database
//             const response = await axios.patch(`${increaseCartItem}/${_id}`, { quantity: itemsList[_id-1].quantity + 1 });
    
//             if (response.data.status) { // Assuming the response has a `status` field to check success
//                 // If the database was updated successfully, update the local state
//                 const updatedItemsList = itemsList.map(item =>
//                     item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
//                 );
//                 setItemsList(updatedItemsList); // Update the state locally
//             } else {
//                 toast.error(`${response.data.msg}`, toastOptions);
//             }
//         } catch (error) {
//             toast.error("Error updating quantity", toastOptions);
//         }



//         // console.log(itemsList[_id-1].quantity);
//         // const cartItem = await axios.patch(`${updateCartItem}/${_id}`, {quantity: itemsList[_id-1].quantity + 1});

//         // const cartItem = await axios.patch(`${increaseCartItem}/${_id}`, {quantity: itemsList[_id-1].quantity + 1});
//         // const updatedItemsList = itemsList.map(item => 
//         //     item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
//         // );
//         // setItemsList(updatedItemsList);

//         // initializeList();

//         // initializeList();
//         // const arr = [...itemsList];
//         // arr[_id-1].quantity++;
//         // console.log(arr);
//         // setItemsList(arr);

//         // const arr = [];
//         // itemsList.forEach((item) => {
//         //     if(item._id === _id)
//         //     {
//         //         console.log(_id);
//         //         arr.push({...item, quantity: item.quantity + 1});
//         //     }
//         //     else arr.push(item);
//         // })
//         // // console.log(arr);
//         // setItemsList(arr);
//         // // console.log(_id);
//     }

//     async function decreaseQuantity(_id)
//     {
//         try {
//             // First, make the API call to update the database
//             const response = await axios.patch(`${decreaseCartItem}/${_id}`, { quantity: itemsList[_id-1].quantity - 1 });
    
//             if (response.data.status) { // Assuming the response has a `status` field to check success
//                 // If the database was updated successfully, update the local state
//                 const updatedItemsList = itemsList.map(item =>
//                     item._id === _id ? { ...item, quantity: item.quantity - 1 } : item
//                 );
//                 setItemsList(updatedItemsList); // Update the state locally
//             } else {
//                 toast.error(`${response.data.msg}`, toastOptions);
//             }
//         } catch (error) {
//             toast.error("Error updating quantity", toastOptions);
//         }



//         // console.log(itemsList[_id-1].quantity);
//         // const cartItem = await axios.patch(`${updateCartItem}/${_id}`, {quantity: itemsList[_id-1].quantity - 1});

//         // const cartItem = await axios.patch(`${decreaseCartItem}/${_id}`, {quantity: itemsList[_id-1].quantity - 1});
//         // const updatedItemsList = itemsList.map(item => 
//         //     item._id === _id ? { ...item, quantity: item.quantity - 1 } : item
//         // );
//         // setItemsList(updatedItemsList);

//         // initializeList();

//         // initializeList();
//         // const arr = [...itemsList];
//         // arr[_id-1].quantity--;
//         // // console.log(arr);
//         // setItemsList(arr);
//     }

//     const menuContainer = menu.map((item) => {
//         // console.log(item);
//         // console.log(itemsList[item._id-1]);
//         let _id = Number(item._id);
//         // Check if itemsList is populated and contains the item with _id
//         const cartItem = itemsList[_id-1];

//         return <StyledCard key={_id}>
//             <Card.Img variant="top" src={foodImages.get(item.image)}/>
//             <Card.Body>
//                 <Card.Title>{item.name}</Card.Title>
//                 <Card.Text>{item.description}</Card.Text>
//                 <Card.Subtitle>${item.price}</Card.Subtitle>
//                 {cartItem && cartItem.quantity === 0 ? <button className='addToCart' onClick={() => increaseQuantity(_id)}>Add to Cart</button> : (cartItem && 
//                     (
//                         <div className='item-update'>
//                             <button className='plus' onClick={() => increaseQuantity(_id)}>+</button>
//                             <p>{itemsList[_id-1].quantity}</p>
//                             <button className='minus' onClick={() => decreaseQuantity(_id)}>-</button>
//                         </div>
//                     )
//                 )
//             }
//             </Card.Body>
//         </StyledCard>
//     });

//     return (
//         <>
//             <Container>
//                 <Navbar/>
//                 {itemsList && 
//                     <>
//                         <div className='top-content'>
//                             <img src={BackgroundFood} alt="food-item"/>
//                             <p className='heading line1'>Order your</p>
//                             <p className='heading line2'>favourite food here</p>
//                             <p className='description line1'>Choose from a diverse menu featuring a delectable array of dishes with the finest</p>
//                             <p className='description line2'>ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your</p>
//                             <p className='description line3'>dining experience, one delicious meal at a time.</p>
//                             <AnchorLink href="#menu">
//                                 <button>View Menu</button>
//                             </AnchorLink>
//                         </div>
//                         <p style={{marginTop: "2rem", fontSize: "1.5rem", fontWeight: "bold"}}>Explore Our Menu</p>
//                         <p style={{marginTop: "1rem"}}>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your</p>
//                         <p>cravings and elevate your dining experience, one delicious meal at a time.</p>
//                         <div className='cuisine-nav'>
//                             {displayCuisine()}
//                         </div>
//                         <hr style={{marginTop: "3rem"}}/>
//                         <section id='menu' className='menu'>
//                             {menuContainer}
//                         </section>
//                     </>
//                 }
//             </Container>
//             <ToastContainer/>
//         </>
//     );
// }

const StyledCard = styled(Card)`
    width: 18rem;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    &:hover
    {
        transform: translateY(-10px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    }
    img
    {
        width: 100%;
        height: 12rem;
        object-fit: cover;
    }
    .card-body
    {
        padding: 1rem;
        text-align: left;
        .card-title
        {
            font-size: 1.25rem;
            font-weight: bold;
        }
        .card-text
        {
            font-size: 1rem;
            color: #555;
            margin: 0.5rem 0;
        }
        .card-subtitle
        {
            margin-bottom: 1rem;
            /* margin-top: auto; */
            font-size: 1.2rem;
            font-weight: bold;
            color: #ff6b6b;
        }
        .addToCart
        {
            padding: 0.5rem;
            /* padding-left: auto; */
            /* margin: 0 auto 0 auto; */
            /* margin-left: auto; */
            width: 60%;
            cursor: pointer;
        }
    }
    .item-update
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* margin-top: auto; */
        button
        {
            height: 2rem;
            width: 2rem;
            border-radius: 1rem;
            cursor: pointer;
            /* .plus
            {
                color: #fd7575;
            } */
        }
    }
`;

const Container = styled.div`
    height: 100vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* align-items: center; */
    /* margin-left: 9rem; */
    margin: 0 10vw 0 10vw;
    /* background-color: pink; */
    /* overflow: auto; */
    .top-content
    {
        color: white;
        margin-top: 1rem;
        position: relative;
        text-align: center;
        img
        {
            width: 100%;
        }
        .heading
        {
            font-weight: bold;
            font-size: 4rem;
            position: absolute;
            left: 5rem;
            &.line1
            {
                top: 9rem;
            }
            &.line2
            {
                top: 14rem;
            }
        }
        .description
        {
            position: absolute;
            left: 5rem;
            &.line1
            {
                top: 21rem;
            }
            &.line2
            {
                top: 22rem;
            }
            &.line3
            {
                top: 23rem;
            }
        }
        button
        {
            position: absolute;
            left: 5rem;
            top: 25rem;
            /* padding: 1rem; */
            padding: 1rem 2rem 1rem 2rem;
            border-radius: 5rem;
            border: none;
            cursor: pointer;
            &:hover
            {
                background-color: #dcdcdc;
            }
        }
    }
    .cuisine-nav
    {
        /* background-color: rebeccapurple; */
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        .cuisine-div
        {
            font-size: 1.2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 0.7rem;
            width: 100%;
            img
            {
                border: 1px solid transparent;
                width: 6rem;
                cursor: pointer;
                border-radius: 50%;
                transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                &:hover
                {
                    transform: scale(1.1); /* Scale up the image slightly */
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* Add shadow effect */
                }
            }
        }
    }
    .menu
    {
        display: grid;
        grid-template-columns: auto auto auto auto;
        row-gap: 1rem;
    }
`;

export default HomePage;
