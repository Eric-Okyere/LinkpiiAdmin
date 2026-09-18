import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link } from 'react-router-dom';
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

const Shops = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0); // New state for product count
  const [deleteId, setDeleteId] = useState(null); // State for tracking delete confirmation

  const apiGet = () => {
    fetch(`${baseURL}shops`)
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
      const response = await fetch(`${baseURL}shops/get/count`);
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
    axios.delete(`${baseURL}shops/${deleteId}`)
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

  const handleUpdateApproval = async (id) => {
    try {
      const response = await axios.put(`${baseURL}shops/${id}/approve`);
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

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}shops/${id}/boost`);
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

      const boostedProduct = productFilter.find((product) => product.id === id);

      const postResponse = await axios.post(`${baseURL}boost`, {
        productname: boostedProduct.name,
        pagename: "Shop",
      });
      alert(boostedProduct.name+ "Boosted Successful")
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };

  return (
    <Container>
      <PageHeader title="All Shops" total={productCount} totalLabel="Total shops" />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No shops found" subtitle="Shop listings will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => (
            <Card hover key={item.id} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-0.5 bg-ink-100">
                <img src={item.picture} alt="image 1" className="h-32 w-full object-cover" />
                <img src={item.picturesec} alt="image 2" className="h-32 w-full object-cover" />
              </div>

              {item.video ? (
                <video className="h-40 w-full bg-black" controls>
                  <source src={item.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null}

              <div className="space-y-1 p-4 text-sm text-ink-600">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-display text-base font-bold text-ink-900">{item.name}</h5>
                  {item.approved ? <Badge tone="success">Approved</Badge> : <Badge tone="warning">Pending</Badge>}
                </div>
                <p className="font-display text-lg font-bold text-brand-600">Gh₵{item.price}</p>
                <p>{item.description}</p>
                <p>{item.region}, {item.town}</p>
                <p>Phone: {item.phone}</p>
                <p>Whatsapp: {item.whatsapp}</p>
                <p>{item.location}</p>
                <p>Views: {item.views}</p>

                {item.author && (
                  <Link to={`/user-detail/${item.author?._id}`} className="block font-medium text-brand-600 hover:underline">
                    Author: {item.author.name}
                  </Link>
                )}
                <p>Author Phone: {item?.author?.phone}</p>
                <Badge tone={item?.author?.verified ? 'success' : 'danger'}>
                  Verified: {item?.author?.verified ? 'Yes' : 'No'}
                </Badge>

                {item.commentsec.map((contact, index) => (
                  <p key={index} className="text-xs text-ink-500">Viewers Contacts: {contact.content}</p>
                ))}
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
        title="Delete this shop?"
        message="This removes the listing permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default Shops;
