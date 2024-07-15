import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import { Link } from 'react-router-dom';
import baseURL from '../assets/baseURL';

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // New state for product count
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
  const [deleteId, setDeleteId] = useState(null); // State to store the ID of the item to be deleted
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [showBoostConfirmation, setShowBoostConfirmation] = useState(false);
  const [approveId, setApproveId] = useState(null);

  const myStyle = "font-bold font-uniquifier mx-4 text-gray-700 dark:text-gray-400 font-bold text-lg";

  const apiGet = () => {
    fetch(`${baseURL}send`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
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
      const response = await fetch(`${baseURL}send/get/count`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      console.log('Product Count:', productCount);
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
    // Show delete confirmation popup
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(
      `${baseURL}send/${deleteId}`,
    )
      .then((res) => {
        const products = productFilter.filter((item) => item.id !== deleteId);
        setProductFilter(products);
        // Hide delete confirmation popup after deletion
        setShowDeleteConfirmation(false);
      })
      .catch((error) => console.log(error));
  };

// approve

const handleUpdateApproval = async (id) => {
  setShowApproveConfirmation(true);
  setApproveId(id);
};


const confirmApprove = () => {
  axios.put(`${baseURL}send/${approveId}/approve`)
    .then((response) => {
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === approveId) {
            return { ...product, approved: true };
          }
          return product;
        });
      });

      console.log('Product approval updated:', updatedProduct);
      setShowApproveConfirmation(false);
    })
    .catch((error) => {
      console.error('Error updating product approval:', error);
    });
};

const handleUpdateboost = async (id) => {
  setShowBoostConfirmation(true);
  setApproveId(id);
};


const confirmBoost = () => {
  axios.put(`${baseURL}send/${approveId}/boost`)
    .then((response) => {
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === approveId) {
            return { ...product, boost: true };
          }
          return product;
        });
      });

      console.log('Product approval updated:', updatedProduct);
      setShowBoostConfirmation(false);
    })
    .catch((error) => {
      console.error('Error updating product approval:', error);
    });
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
              <h5 className={`${myStyle}, text-2xl`}>
                {item.name}
              </h5>
              <h3 className={myStyle}> Gh₵{item.price}</h3>
              <h3 className={myStyle}>{item.description}</h3>
              <h3 className={myStyle}>{item.region}</h3>
              <h3 className={myStyle}>{item.town}</h3>
              <h3 className={myStyle}>{item.location}</h3>
              <h3 className={myStyle}>phone:{item.phone}</h3>
              <h3 className={myStyle}>whatsapp:{item.whatsapp}</h3>
              <h3 className={myStyle}>View:{item.views}</h3>
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
                {!item.boost && (
                  <button
                    onClick={() => handleUpdateboost(item.id)}
                    className="bg-blue-500 font-uniquifier w-full text-white p-2 rounded"
                  >
                     Boost
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

{/* approve popup */}
      {showApproveConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to approve this product?</p>
            <div className="flex justify-center mt-4">
              <button onClick={confirmApprove} className="bg-green-500 text-white px-4 py-2 mr-4 rounded">Yes</button>
              <button onClick={() => setShowApproveConfirmation(false)} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-center mt-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 mr-4 rounded">Yes</button>
              <button onClick={() => setShowDeleteConfirmation(false)} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
      {showBoostConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to boost this product?</p>
            <div className="flex justify-center mt-4">
              <button onClick={confirmBoost} className="bg-red-500 text-white px-4 py-2 mr-4 rounded">Yes</button>
              <button onClick={() => setShowBoostConfirmation(false)} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
