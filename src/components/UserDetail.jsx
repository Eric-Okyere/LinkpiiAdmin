import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';


const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [ghBackFile, setGhBackFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [ghBackPreview, setGhBackPreview] = useState(null);
  const [isAvatarSelected, setIsAvatarSelected] = useState(false);
  const [isPictureSelected, setIsPictureSelected] = useState(false);
  const [isGHBackSelected, setIsGHBackSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  const usageData = [
  { name: 'Initial', usage: 0 },
  { name: 'Current', usage: user?.platfUsed || 0 }
];


  useEffect(() => {
    axios.get(`${baseURL}userbyid/${id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [id]);

  console.log(user)

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0];
    setAvatarFile(selectedFile);

    const previewURL = URL.createObjectURL(selectedFile);
    setAvatarPreview(previewURL);
    setIsAvatarSelected(true);
  };

  const handlePictureChange = (event) => {
    const selectedFile = event.target.files[0];
    setPictureFile(selectedFile);

    const previewURL = URL.createObjectURL(selectedFile);
    setPicturePreview(previewURL);
    setIsPictureSelected(true);
  };


  const handleGHbackChange = (event) => {
    const selectedFile = event.target.files[0];
    setGhBackFile(selectedFile);

    const previewURL = URL.createObjectURL(selectedFile);
    setGhBackPreview(previewURL);
    setIsGHBackSelected(true);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!avatarFile || !pictureFile) {
      console.error('Both avatar and picture must be selected');
      return;
    }

    setIsLoading(true);  // Set loading state to true

    const formData = new FormData();
    formData.append('avatar', avatarFile);
    formData.append('picture', pictureFile);
    formData.append('ghback', ghBackFile);

    try {
      const response = await axios.put(`${baseURL}card/${id}/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Avatar and picture updated successfully:', response.data);

      setLoading(true);
      axios.get(`${baseURL}userbyid/${id}`)
        .then((response) => {
          setUser(response.data);
          setLoading(false);
          setAvatarFile(null);
          setGhBackFile(null);
          setPictureFile(null);
          setAvatarPreview(null);
          setGhBackPreview(null);
          setPicturePreview(null);
          setIsAvatarSelected(false);
          setIsGHBackSelected(false);
          setIsPictureSelected(false);
          setIsLoading(false);  // Set loading state to false after fetching
        })
        .catch((error) => {
          console.error('Error fetching updated user data:', error);
          setLoading(false);
          setIsLoading(false);  // Set loading state to false on error
        });

    } catch (error) {
      console.error('Error updating avatar and picture:', error);
      setIsLoading(false);  // Set loading state to false on error
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
  <div className="min-h-screen bg-gray-100 p-4 md:p-8">
    {user ? (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Left Column – User Info */}
        <div className="p-6 md:p-10 bg-white">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.name} {user.lastname}
          </h1>
          <p className="text-gray-600 mb-1">📧 <strong>Email:</strong> {user.email}</p>
          <p className="text-gray-600 mb-1">📞 <strong>Phone:</strong> {user.phone}</p>
          <p className="text-gray-600 mb-1">
            ✅ <strong>Verified:</strong> {user.verified ? <span className="text-green-600">Yes</span> : <span className="text-red-500">No</span>}
          </p>
          <p className="text-gray-600 mb-1">
            🗓️ <strong>Date Created:</strong> {new Date(user.dateCreated).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-6">
            🕓 <strong>Last Seen:</strong>{' '}
            {new Date(user.lastSeen || user.dateCreated).toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📊 Platform Usage</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="usage" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-gray-600">Total times user accessed platform: <strong>{user.platfUsed}</strong></p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Choose Profile Pic</label>
              <input type="file" onChange={handleAvatarChange} accept="image/*" className="block w-full" />
              {isAvatarSelected && (
                <img src={avatarPreview} alt="Avatar Preview" className="mt-2 rounded-md w-40" />
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Front GH Card</label>
              <input type="file" onChange={handlePictureChange} accept="image/*" className="block w-full" />
              {isPictureSelected && (
                <img src={picturePreview} alt="Picture Preview" className="mt-2 rounded-md w-40" />
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Back GH Card</label>
              <input type="file" onChange={handleGHbackChange} accept="image/*" className="block w-full" />
              {isGHBackSelected && (
                <img src={ghBackPreview} alt="Picture Preview" className="mt-2 rounded-md w-40" />
              )}
            </div>

            <button
              type="submit"
              className={`w-full mt-2 py-2 rounded-lg font-semibold text-white transition ${
                isLoading || !isAvatarSelected || !isPictureSelected
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading || !isAvatarSelected || !isPictureSelected}
            >
              {isLoading ? 'Uploading...' : 'Upload for verification'}
            </button>
          </form>
        </div>

        {/* Right Column – Pictures */}
        <div className="p-6 md:p-10 bg-gray-50 flex flex-col items-center justify-start gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-40 h-40 rounded-lg object-cover shadow-md" />
          ) : (
            <p className="text-red-500">No profil pic available</p>
          )}

          {user.picture ? (
            <img src={user.picture} alt="Picture" className="w-full max-w-sm rounded-lg shadow-md" />
          ) : (
            <p className="text-red-500">No ID picture available</p>
          )}

          {user.ghback ? (
            <img src={user.ghback} alt="Background" className="w-full max-w-sm rounded-lg shadow-md" />
          ) : (
            <p className="text-red-500">No picture available</p>
          )}
        </div>
      </div>
    ) : (
      <div className="text-center mt-20 text-red-500 font-semibold">User not found</div>
    )}
  </div>
);

};

export default UserDetail;
