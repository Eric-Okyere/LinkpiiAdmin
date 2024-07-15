import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import baseURL from '../../assets/baseURL';
import axios from 'axios';

const Okada = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // New state for product count



  const apiGet = () => {
    fetch(`${baseURL}okada`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      });
  };


  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}okada/get/countokada`);
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

  const myStylesh1 = 'font-bold font-mono';
  const Spanstyle = 'text-black  font-serif';



  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this bike?');

    if (isConfirmed) {
      axios.delete(`${baseURL}okada/${id}`)
        .then((res) => {
          const products = productFilter.filter((item) => item.id !== id);
          setProductFilter(products);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleUpdateApproval = async (_id) => {
    const isConfirmed = window.confirm('Are you sure you want to approve this bike?');
    if (isConfirmed) {
      try {
        const response = await axios.put(`${baseURL}okada/${_id}/approveokada`);
        const updatedProduct = response.data;
        console.log('Product approval updated:', updatedProduct);
      } catch (error) {
        console.error('Error updating product approval:', error);
      }
    }
  };
  
  const handleDeactivate = async (_id) => {
    const isConfirmed = window.confirm('Are you sure you want to deactivate this bike?');
    if (isConfirmed) {
      try {
        const response = await axios.put(`${baseURL}okada/${_id}/deactivateokada`);
        const updatedProduct = response.data;
        console.log('Product approval updated:', updatedProduct);
      } catch (error) {
        console.error('Error updating product approval:', error);
      }
    }
  };



  return (
    <div>
      <div className='pt-20'>
      <div className='flex justify-between mx-8 mb-2 '>
     <h1 className='font-bold font-uniquifier '>TOTAL DRIVERS</h1>
      <h2 className=' bg-[#f2f2f2] rounded-lg p-4 font-uniquifier font-bold'>Total Cars: {productCount}</h2>
      </div>


      </div>
      {loading ? (
      <div className="flex items-center justify-center w-full h-full">
      <BeatLoader color={'#36D7B7'} loading={loading} />
    </div>
      ) : (
        // Display the fetched data
        data.map((item) => (
         <>
          
          <div key={item._id} className='bg-[#f2f2f2] drop-shadow-2xl mb-10 mr-10 ml-10'>
            <div className='p-5 md:flex'>
              <div className='mt-10 p-5 md:flex'>
                <div className='flex justify-center'>
                  <img src={item.driverpic} className='w-80 h-52 rounded-lg mr-5 mb-5' alt='image' />
                </div>
                <div className='flex justify-center'>
                  <img src={item.carpic} className='w-80 mb-5 h-52 rounded-lg mr-5' alt='image' />
                </div>
                <div className='justify-center items-center'>
                  <h1 className={myStylesh1}>
                    Views: <span className={Spanstyle}>{item.view}</span>
                  </h1>
                  <h1 className={myStylesh1}>
                    Name: <span className={Spanstyle}>{item.name}</span>
                  </h1>
                 
                  <h1 className={myStylesh1}>
                    Phone: <span className={Spanstyle}>{item.phone}</span>
                  </h1>
                  <h1 className={myStylesh1}>
                    CarNumber: <span className={Spanstyle}>{item.carnum}</span>
                  </h1>
                  <h1 className={myStylesh1}>
                    License: <span className={Spanstyle}>{item.card}</span>
                  </h1>
                  <h1 className={myStylesh1}>
                    Region: <span className={Spanstyle}>{item.region}</span>
                  </h1>
                  <h1 className={myStylesh1}>
                    Town: <span className={Spanstyle}>{item.town}</span>
                  </h1>
                  
                  <h1 className={myStylesh1}>
                    Date: <span className={Spanstyle}>{formatDate(item.dateCreated)}</span>
                  </h1>
                  
                </div>
                
              </div>
            
            </div>
            
            <div className="mt-4 flex space-x-16">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 font-uniquifier w-full text-white p-2 rounded"
                >
                  Delete
                </button>

                {!item.approved && (
                  <button
                    onClick={() => handleUpdateApproval(item._id)}
                    className="bg-green-500 font-uniquifier w-full text-white p-2 rounded"
                  >
                    Approve
                  </button>
                )}
                 {item.approved && !item.deactivate && (
    <button
      onClick={() => handleDeactivate(item._id)}
      className="bg-black font-uniquifier w-full text-white p-2 rounded"
    >
      Deactivate
    </button>
  )}
              </div>

          </div>
          </> 
        ))
      )}
    </div>
  );
};

export default Okada;
