import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../assets/baseURL';
import { Container, Card, Button } from './ui';

const AdminEditPass = () => {
  const [password, setPassword] = useState("");
  const { id: userId } = useParams(); // Extracts 'id' parameter from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${baseURL}editpass/${userId}`, {
        newPassword: password,
      });

      if (response.data.success) {
        toast.success("Password edited successfully!");
      } else {
        toast.error("Failed to update password: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating the password.");
    }
  };

  return (
    <Container>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">Update Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />

            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default AdminEditPass;
