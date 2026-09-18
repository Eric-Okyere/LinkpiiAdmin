import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Container, PageHeader, Card, Badge, Button, Loader, EmptyState, ConfirmModal } from './ui';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const apiGet = () => {
    fetch(`${baseURL}compliants`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
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
      const response = await fetch(`${baseURL}compliants/get/count`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      console.log('Product Count:', productCount);
      setProductCount(productCount);
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
    console.log(`Setting deleteId to: ${id}`);
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    console.log(`Deleting complaint with ID: ${deleteId}`);
    axios.delete(`${baseURL}compliants/${deleteId}`)
      .then(response => {
        if (response.data.success) {
          setProductFilter(productFilter.filter(item => item._id !== deleteId));
          setProductCount(productCount - 1); // Update the product count
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
      <PageHeader title="Reports" total={productCount} totalLabel="Total Complaints" />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No reports found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item._id} className="flex flex-col p-5">
              <h5 className="font-display text-base font-bold text-ink-900">{item.name}</h5>
              <p className="mt-2 text-sm text-ink-700">
                {item.sendername} with phone number {item.senderphone} <Badge tone="danger">Blocked</Badge>{' '}
                {item.product} phone: {item.productphone}
              </p>
              <p className="mt-2 text-sm text-ink-700">Reason: {item.complaint}</p>
              <p className="mt-2 text-xs text-ink-400">{formatDate(item.dateCreated)}</p>
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
      )}

      <ConfirmModal
        open={showDeleteConfirmation}
        title="Delete this report?"
        message="This removes the complaint permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Container>
  );
};

export default Reports;
