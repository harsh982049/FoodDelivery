import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from 'axios';
import upload_area from "../utils/admin_assets/upload_area.png";
import {addToMenu} from '../utils/APIroutes';
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

const categories = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];
const initialState = {
	productName: "",
	productDescription: "",
	productCategory: "Noodles",
	productPrice: '',
	productImage: ''
};

function AddToMenu()
{
	const [formData, setFormData] = useState(initialState);	

    const handleInputChange = (e) => {
        let {name, value} = e.target;
		if(name === 'productPrice') value = Number(value);
        setFormData({...formData, [name]: value});
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
		// const response = await fetch(file);
		// const blob = await response.blob(); // Get the image as a Blob
        const base64 = await convertToBase64(file);
        setFormData({...formData, productImage: base64});
    };

    const validateForm = () => {
        const {productImage} = formData;
        if (!productImage) {
            toast.error("Image of food item is required", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
		if(validateForm())
        {
            const {data: {status, msg}} = await axios.post(addToMenu, formData);
            if(status)
            {
                toast.success(`${msg}`, toastOptions);
                setFormData(initialState);
            }
            else toast.error(`${msg}`, toastOptions);
        }
    };

	async function convertToBase64(file)
	{
		const fileReader = new FileReader();
		return new Promise((resolve, reject) => {
			fileReader.onloadend = () => resolve(fileReader.result);
			fileReader.onerror = (error) => reject(error);
			fileReader.readAsDataURL(file);  // This works with Blob
		});
	}

	const productCategories = categories.map((category) => {
		return <option key={category} value={category}>{category}</option>
	});

    return (
      	<Container>
			<Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Upload image</Label>
                    <ImageContainer>
						<input
							type="file"
							id="imageInput"
							style={{display: "none"}}
							accept="image/*"
							onChange={(e) => handleImageChange(e)}
						/>
						<ImageUpload htmlFor="imageInput">
							{formData.productImage ? (
								<PreviewImage src={formData.productImage} alt="Preview"/>
							) : (
								<UploadIcon src={upload_area} alt="Upload"/>
							)}
						</ImageUpload>
					</ImageContainer>
                </FormGroup>

                <FormGroup>
                    <Label>Product name</Label>
                    <Input
                        type="text"
                        name="productName"
                        placeholder="Type here"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Product description</Label>
                    <TextArea
                        name="productDescription"
                        placeholder="Write content here"
                        value={formData.productDescription}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>

                <FormGroupRow>
                    <FormGroup>
                        <Label>Product category</Label>
                        <Select
                            name="productCategory"
                            value={formData.productCategory}
                            onChange={handleInputChange}
                            required
                        >
                            {productCategories}
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Product Price</Label>
                        <Input
                            type="number"
                            name="productPrice"
                            placeholder="$25"
                            value={formData.productPrice}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                </FormGroupRow>

                <SubmitButton type="submit">ADD</SubmitButton>
            </Form>
            <ToastContainer/>
		</Container>
    )
}

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
    flex-direction: column;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 80%;
    /* max-width: 700px; */
    background-color: white;
    padding: 2rem;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const FormGroupRow = styled.div`
    display: flex;
    /* justify-content: space-between; */
    gap: 1.5rem;
`;

const Label = styled.label`
    font-size: 1rem;
    font-weight: 500;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
`;

const TextArea = styled.textarea`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    min-height: 100px;
`;

const Select = styled.select`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
	cursor: pointer;
`;


const ImageContainer = styled.div`
    /* margin-bottom: 1rem; */
`;

const ImageUpload = styled.label`
    cursor: pointer;
    display: inline-block;
`;

const UploadIcon = styled.img`
    width: 7rem;
    /* height: 100px; */
    object-fit: cover;
`;

const PreviewImage = styled.img`
    width: 7rem;
    object-fit: cover;
`;

const SubmitButton = styled.button`
	width: 8rem;
    padding: 0.75rem;
    background-color: black;
    color: white;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #333;
    }
`;

export default AddToMenu;