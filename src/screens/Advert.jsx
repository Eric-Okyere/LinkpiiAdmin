// Import React, useState, useEffect, and other necessary components
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import baseURL from '../assets/baseURL';
import axios from 'axios'; // Import Axios for HTTP requests
import { BeatLoader } from 'react-spinners';
import { Card } from 'flowbite-react';

const Advert = () => {
  const [advertImages, setAdvertImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
  
  // Define your styles or classNames here
  const myStyle = "font-bold font-uniquifier mx-4 text-gray-700 dark:text-gray-400 font-bold text-lg";


  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchAdvertImages = async () => {
      try {
        const response = await fetch(`${baseURL}advert`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAdvertImages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching advert images:', error.message);
        setLoading(false);
      }
    };

    const fetchProductCount = async () => {
      try {
        const response = await fetch(`${baseURL}advert/count`);
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

    fetchAdvertImages();
    fetchProductCount();
  }, []);

  const handleDelete = (id) => {
    // Show delete confirmation popup
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(`${baseURL}advert/${deleteId}`)
      .then((res) => {
        const updatedImages = advertImages.filter((image) => image._id !== deleteId);
        setProductCount(productCount - 1);
        setAdvertImages(updatedImages);
        // Hide delete confirmation popup after deletion
        setShowDeleteConfirmation(false);
      })
      .catch((error) => console.log(error));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-screen-lg mx-auto pt-16 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <BeatLoader color={'#36D7B7'} loading={loading} />
        </div>
      ) : (
        <div >
        
        <Slider {...settings}>
            {advertImages.map((image, index) => (
              <div key={index}>
                <img
                  src={image.picture}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-96 rounded"
                />
              </div>
            ))}
          </Slider>





          <h1 className='text-center text-lg pt-10 font-bold font-uniquifier'>Total Advert: {productCount}</h1>

          <div className="flex flex-wrap">
  {advertImages.map((image, index) => (
    <div key={index} className="w-full md:w-1/3 lg:w-1/3 px-4 mb-4">
      <Card className="flex flex-row bg-[#f2f2f2]">
        <img width={250} height={100} src={image.picture} alt="image 1" />
        <div className="flex flex-col justify-center ml-4">
          <h5 className={`${myStyle}, text-2xl`}>{image.name}</h5>
          <h5 className={`${myStyle}, text-2xl`}>{image?.author}</h5>
          <h5 className={`${myStyle}, text-2xl`}>{image?.phone}</h5>
          <h5 className={`${myStyle}, text-2xl`}>{image?.whatsapp}</h5>
          <h3 className={myStyle}>{formatDate(image.dateCreated)}</h3>
        </div>
        <button
          onClick={() => handleDelete(image._id)}
          className="bg-red-500 font-uniquifier w-full text-white p-2 rounded"
        >
          Delete
        </button>
      </Card>
    </div>
  ))}
</div>

        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p>Are you sure you want to delete this image?</p>
            <div className="flex justify-between mt-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Confirm</button>
              <button onClick={() => setShowDeleteConfirmation(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Advert;
