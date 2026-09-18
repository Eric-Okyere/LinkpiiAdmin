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
    fetch(`${baseURL}equipmentmain`)
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
      const response = await fetch(`${baseURL}equipmentmain/get/count`);
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
    axios.delete(`${baseURL}equipmentmain/${deleteId}`)
      .then((res) => {
        // Filter out the deleted item from the product list
        const updatedProducts = productFilter.filter((item) => item.id !== deleteId);
        setProductFilter(updatedProducts);
        // Reset the deleteId state after deletion
        setDeleteId(null);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}equipmentmain/${id}/boost`);
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
      const response = await axios.put(`${baseURL}equipmentmain/${id}/approve`);
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
      <PageHeader title="All Equipment" total={productCount} totalLabel="Total Products" />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No products found" subtitle="Equipment listings will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item.id} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-0.5 bg-ink-100">
                <img width={500} height={500} src={item.picture} alt="image 1" className="h-32 w-full object-cover" />
                <img width={500} height={500} src={item.picturesec} alt="image 2" className="h-32 w-full object-cover" />
              </div>

              <div className="space-y-1 p-4 text-sm text-ink-600">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-display text-base font-bold text-ink-900">{item.name}</h5>
                  {item.approved ? <Badge tone="success">Approved</Badge> : <Badge tone="warning">Pending</Badge>}
                </div>
                <p>View: {item.views}</p>
                <p className="font-display text-lg font-bold text-brand-600">Gh₵{item.price}</p>
                <p>{item.description}</p>
                <p>{item.region}, {item.town}</p>
                <p>Phone: {item.phone}</p>
                <p>Whatsapp: {item.whatsapp}</p>
                <p>{item.location}</p>
                <p>{item.author.name}</p>
                <p className="text-xs text-ink-400">{formatDate(item.dateCreated)}</p>
              </div>

              <div className="space-y-2 p-4 pt-0">
                <Button size="sm" variant="danger" className="w-full" onClick={() => handleDelete(item.id)}>Delete</Button>
                {!item.approved && (
                  <Button size="sm" variant="primary" className="w-full" onClick={() => handleUpdateApproval(item.id)}>Approve</Button>
                )}
                <Button size="sm" variant="accent" className="w-full" onClick={() => handleUpdateBoost(item.id)}>Boost</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete this product?"
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
