import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { FaWhatsapp } from "react-icons/fa";
import { Container, Card, Badge, Button, Loader, EmptyState } from './ui';



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

  const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "233" + cleaned.slice(1);
  }
  if (phone.startsWith("+")) {
    cleaned = phone.slice(1);
  }

  return cleaned;
};

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      {user ? (
        <Card className="grid grid-cols-1 overflow-hidden md:grid-cols-2">
          {/* Left Column – User Info */}
          <div className="p-6 md:p-10">
            <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
              {user.name} {user.lastname}
            </h1>
            <p className="mt-3 text-sm text-ink-600">📧 <strong className="text-ink-800">Email:</strong> {user.email}</p>
            <p className="mt-1 text-sm text-ink-600">📞 <strong className="text-ink-800">Phone:</strong> {user.phone}</p>
            {user.phone && (
              <Button
                as="a"
                href={`https://wa.me/${formatPhoneForWhatsApp(user.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 !bg-emerald-600 hover:!bg-emerald-700"
              >
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </Button>
            )}
            <p className="mt-3 text-sm text-ink-600">
              ✅ <strong className="text-ink-800">Verified:</strong>{' '}
              {user.verified ? <Badge tone="success">Yes</Badge> : <Badge tone="danger">No</Badge>}
            </p>
            <p className="mt-2 text-sm text-ink-600">
              🗓️ <strong className="text-ink-800">Date Created:</strong> {new Date(user.dateCreated).toLocaleDateString()}
            </p>
            <p className="mb-6 mt-2 text-sm text-ink-600">
              🕓 <strong className="text-ink-800">Last Seen:</strong>{' '}
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

            <Card className="mb-6 p-4">
              <h2 className="mb-2 font-display text-lg font-bold text-ink-900">📊 Platform Usage</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-sm text-ink-600">
                Total times user accessed platform: <strong className="text-ink-900">{user.platfUsed}</strong>
              </p>
            </Card>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink-700">Choose Profile Pic</label>
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink-700 hover:file:bg-ink-200"
                />
                {isAvatarSelected && (
                  <img src={avatarPreview} alt="Avatar Preview" className="mt-2 w-40 rounded-lg object-cover" />
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink-700">Front GH Card</label>
                <input
                  type="file"
                  onChange={handlePictureChange}
                  accept="image/*"
                  className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink-700 hover:file:bg-ink-200"
                />
                {isPictureSelected && (
                  <img src={picturePreview} alt="Picture Preview" className="mt-2 w-40 rounded-lg object-cover" />
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-ink-700">Back GH Card</label>
                <input
                  type="file"
                  onChange={handleGHbackChange}
                  accept="image/*"
                  className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink-700 hover:file:bg-ink-200"
                />
                {isGHBackSelected && (
                  <img src={ghBackPreview} alt="Picture Preview" className="mt-2 w-40 rounded-lg object-cover" />
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isAvatarSelected || !isPictureSelected}
              >
                {isLoading ? 'Uploading...' : 'Upload for verification'}
              </Button>
            </form>
          </div>

          {/* Right Column – Pictures */}
          <div className="flex flex-col items-center justify-start gap-4 bg-ink-50 p-6 md:p-10">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-40 w-40 rounded-2xl object-cover shadow-card" />
            ) : (
              <p className="text-sm font-semibold text-red-500">No profil pic available</p>
            )}

            {user.picture ? (
              <img src={user.picture} alt="Picture" className="w-full max-w-sm rounded-2xl shadow-card" />
            ) : (
              <p className="text-sm font-semibold text-red-500">No ID picture available</p>
            )}

            {user.ghback ? (
              <img src={user.ghback} alt="Background" className="w-full max-w-sm rounded-2xl shadow-card" />
            ) : (
              <p className="text-sm font-semibold text-red-500">No picture available</p>
            )}
          </div>
        </Card>
      ) : (
        <EmptyState title="User not found" />
      )}
    </Container>
  );

};

export default UserDetail;
