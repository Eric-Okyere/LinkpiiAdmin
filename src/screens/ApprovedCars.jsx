import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';

const ApprovedCars = () => {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}send/car/approved`);
        setApprovedProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approved products:', error);
        setLoading(false);
      }
    };

    fetchApprovedProducts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const myStylesh1 = 'font-bold font-mono';
  const Spanstyle = 'text-black  font-serif';




  return (
    <div>
    <div className='pt-20'>
   


    </div>
    {loading ? (
    <div className="flex items-center justify-center w-full h-full">
    <BeatLoader color={'#36D7B7'} loading={loading} />
  </div>
    ) : (
      // Display the fetched data
      approvedProducts.map((item) => (
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
                  Name: <span className={Spanstyle}>{item.name}</span>
                </h1>
                <h1 className={myStylesh1}>
                  Size: <span className={Spanstyle}>{item.size}</span>
                </h1>
               
                <h1 className={myStylesh1}>
                  Phone: <span className={Spanstyle}>{item.phone}</span>
                </h1>
                <h1 className={myStylesh1}>
                  Description: <span className={Spanstyle}>{item.description}</span>
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
        

        </div>
        </> 
      ))
    )}
  </div>
  );
};

export default ApprovedCars;
