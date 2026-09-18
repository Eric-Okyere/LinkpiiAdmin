import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { FcCallTransfer } from "react-icons/fc";
import { Container, PageHeader, SearchInput, Card, Button, Loader, EmptyState, ConfirmModal } from './ui';

const Boost = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productFilter, setProductFilter] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

  const apiGet = () => {
    fetch(`${baseURL}boost`)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setProductFilter(json);
        setLoading(false);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch(`${baseURL}boost/count`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const productCount = await response.json();
      setProductCount(productCount);
    } catch (error) {
      console.error('Error fetching product count:', error.message);
    }
  };

  useEffect(() => {
    apiGet();
    fetchProductCount();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
};

const currentDateTime = new Date().toISOString(); // Get current date and time in ISO format
const currentTimeFormatted = formatDateTime(currentDateTime); // Format the current date and time
console.log(currentTimeFormatted);

  const handleDelete = (id) => {
    setShowConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(
      `${baseURL}boost/${deleteId}`
    )
      .then((res) => {
        const products = productFilter.filter((item) => item._id !== deleteId);
        setProductCount(productCount - 1);
        setProductFilter(products);
        setShowConfirmation(false);
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = () => {
    let filteredProducts;
    if (searchTerm === '') {
      // If search term is empty, display all products
      filteredProducts = data;
    } else {
      // If search term is provided, filter based on the original data array
      filteredProducts = data.filter((item) => {
        const itemName = (item.name || '').toLowerCase();

        const itemReceiverPhone = (item.receiverphone || '').toLowerCase();
        const itemPhone = (item.phone || '').toLowerCase();
        const itemRecname = (item.recname || '').toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();

        return (
          itemName.includes(searchTermLower) ||
          itemRecname.includes(searchTermLower) ||
          itemReceiverPhone.includes(searchTermLower) ||
          itemPhone.includes(searchTermLower)
        );
      });
    }
    setProductFilter(filteredProducts);
  };

  const handleClear=()=> {
    setSearchTerm("")
    setProductFilter(data)
  }



  return (
    <Container>
      <PageHeader title="Boosted Products" total={productCount} totalLabel="Total Boosted" />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
        onClear={handleClear}
        placeholder="Search by name or phone number"
        className="mb-6"
      />

      {loading ? (
        <Loader />
      ) : productFilter.length === 0 ? (
        <EmptyState title="No boosts found" subtitle="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productFilter.map((item) => (
            <Card hover key={item._id} className="flex flex-col items-center p-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <FcCallTransfer size={24} />
              </div>
              <p className="mt-3 text-sm text-ink-700">
                <span className="font-display font-semibold text-ink-900">{item.productname}</span> was{' '}
                <span className="font-semibold text-red-600">Boosted</span> from {item.pagename} on {item.receiverphone}
              </p>
              <p className="mt-1 text-xs text-ink-400">{formatDateTime(item.dateCreated)}</p>

              <Button size="sm" variant="danger" className="mt-4 w-full" onClick={() => handleDelete(item._id)}>
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={showConfirmation}
        title="Delete this boost?"
        message="This removes the boost record permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmation(false)}
      />
    </Container>
  );
};

export default Boost;
