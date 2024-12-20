import React, {useEffect} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import {useFormik} from "formik";
import {loginSchema} from "../schema/index";
import {adminLoginRoute} from '../utils/APIroutes';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Cookies from 'js-cookie';

const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    draggable: true,
    pauseOnHover: true,
    theme: "dark"
};

function Login()
{
    const navigate = useNavigate();

    const onSubmit = async (values, actions) => {
        // event.preventDefault();
        // console.log(values);
        // console.log(actions);
        const {username: adminName, password} = values;
        // const token = Cookies.get(adminName);
        // console.log(token);
        // if(!token)
        // {
        //     toast.error('No token provided', toastOptions);
        //     return;
        // }
        // {headers: {'Authorization': `Bearer ${token}`}}
        const {data} = await axios.post(adminLoginRoute, {adminName, password});
        if(data.status)
        {
            // const {token} = data.admin;
            // Cookies.set(adminName, token);
            localStorage.setItem('food-app-admin', JSON.stringify(data.admin));
            navigate('/admin');
        }
        else
        {
            toast.error(`${data.msg}`, toastOptions);
        }
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // actions.resetForm();
    };

    const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit,
      });

    useEffect(() => {
        if(localStorage.getItem('food-app-admin'))
        {
            navigate('/admin');
        }
    }, [navigate]);

    const handleUserLogin = () => {
        navigate('/login');
    };
    
    return (
        <>
            <Container>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h1>Admin Login</h1>
                    <label htmlFor="username">Username:</label>
                    <input
                        value={values.username}
                        onChange={handleChange}
                        id="username"
                        type="username"
                        placeholder="Enter your username"
                        onBlur={handleBlur}
                        className={errors.username && touched.username ? "input-error" : ""}
                    />
                    {errors.email && touched.email && <p className="error">{errors.email}</p>}
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password && touched.password ? "input-error" : ""}
                    />
                    {errors.password && touched.password && (<p className="error">{errors.password}</p>)}
                    <div className='buttons'>
                        <button disabled={isSubmitting} type="submit" className='submit-btn'>Submit</button>
                        <button className='register-btn' onClick={handleUserLogin}>User Login</button>
                    </div>
                </form>
            </Container>
            <ToastContainer/>
        </>
      );
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    /* background-color: #131324; */
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    color: white;
    background-image: url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
    background-size: cover;

    form
    {
        padding: 1rem;
        background-color: #4e4e4e;
        /* width: 95%; */
        /* gap: 1rem; */
        width: 40%;
        min-width: 20rem;
        margin: 0 auto;
        margin-top: 10rem;
        border: 1px solid lightgreen;
        border-radius: 0.4rem;
    }

    form label
    {
        font-size: 1rem;
        font-weight: bold;
        display: block;
        text-align: left;
        margin: 1rem 0 0.2rem;
    }

    input
    {
        background-color: black;
        width: 100%;
        padding: 0.65rem 0.5rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: white;
        border: 2px solid #4a5568;
        /* background-color: #2d3748; */
        border-radius: 10px;
        outline: none;
        &:focus
        {
            border-color: #4299e1;
        }
        &:placeholder
        {
            color: #a0aec0;
        }
    }

    .buttons
    {
        display: flex;
        gap: 1rem;

        button
        {
            /* display: block; */
            /* margin: 1rem 0; */
            margin-top: 1rem;
            padding: 0.7rem;
            /* padding: 0.35rem 0.5rem; */
            background-color: #4299e1;
            color: #1a202c;
            border: none;
            border-radius: 0.3rem;
            /* border-radius: 3px; */
            width: 5rem;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;

            &:disabled
            {
                opacity: 0.35;
            }
        }

        .submit-btn
        {
            background-color: #33d659;
            &:hover
            {
                background-color: #2bb24a;
            }
        }

        .register-btn
        {
            background-color: #f13a4c;
            color: white;
            width: 6rem;
            &:hover
            {
                background-color: #cf3141;
            }
        }
    }

    .input-error
    {
        border-color: #fc8181;
    }

    .error
    {
        color: #fc8181;
        font-size: 0.75rem;
        text-align: left;
        /* margin-top: 0.25rem; */
    }
`;

export default Login;