import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link } from 'react-router-dom';
import {
  Container,
  PageHeader,
  SearchInput,
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  ConfirmModal,
} from './ui';

const HotProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, action: null, id: null });

  const apiGet = () => {
    Promise.all([
      fetch(`${baseURL}fashionpost/hot`).then((res) => res.json()),
      fetch(`${baseURL}buildings/hot/building`).then((res) => res.json()),
      fetch(`${baseURL}shops/hot/shops`).then((res) => res.json()),
    ])
      .then(([fashionData, buildingData, shopData]) => {
        const combinedData = [...fashionData, ...buildingData, ...shopData];
        console.log('Combined hot data:', combinedData);
        setData(combinedData);
        setProductFilter(combinedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching hot data:', error);
        setLoading(false);
      });
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}fashionpost/get/count`);
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

  const confirmDelete = () => {
    const { id } = confirmationPopup;
    axios.delete(`${baseURL}fashionpost/${id}`)
      .then((res) => {
        const updatedProducts = productFilter.filter((item) => item.id !== id);
        setProductFilter(updatedProducts);
        setProductCount(productCount - 1);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}fashionpost/${id}/boost`);
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
        pagename: "fashion",
      });
      alert(boostedProduct.name + ""+ "Boosted Successful")

      console.log('Boost record created:', postResponse.data);
    } catch (error) {
      console.error('Error updating product approval:', error);
    }
  };

  const handleUpdateApproval = async (id) => {
    try {
      const response = await axios.put(`${baseURL}fashionpost/${id}/approve`);
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

  const handleSearch = () => {
    if (searchTerm === '') {
      setProductFilter(data);
    } else {
      const filteredProducts = data.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProductFilter(filteredProducts);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setProductFilter(data);
  };

  const confirmHot = async () => {
    const { id } = confirmationPopup;
    try {
      const response = await axios.put(`${baseURL}fashionpost/${id}/hot`);
      const updatedProduct = response.data;

      setProductFilter((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === id) {
            return { ...product, hot: true };
          }
          return product;
        });
      });

      console.log('Product sent to hot', updatedProduct);
    } catch (error) {
      console.error('Error marking product as hot:', error);
    }
  };

  const handleConfirmation = (action, id) => {
    setConfirmationPopup({ visible: true, action, id });
  };

  const closeConfirmation = () => setConfirmationPopup({ visible: false, action: null, id: null });

  const confirmAction = async () => {
    const { action } = confirmationPopup;
    if (action === 'delete') confirmDelete();
    else if (action === 'hot') await confirmHot();
    closeConfirmation();
  };

  const confirmCopy = {
    delete: { title: 'Delete this product?', message: 'This removes the listing permanently. This cannot be undone.', confirmLabel: 'Delete', danger: true },
    hot: { title: 'Mark this product as Hot?', message: 'It will be flagged as a hot item across the site.', confirmLabel: 'Mark Hot' },
  };
  const activeCopy = confirmCopy[confirmationPopup.action] || {};

  return (
    <Container>
      <PageHeader title="Hot Products" />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
        onClear={handleClear}
        placeholder="Search products..."
        className="mb-6"
      />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No hot products found" subtitle="Try a different search term." />
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
                <h5 className="font-display text-lg font-bold text-ink-900">{item.name}</h5>
                <p>Views: {item.views}</p>
                <p>Category: {item?.category?.name}</p>
                <p>Condition: {item?.condition}</p>
                <p className="font-display text-lg font-bold text-brand-600">Gh₵{item.price}</p>
                <p>Discount: {item.discount}%</p>
                <p>{item.description}</p>
                <p>{item.region}, {item.town}</p>
                <p>Phone: {item.phone}</p>
                <p>WhatsApp: {item.whatsapp}</p>
                <p>{item.location}</p>

                {item.author && (
                  <Link to={`/user-detail/${item.author?._id}`} className="block font-medium text-brand-600 hover:underline">
                    Author: {item.author.name}
                  </Link>
                )}
                <Badge tone={item?.author?.verified ? 'success' : 'danger'}>
                  Verified: {item?.author?.verified ? 'Yes' : 'No'}
                </Badge>
                <p>Author Phone: {item?.author?.phone}</p>
                <p className="text-xs text-ink-400">{formatDate(item.dateCreated)}</p>
              </div>

              <div className="space-y-2 p-4 pt-0">
                <Button size="sm" variant="danger" className="w-full" onClick={() => handleConfirmation('delete', item.id)}>Delete</Button>

                {!item.approved && (
                  <Button size="sm" variant="primary" className="w-full" onClick={() => handleUpdateApproval(item.id)}>Approve</Button>
                )}
                <Button size="sm" variant="accent" className="w-full" onClick={() => handleUpdateBoost(item.id)}>Boost</Button>
                <Button size="sm" variant="secondary" className="w-full" onClick={() => handleConfirmation('hot', item.id)}>Hot</Button>

                <Button as={Link} to={`/fashionedit/${item.id}`} size="sm" variant="outline" className="w-full">Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmationPopup.visible}
        title={activeCopy.title}
        message={activeCopy.message}
        confirmLabel={activeCopy.confirmLabel}
        danger={confirmationPopup.action === 'delete'}
        onConfirm={confirmAction}
        onCancel={closeConfirmation}
      />
    </Container>
  );
};

export default HotProducts;
