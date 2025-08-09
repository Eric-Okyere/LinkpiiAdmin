import { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link } from 'react-router-dom';

const Services = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch(`${baseURL}services`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setProductFilter(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });

    fetch(`${baseURL}services/get/count`)
      .then((res) => res.json())
      .then((count) => setProductCount(count))
      .catch((err) => console.error('Error fetching count:', err));
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = () => {
    axios.delete(`${baseURL}services/${deleteId}`)
      .then(() => {
        setProductFilter(prev => prev.filter(item => item.id !== deleteId));
        setProductCount(prev => prev - 1);
        setDeleteId(null);
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateApproval = async (id) => {
    try {
      const response = await axios.put(`${baseURL}services/${id}/approve`);
      setProductFilter(prev =>
        prev.map(p => (p.id === id ? { ...p, approved: true } : p))
      );
    } catch (err) {
      console.error('Error approving service:', err);
    }
  };

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}services/${id}/boost`);
      const boostedProduct = data.find((p) => p.id === id);
      await axios.post(`${baseURL}boost`, {
        productname: boostedProduct.name,
        pagename: 'services',
      });
      alert(`${boostedProduct.name} Boosted Successfully`);
      setProductFilter(prev =>
        prev.map(p => (p.id === id ? { ...p, boost: true } : p))
      );
    } catch (err) {
      console.error('Error boosting service:', err);
    }
  };

  return (
    <div className="pt-16 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Services</h1>
        <span className="bg-gray-200 px-4 py-2 rounded text-gray-700">Total: {productCount}</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <BeatLoader color="#36D7B7" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productFilter.map((item) => (
            <Card key={item.id} className="bg-white rounded shadow">
              <img src={item.picture} alt="Main" className="w-full h-48 object-cover" />
              <img src={item.picturesec} alt="Secondary" className="w-full h-48 object-cover" />
              {item.video ? (
                <video className="w-full h-48 mt-2" controls>
                  <source src={item.video} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-400">No Video</div>
              )}
              <div className="p-4 text-sm text-gray-700 space-y-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                {/* <p className="text-green-600 font-bold">Gh₵{item.price}</p> */}
                <p>{item.description}</p>
                <p>{item.region}, {item.town}</p>
                <p>Phone: <a href={`tel:${item.phone}`} className="text-blue-600 hover:underline">{item.phone}</a></p>
                <p>
                  WhatsApp: <a 
                    href={`https://wa.me/${item.whatsapp}?text=Linkpii will require your picture and a picture of your Ghana card before the approval of ${item.name}.`} 
                    target="_blank" 
                    className="text-green-600 hover:underline"
                  >
                    {item.whatsapp}
                  </a>
                </p>
                <p>📍 {item.location}</p>
                <p>👁 Views: {item.views}</p>
                <Link to={`/user-detail/${item.author?._id}`} className="text-blue-500 hover:underline">
                  Author: {item.author?.name}
                </Link>
                <p className={item.author?.verified ? 'text-green-600' : 'text-red-500'}>
                  Verified: {item.author?.verified ? 'Yes' : 'No'}
                </p>
                <p>Author Phone: {item.author?.phone}</p>
                <p className="text-gray-500">Posted: {formatDate(item.dateCreated)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white py-2 rounded">Delete</button>
                  {!item.approved && (
                    <button onClick={() => handleUpdateApproval(item.id)} className="bg-green-600 text-white py-2 rounded">Approve</button>
                  )}
                  <button onClick={() => handleUpdateBoost(item.id)} className="bg-blue-600 text-white py-2 rounded">Boost</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-between mt-4">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded mr-2">Confirm</button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
