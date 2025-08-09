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
  const [productCount, setProductCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
  const [deleteId, setDeleteId] = useState(null); 
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [showBoostConfirmation, setShowBoostConfirmation] = useState(false);
  const [approveId, setApproveId] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`${baseURL}send`)
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

    fetch(`${baseURL}send/get/count`)
      .then((res) => res.json())
      .then((count) => setProductCount(count))
      .catch((error) => console.error('Error fetching product count:', error));
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(`${baseURL}send/${deleteId}`)
      .then(() => {
        const updated = productFilter.filter(item => item.id !== deleteId);
        setProductFilter(updated);
        setProductCount(prev => prev - 1);
        setShowDeleteConfirmation(false);
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateApproval = (id) => {
    setApproveId(id);
    setShowApproveConfirmation(true);
  };

  const confirmApprove = () => {
    axios.put(`${baseURL}send/${approveId}/approve`)
      .then(({ data }) => {
        const updated = productFilter.map(product =>
          product.id === approveId ? { ...product, approved: true } : product
        );
        setProductFilter(updated);
        setShowApproveConfirmation(false);
      })
      .catch((error) => console.error('Error approving product:', error));
  };

  const handleUpdateBoost = (id) => {
    setApproveId(id);
    setShowBoostConfirmation(true);
  };

  const confirmBoost = () => {
    axios.put(`${baseURL}send/${approveId}/boost`)
      .then(({ data }) => {
        const updated = productFilter.map(product =>
          product.id === approveId ? { ...product, boost: true } : product
        );
        setProductFilter(updated);
        setShowBoostConfirmation(false);
      })
      .catch((error) => console.error('Error boosting product:', error));
  };

  return (
    <div className="pt-16 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Agric Products</h1>
        <span className="bg-gray-200 px-4 py-2 rounded text-gray-700">
          Total: {productCount}
        </span>
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
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                <p className="text-green-600 font-bold">Gh₵{item.price}</p>
                <p>{item.description}</p>
                <p>{item.region}, {item.town}</p>
                <p className="text-sm">{formatDate(item.dateCreated)}</p>

                <div className="mt-2 text-sm text-gray-600">
                  <p>📞 {item.phone}</p>
                  <p>💬 {item.whatsapp}</p>
                  <p>📍 {item.location}</p>
                  <p>👁 Views: {item.views}</p>
                  <Link to={`/user-detail/${item.author?._id}`} className="text-blue-600 hover:underline">
                    Author: {item?.author?.name}
                  </Link>
                  <p className={item?.author?.verified ? 'text-green-500' : 'text-red-500'}>
                    Verified: {item?.author?.verified ? 'Yes' : 'No'}
                  </p>
                  <p>📞 {item?.author?.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white py-2 rounded">Delete</button>
                  {!item.approved && (
                    <button onClick={() => handleUpdateApproval(item.id)} className="bg-green-600 text-white py-2 rounded">Approve</button>
                  )}
                  <button onClick={() => handleUpdateBoost(item.id)} className="bg-blue-600 text-white py-2 rounded">Boost</button>
                  <button onClick={() => setEditId(item.id)} className="bg-yellow-500 text-white py-2 rounded">Edit</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showApproveConfirmation && (
        <ConfirmationModal text="approve" onConfirm={confirmApprove} onCancel={() => setShowApproveConfirmation(false)} />
      )}
      {showDeleteConfirmation && (
        <ConfirmationModal text="delete" onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirmation(false)} />
      )}
      {showBoostConfirmation && (
        <ConfirmationModal text="boost" onConfirm={confirmBoost} onCancel={() => setShowBoostConfirmation(false)} />
      )}
      {editId && (
        <ConfirmationModal
          text="edit"
          onConfirm={() => window.location.href = `/agricedit/${editId}`}
          onCancel={() => setEditId(null)}
        />
      )}
    </div>
  );
};

const ConfirmationModal = ({ text, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <p>Are you sure you want to {text} this product?</p>
      <div className="flex justify-center mt-4 space-x-4">
        <button onClick={onConfirm} className="bg-blue-600 text-white px-4 py-2 rounded">Yes</button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">No</button>
      </div>
    </div>
  </div>
);

export default AllProducts;
