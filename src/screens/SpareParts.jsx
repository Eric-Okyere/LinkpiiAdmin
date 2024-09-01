import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';

const SpareParts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // New state for product count
  const [deleteId, setDeleteId] = useState(null); // State for tracking delete confirmation

  const myStyle = "font-bold font-uniquifier mx-4 text-gray-700 dark:text-gray-400 font-bold text-lg";

  const apiGet = () => {
    fetch(`${baseURL}sparepartsmainpost`)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setProductFilter(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}sparepartsmainpost/get/count`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      setProductCount(productCount); // Set the count in the state
    } catch (error) {
      console.error('Error fetching product count:', error.message);
    }
  };

  useEffect(() => {
    apiGet();
    fetchProductCount();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id) => {
    // Set the id of the item to be deleted
    setDeleteId(id);
  };

  const confirmDelete = () => {
    // Perform the deletion
    axios.delete(`${baseURL}sparepartsmainpost/${deleteId}`)
      .then((res) => {
        // Filter out the deleted item from the product list
        const updatedProducts = productFilter.filter((item) => item.id !== deleteId);
        setProductCount(productCount - 1);
        setProductFilter(updatedProducts);
        // Reset the deleteId state after deletion
        setDeleteId(null);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateApproval = async (id) => {
    try {
      const response = await axios.put(`${baseURL}sparepartsmainpost/${id}/approve`);
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === id) {
            return { ...product, approved: true };
          }
          return product;
        });
      });

      console.log('Product approval updated:', updatedProduct);
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };

  return (
    <div>
      <div className='flex justify-between mx-8 pt-16'>
        <h1 className='font-bold'>ALL PRODUCTS</h1>
        <h2 className=' bg-[#f2f2f2] rounded-lg p-4 font-'>Total Products: {productCount}</h2>
      </div>
      <div className="flex flex-wrap justify-around ">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <BeatLoader color={'#36D7B7'} loading={loading} />
          </div>
        ) : (
          productFilter.map((item) => (
            <Card className="max-w-sm m-4 flex flex-col bg-[#f2f2f2]" key={item.id}>
              <img width={500} height={500} src={item.picture} alt="image 1" />
              <img width={500} height={500} src={item.picturesec} alt="image 1" />
              <h5 className={`${myStyle}, text-2xl`}>
                {item.name}
              </h5>
              <h3 className={myStyle}> View:{item.views}</h3>
              <h3 className={myStyle}> Gh₵{item.price}</h3>
              <h3 className={myStyle}>{item.description}</h3>
              <h3 className={myStyle}>{item.region}</h3>
              <h3 className={myStyle}>{item.town}</h3>
              <h3 className={myStyle}>Phone:{item.phone}</h3>
              <h3 className={myStyle}>Whatsapp:{item.whatsapp}</h3>
              <h3 className={myStyle}>{item.location}</h3>
              <h3 className={myStyle}>{item.author.name}</h3>
              <h3 className={myStyle}>
                {formatDate(item.dateCreated)}
              </h3>

              <div className="mt-4 space-y-4">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 font-uniquifier w-full text-white p-2 rounded"
                >
                  Delete
                </button>

                {!item.approved && (
                  <button
                    onClick={() => handleUpdateApproval(item.id)}
                    className="bg-green-500 font-uniquifier w-full text-white p-2 rounded"
                  >
                    Approve
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-between mt-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Confirm</button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpareParts;
