import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Container, PageHeader, Card, Button, Loader, EmptyState, ConfirmModal } from './ui';

const ForgotPass = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Updated API call
  const apiGet = () => {
    fetch(`${baseURL}requests`)
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          console.log(json.data);  // Output the data array to the console
          setData(json.data);
           console.log("First Item:", json.data[0]);
          setProductFilter(json.data);  // Set the data array for rendering the list
          setProductCount(json.data.length);  // Count the number of items
        } else {
          console.error('Error fetching data:', json.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    apiGet();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(`${baseURL}reqts/${deleteId}`)
      .then(response => {
        if (response.data.success) {
          setProductFilter(productFilter.filter(item => item._id !== deleteId));
          setProductCount(productCount - 1);
        } else {
          console.error('Error deleting the report:', response.data.message);
        }
        setShowDeleteConfirmation(false);
      })
      .catch(error => {
        console.error('Error deleting the report:', error);
        setShowDeleteConfirmation(false);
      });
  };

  return (
    <Container>
      <PageHeader title="Password Reset Requests" total={productCount} totalLabel="Total Requests" />

      {loading ? (
        <Loader />
      ) : Array.isArray(productFilter) && productFilter.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item._id} className="flex flex-col p-5">
              <h5 className="font-display text-base font-bold text-ink-900">
                Request from {item.phone}
              </h5>
              <p className="mt-2 text-sm text-ink-600">{item.usermessage}</p>
              <p className="mt-2 text-xs text-ink-400">Created on {formatDate(item.dateCreated)}</p>
              <Button
                variant="danger"
                size="sm"
                className="mt-4 w-full"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No requests found" />
      )}

      <ConfirmModal
        open={showDeleteConfirmation}
        title="Delete this request?"
        message="This removes the password reset request permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Container>
  );
};

export default ForgotPass;
