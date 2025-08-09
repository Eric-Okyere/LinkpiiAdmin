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
  const [productCount, setProductCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [hotId, setHotId] = useState(null)
  const [approveId, setApproveId] = useState(null);
  const [boostId, setBoostId] = useState(null);
  const [editId, setEditId] = useState(null);
 


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




  const handleUpdateHot = async (id) => {
    try {
      const response = await axios.put(`${baseURL}fashionpost/${id}/hot`);
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === id) {
            return { ...product, hot: true };
          }
          return product;
        });
      });

      console.log('Product sent to hot', updatedProduct);

      // const boostedProduct = productFilter.find((product) => product.id === id);

      // const postResponse = await axios.post(`${baseURL}boost`, {
      //   productname: boostedProduct.name,
      //   pagename: "fashion",
      // });
      // alert(boostedProduct.name + ""+ "Boosted Successful")
  
      // console.log('Boost record created:', postResponse.data);
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };




  const confirmHot = async () => {
    try {
      const response = await axios.put(`${baseURL}fashionpost/${hotId}/hot`);
      const updatedProduct = response.data;
  
      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === hotId) {
            return { ...product, hot: true };
          }
          return product;
        });
      });
  
      console.log('Product sent to hot', updatedProduct);
      setHotId(null); // close modal
    } catch (error) {
      console.error('Error marking product as hot:', error);
      setHotId(null); // close modal on error too
    }
  };
  
  

 return (
  <div className="min-h-screen bg-gray-100">
    <div className="flex flex-col md:flex-row justify-between items-center px-8 pt-16 pb-4">
      <h1 className="text-3xl font-bold text-gray-800">All Fashion Items</h1>
      <div className="mt-4 md:mt-0 bg-white text-gray-700 rounded-lg shadow px-6 py-2 text-lg">
        Total Products: <span className="font-semibold">{productCount}</span>
      </div>
    </div>

    {/* Search Bar */}
    <div className="flex justify-center items-center gap-2 px-4 py-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="px-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all">
        Search
      </button>
      <button onClick={handleClear} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all">
        Clear
      </button>
    </div>

    {/* Product Cards */}
    <div className="flex flex-wrap justify-center gap-6 px-4">
      {loading ? (
        <div className="flex items-center justify-center w-full h-64">
          <BeatLoader color={'#36D7B7'} loading={loading} />
        </div>
      ) : (
        productFilter.map((item) => {
           const originalPrice = parseFloat(item.price);
            const discount = parseFloat(item.discount);
            const discountedPrice = originalPrice - (originalPrice * discount / 100);

            return (
          <Card className="w-full max-w-sm bg-white shadow-md rounded-lg overflow-hidden" key={item.id}>
            <img src={item.picture} alt="image 1" className="w-full object-cover h-56" />
            <img src={item.picturesec} alt="image 2" className="w-full object-cover h-56" />

            {item.video ? (
              <video className="w-full h-64 mt-4" controls>
                <source src={item.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                No Video Available
              </div>
            )}

            <div className="p-4 text-gray-700 space-y-1">
              <h5 className="text-xl font-bold">{item.name}</h5>
              <p>Views: {item.views}</p>
              <p>Category: {item?.category?.name}</p>
              <p>Condition: {item?.condition}</p>
              <p className="font-semibold text-lg text-green-600">Gh₵{item.price}</p>
              <p>Discount: {item.discount}%</p>
               <p>
          <span className="text-gray-500 line-through">
            Gh₵{originalPrice.toFixed(2)}
          </span>{' '}
          <span className="text-green-600 font-semibold">
            Gh₵{discountedPrice.toFixed(2)}
          </span>
        </p>
        <p className="text-sm text-orange-500">
          You save Gh₵{(originalPrice * discount / 100).toFixed(2)} ({item.discount}%)
        </p>
 

              <p>{item.description}</p>
              <p>{item.region}, {item.town}</p>
              <p>Phone: <a href={`tel:${item.phone}`} className="text-blue-600 hover:underline">{item.phone}</a></p>
             <p>
                  WhatsApp: <a 
                    href={`https://wa.me/${item.whatsapp}?text=Linkpii will require your picture and a picture of your Ghana card before the approval of your product. Your documents are encrypted and secure. We do not share or misuse your data.`} 
                    target="_blank" 
                    className="text-green-600 hover:underline"
                  >
                    {item.whatsapp}
                  </a>
                </p> 
                <p>Location: {item.location}</p>

              <Link to={`/user-detail/${item.author?._id}`} className="block text-blue-500 hover:underline">
                {item.author && <>Author: {item.author.name}</>}
              </Link>

               <p>Author Phone: {item?.author?.phone}</p>
              <p>Verified: <span className={item?.author?.verified ? 'text-green-600' : 'text-red-500'}>
                {item?.author?.verified ? 'Yes' : 'No'}
              </span></p>

              <p>NumofBoost: <span className={'text-green-600' }>
                {item.numofBoost}
              </span></p>

              <p>DateBoost: <span className={'text-green-600'}>
                {new Date(item.dateBoost).toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
              </span></p>

                <p>NumofBoost: <span className={'text-blue-500' }>
                {item.numofHot}
              </span></p>
              <p>DateHot: <span className={'text-blue-500' }>
               {new Date(item.dateHot).toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
              </span></p>
             
              <p className="text-sm text-gray-500">Posted: {formatDate(item.dateCreated)}</p>
              <p className="text-sm text-gray-500">DateHot: {formatDate(item.dateHot)}</p>
              <p className="text-sm text-gray-500">BoostDate: {formatDate(item.dateBoost)}</p>
            </div>

           <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">

 <button
  onClick={() => handleDelete(item.id)}  // or item._id if that's the case
  className="bg-red-500 text-white py-2 rounded-md"
>
  Delete
</button>


  {!item.approved && (
    <button
      onClick={() => setApproveId(item.id)}
      className="bg-green-600 text-white py-2 rounded-md"
    >
      Approve
    </button>
  )}

  <button
    onClick={() => setBoostId(item.id)}
    className="bg-blue-600 text-white py-2 rounded-md"
  >
    Boost
  </button>

 <button
  onClick={() => {
    console.log('HOT ID:', item.id);
    setHotId(item.id);
  }}
  className="bg-black text-white py-2 rounded-md"
>
  Hot
</button>


  <button
    onClick={() => setEditId(item.id)}
    className="bg-yellow-500 text-white py-2 rounded-md"
  >
    Edit
  </button>
</div>

          </Card>
            )
})
      )}
    </div>

   {/* Approve Confirmation */}
{approveId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <p>Approve this product?</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            handleUpdateApproval(approveId);
            setApproveId(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Confirm
        </button>
        <button onClick={() => setApproveId(null)} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* Boost Confirmation */}
{boostId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <p>Boost this product?</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            handleUpdateBoost(boostId);
            setBoostId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Confirm
        </button>
        <button onClick={() => setBoostId(null)} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* Edit Confirmation */}
{editId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <p>Edit this product?</p>
      <div className="flex justify-between mt-4">
        <Link to={`/fashionedit/${editId}`}>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            Confirm
          </button>
        </Link>
        <button onClick={() => setEditId(null)} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{deleteId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md">
      <p className="mb-4">Are you sure you want to delete this product?</p>
      <div className="flex justify-between">
        <button
          onClick={confirmDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2"
        >
          Confirm
        </button>
        <button
          onClick={() => setDeleteId(null)}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{hotId && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded shadow-md">
      <p>Are you sure you want to mark this product as <strong>Hot</strong>?</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={confirmHot}
          className="bg-black text-white px-4 py-2 rounded mr-2"
        >
          Confirm
        </button>
        <button
          onClick={() => setHotId(null)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}



  </div>
);

};

export default Fashion;
