import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import {
  Container,
  PageHeader,
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
} from '../components/ui';

const Equipment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // New state for product count
  const [deleteId, setDeleteId] = useState(null); // State for tracking delete confirmation

  const apiGet = () => {
    fetch(`${baseURL}rentcar`)
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
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}rentcar/get/count`);
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
    // Set the id of the item to be deleted
    setDeleteId(id);
  };

  const confirmDelete = () => {
    // Perform the deletion
    axios.delete(`${baseURL}rentcar/${deleteId}`)
      .then((res) => {
        // Filter out the deleted item from the product list
        const updatedProducts = productFilter.filter((item) => item.id !== deleteId);
        setProductCount(productCount - 1);
        setProductFilter(updatedProducts);
        // Reset the deleteId state after deletion
        setDeleteId(null);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}rentcar/${id}/boost`);
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
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };
  const handleUpdateApproval = async (id) => {
    try {
      const response = await axios.put(`${baseURL}rentcar/${id}/approve`);
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

  return (
    <Container>
      <PageHeader title="All Car Rentals" total={productCount} totalLabel="Total Car Rentals" />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No car rentals found" subtitle="Rental car listings will appear here once submitted." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item.id} className="flex flex-col p-5">
              <div className="flex gap-2">
                <img width={500} height={500} src={item.picture} alt="Car" className="h-28 w-1/2 rounded-xl object-cover" />
                <img width={500} height={500} src={item.picturesec} alt="Car" className="h-28 w-1/2 rounded-xl object-cover" />
              </div>

              <p className="mt-4 font-display text-base font-semibold text-ink-900">{item.name}</p>

              <div className="mt-1 space-y-1 text-sm text-ink-600">
                <p>Views: {item.views}</p>
                <p className="font-semibold text-brand-600">GH₵{item.price}</p>
                <p>{item.description}</p>
                <p>{item.region}</p>
                <p>{item.town}</p>
                <a href={`tel:${item.phone}`} className="block hover:text-brand-600 hover:underline">Phone: {item.phone}</a>
                <a
                  href={`https://wa.me/${item.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-brand-600 hover:underline"
                >
                  WhatsApp: {item.whatsapp}
                </a>
                <p>{item.location}</p>
                <p>Author: {item.author.name}</p>
                <p className="text-xs text-ink-400">Joined {formatDate(item.dateCreated)}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.approved && <Badge tone="success">Approved</Badge>}
                {item.boost && <Badge tone="brand">Boosted</Badge>}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                {!item.approved && (
                  <Button size="sm" variant="primary" onClick={() => handleUpdateApproval(item.id)}>Approve</Button>
                )}
                <Button size="sm" variant="accent" onClick={() => handleUpdateBoost(item.id)}>Boost</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete this rental car?"
        message="This removes the listing permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default Equipment;
