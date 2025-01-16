import { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link } from 'react-router-dom';

const Fashion = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // State for product count
  const [deleteId, setDeleteId] = useState(null); // State for tracking delete confirmation
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  const myStyle = "font-bold font-uniquifier mx-4 text-gray-700 dark:text-gray-400 font-bold text-lg";

  const apiGet = () => {
    fetch(`${baseURL}fashionpost`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json); // Check the structure of the data here
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
      const response = await fetch(`${baseURL}fashionpost/get/count`);
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
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(`${baseURL}fashionpost/${deleteId}`)
      .then((res) => {
        const updatedProducts = productFilter.filter((item) => item.id !== deleteId);
        setProductFilter(updatedProducts);
        setProductCount(productCount - 1);
        setDeleteId(null);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}fashionpost/${id}/boost`);
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === id) {
            return { ...product, boost: true };
          }
          return product;
        });
      });

      console.log('Product approval updated:', updatedProduct);

      const boostedProduct = productFilter.find((product) => product.id === id);

      const postResponse = await axios.post(`${baseURL}boost`, {
        productname: boostedProduct.name,
        pagename: "fashion",
      });
      alert(boostedProduct.name + ""+ "Boosted Successful")
  
      console.log('Boost record created:', postResponse.data);
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };

  const handleUpdateApproval = async (id) => {
    try {
      const response = await axios.put(`${baseURL}fashionpost/${id}/approve`);
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

  const handleSearch = () => {
    if (searchTerm === '') {
      setProductFilter(data);
    } else {
      const filteredProducts = data.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProductFilter(filteredProducts);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setProductFilter(data);
  };

  return (
    <div>
      <div className='flex justify-between mx-8 pt-16'>
        <h1 className='font-bold'>ALL FASHION</h1>
        <h2 className=' bg-[#f2f2f2] rounded-lg p-4 font-'>Total Products: {productCount}</h2>
      </div>

      {/* Search Input and Button */}
      <div className='flex justify-center my-4'>
        <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 ml-2 rounded-lg">Clear</button>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="p-2 border border-gray-300 rounded-l"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-r">
          Search
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-start gap-4 p-0">
  {loading ? (
    <div className="flex items-center justify-center w-full h-full">
      <BeatLoader color={'#36D7B7'} loading={loading} />
    </div>
  ) : (
    productFilter.map((item) => (
      <Card className="max-w-sm bg-[#f2f2f2] flex flex-col" key={item.id}>
        <img src={item.picture} alt="image 1" className="w-full object-contain" />
        <img src={item.picturesec} alt="image 2" className="w-full object-contain" />

        {item.video ? (
          <video style={{ width: '100%', height: '300px', marginTop: "20px" }} controls>
            <source src={item.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center text-gray-400">
            No Video Available
          </div>
        )}

        <h5 className={`${myStyle} text-2xl`}>{item.name}</h5>
        <h3 className={myStyle}>View: {item.views}</h3>
        <h3 className={myStyle}>Cate: {item?.category?.name}</h3>
        <h3 className={myStyle}>Condi: {item?.condition}</h3>
        <h3 className={myStyle}>Gh₵{item.price}</h3>
        <h3 className={myStyle}>{item.discount}%</h3>
        <h3 className={myStyle}>{item.description}</h3>
        <h3 className={myStyle}>{item.region}</h3>
        <h3 className={myStyle}>{item.town}</h3>
        <h3 className={myStyle}>Phone: {item.phone}</h3>
        <h3 className={myStyle}>Whatsapp: {item.whatsapp}</h3>
        <h3 className={myStyle}>{item.location}</h3>

        <Link to={`/user-detail/${item.author?._id}`}>
          {item.author ? <h3 className={myStyle}>Author: {item.author.name}</h3> : null}
        </Link>
        <p className="text-lg mb-2 text-red-500 ml-4">
          {item?.author?.verified ? (
            <p className="text-orange-400">Verified: Yes</p>
          ) : (
            <p className="text-red-500">Verified: No</p>
          )}
        </p>
        <h3 className={myStyle}>Author Phone: {item?.author?.phone}</h3>
        <h3 className={myStyle}>{formatDate(item.dateCreated)}</h3>

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
          <button
            onClick={() => handleUpdateBoost(item.id)}
            className="bg-blue-600 font-uniquifier w-full text-white p-2 rounded"
          >
            Boost
          </button>

          <Link to={`/fashionedit/${item.id}`}>
  <button className="bg-yellow-500 mt-4 font-uniquifier w-full text-white p-2 rounded">
    Edit
  </button>
</Link>

        </div>
      </Card>
    ))
  )}
</div>



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

export default Fashion;
