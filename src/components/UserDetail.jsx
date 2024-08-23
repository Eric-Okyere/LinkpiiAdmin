import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../assets/baseURL';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [isAvatarSelected, setIsAvatarSelected] = useState(false);
  const [isPictureSelected, setIsPictureSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // State to track form submission

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
          setPictureFile(null);
          setAvatarPreview(null);
          setPicturePreview(null);
          setIsAvatarSelected(false);
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
    <div className="flex justify-center items-center h-screen pt-96">
      {user ? (
        <div className="text-center p-8 bg-#c8c5c5 shadow-2xl rounded-lg">
          <h1 className="text-3xl font-bold mb-4">{user.name} {user.lastname}</h1>
          <p className="text-lg mb-2">Email: {user.email}</p>
          <p className="text-lg mb-2">Phone: {user.phone}</p>
          <p className="text-lg mb-2 text-red-500">
            {user.verified ? <p className='text-orange-400'>Verified: Yes</p> : <p className='text-red-500'>Verified: No</p>}
          </p>
          <p className="text-lg mb-4">Date Created: {new Date(user.dateCreated).toLocaleDateString()}</p>
          
          {user.avatar ? (
            <img width={200} height={200} src={user.avatar} alt="Avatar" className="rounded-lg mb-4" />
          ) : (
            <p className='text-red-500'>No avatar available</p>
          )}

          {user.picture ? (
            <img width={500} height={500} src={user.picture} alt="User" className="rounded-lg mb-4" />
          ) : (
            <p className='text-red-500'>No picture available</p>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block mb-2">Select picture:</label>
              <input type="file" onChange={handleAvatarChange} accept="image/*" className="mb-4" />
              {isAvatarSelected && (
                <img src={avatarPreview} alt="Avatar Preview" width={200} className="mb-4" />
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Select ID:</label>
              <input type="file" onChange={handlePictureChange} accept="image/*" className="mb-4" />
              {isPictureSelected && (
                <img src={picturePreview} alt="Picture Preview" width={200} className="mb-4" />
              )}
            </div>
            <button 
              type="submit" 
              className={`px-4 py-2 rounded-lg text-white ${isLoading || !isAvatarSelected || !isPictureSelected ? 'bg-gray-400' : 'bg-blue-500'}`}
              disabled={isLoading || !isAvatarSelected || !isPictureSelected}
            >
              {isLoading ? 'Uploading...' : 'Upload ID and Picture'}
            </button>
          </form>
        
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserDetail;
