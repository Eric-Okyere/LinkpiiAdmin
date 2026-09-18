import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Link, useNavigate } from 'react-router-dom';
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
} from '../components/ui';

const Food = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, action: null, id: null });
  const navigate = useNavigate();

  const apiGet = () => {
    fetch(`${baseURL}food`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json); // Check the structure of the data here
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
      const response = await fetch(`${baseURL}food/get/count`);
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
    axios.delete(`${baseURL}food/${id}`)
      .then((res) => {
        const updatedProducts = productFilter.filter((item) => item.id !== id);
        setProductFilter(updatedProducts);
        setProductCount(productCount - 1);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateBoost = async (id) => {
    try {
      const response = await axios.put(`${baseURL}food/${id}/boost`);
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
      const response = await axios.put(`${baseURL}food/${id}/approve`);
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
      const response = await axios.put(`${baseURL}food/${id}/hot`);
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
    const { action, id } = confirmationPopup;
    if (action === 'delete') {
      confirmDelete();
    } else if (action === 'approve') {
      await handleUpdateApproval(id);
    } else if (action === 'boost') {
      await handleUpdateBoost(id);
    } else if (action === 'hot') {
      await confirmHot();
    } else if (action === 'edit') {
      navigate(`/fashionedit/${id}`);
    }
    closeConfirmation();
  };

  const confirmCopy = {
    delete: { title: 'Delete this product?', message: 'This removes the listing permanently. This cannot be undone.', confirmLabel: 'Delete', danger: true },
    approve: { title: 'Approve this product?', message: 'The listing will become visible to buyers.', confirmLabel: 'Approve' },
    boost: { title: 'Boost this product?', message: 'This will feature the listing more prominently.', confirmLabel: 'Boost' },
    hot: { title: 'Mark this product as Hot?', message: 'It will be flagged as a hot item across the site.', confirmLabel: 'Mark Hot' },
    edit: { title: 'Edit this product?', message: 'You will be taken to the edit screen.', confirmLabel: 'Continue' },
  };
  const activeCopy = confirmCopy[confirmationPopup.action] || {};

  return (
    <Container>
      <PageHeader title="All Food Items" total={productCount} totalLabel="Total Products" />

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
        <EmptyState title="No products found" subtitle="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productFilter.map((item) => {
            const originalPrice = parseFloat(item.price);
            const discount = parseFloat(item.discount);
            const discountedPrice = originalPrice - (originalPrice * discount / 100);

            return (
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
                  <p>Views: {item.views}</p>
                  <p>Category: {item?.category?.name}</p>
                  <p>Condition: {item?.condition}</p>
                  <p className="font-display text-lg font-bold text-brand-600">Gh₵{item.price}</p>
                  <p>Discount: {item.discount}%</p>
                  <p>
                    <span className="text-ink-400 line-through">Gh₵{originalPrice.toFixed(2)}</span>{' '}
                    <span className="font-semibold text-brand-600">Gh₵{discountedPrice.toFixed(2)}</span>
                  </p>
                  <p className="text-xs text-accent-600">
                    You save Gh₵{(originalPrice * discount / 100).toFixed(2)} ({item.discount}%)
                  </p>

                  <p>{item.description}</p>
                  <p>{item.region}, {item.town}</p>
                  <p>Phone: <a href={`tel:${item.phone}`} className="text-brand-600 hover:underline">{item.phone}</a></p>
                  <p>
                    WhatsApp:{' '}
                    <a
                      href={`https://wa.me/${item.whatsapp}?text=Linkpii will require your picture and a picture of your Ghana card before the approval of your product. Your documents are encrypted and secure. We do not share or misuse your data.`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      {item.whatsapp}
                    </a>
                  </p>
                  <p>Location: {item.location}</p>

                  <Link to={`/user-detail/${item.author?._id}`} className="block font-medium text-brand-600 hover:underline">
                    {item.author && <>Author: {item.author.name}</>}
                  </Link>

                  <p>Author Phone: {item?.author?.phone}</p>
                  <p className="flex items-center gap-1">
                    Verified:
                    <Badge tone={item?.author?.verified ? 'success' : 'danger'}>
                      {item?.author?.verified ? 'Yes' : 'No'}
                    </Badge>
                  </p>

                  <p>NumofBoost: <span className="font-semibold text-brand-600">{item.numofBoost}</span></p>
                  <p>
                    DateBoost:{' '}
                    <span className="font-semibold text-brand-600">
                      {new Date(item.dateBoost).toLocaleString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
                      })}
                    </span>
                  </p>

                  <p>NumofHot: <span className="font-semibold text-ink-900">{item.numofHot}</span></p>
                  <p>
                    DateHot:{' '}
                    <span className="font-semibold text-ink-900">
                      {new Date(item.dateHot).toLocaleString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
                      })}
                    </span>
                  </p>

                  <p className="text-xs text-ink-400">Posted: {formatDate(item.dateCreated)}</p>
                  <p className="text-xs text-ink-400">DateHot: {formatDate(item.dateHot)}</p>
                  <p className="text-xs text-ink-400">BoostDate: {formatDate(item.dateBoost)}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-4 pt-0 sm:grid-cols-3">
                  <Button size="sm" variant="danger" onClick={() => handleConfirmation('delete', item.id)}>Delete</Button>
                  {!item.approved && (
                    <Button size="sm" variant="primary" onClick={() => handleConfirmation('approve', item.id)}>Approve</Button>
                  )}
                  <Button size="sm" variant="accent" onClick={() => handleConfirmation('boost', item.id)}>Boost</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleConfirmation('hot', item.id)}>Hot</Button>
                  <Button size="sm" variant="outline" onClick={() => handleConfirmation('edit', item.id)}>Edit</Button>
                </div>
              </Card>
            );
          })}
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

export default Food;
