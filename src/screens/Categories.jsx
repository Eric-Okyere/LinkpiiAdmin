import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Categories() {
    const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);

    useEffect(() => {
        const fetchCategoriesWithProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/categories');
                setCategoriesWithProducts(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCategoriesWithProducts();
    }, []);

    return (
        
            <div>
                {categoriesWithProducts.map(categoryWithProducts => (
                    <div key={categoryWithProducts?.category?._id}>
                        <h2>{categoryWithProducts?.category?.name}</h2>
                        <ul>
                            {categoryWithProducts?.products?.map(product => (
                                <li key={product?._id}>{product?.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
    );
}

export default Categories;
