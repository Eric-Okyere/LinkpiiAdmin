import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Container, PageHeader, Card, Loader, EmptyState } from '../components/ui';

const ApprovedCars = () => {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}send/car/approved`);
        setApprovedProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approved products:', error);
        setLoading(false);
      }
    };

    fetchApprovedProducts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <PageHeader title="Approved Cars" total={approvedProducts.length} totalLabel="Total Approved" />

      {loading ? (
        <Loader />
      ) : approvedProducts.length === 0 ? (
        <EmptyState title="No approved cars yet" subtitle="Approved driver listings will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {approvedProducts.map((item) => (
            <Card hover key={item._id} className="flex flex-col p-5">
              <div className="flex gap-2">
                <img src={item.driverpic} className="h-28 w-1/2 rounded-xl object-cover" alt="Driver" />
                <img src={item.carpic} className="h-28 w-1/2 rounded-xl object-cover" alt="Car" />
              </div>

              <div className="mt-4 space-y-1 text-sm text-ink-600">
                <p className="font-display text-base font-semibold text-ink-900">{item.name}</p>
                <p>Size: {item.size}</p>
                <a href={`tel:${item.phone}`} className="hover:text-brand-600 hover:underline">Phone: {item.phone}</a>
                <p>{item.description}</p>
                <p>Region: {item.region}</p>
                <p>Town: {item.town}</p>
                <p className="text-xs text-ink-400">Joined {formatDate(item.dateCreated)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ApprovedCars;
