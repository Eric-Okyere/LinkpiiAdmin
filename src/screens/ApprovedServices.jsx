import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../assets/baseURL';
import { Container, PageHeader, Card, Loader, EmptyState } from '../components/ui';

const ApprovedServices = () => {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}services/approved`);
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
      <PageHeader title="Approved Services" total={approvedProducts.length} totalLabel="Total" />

      {loading ? (
        <Loader />
      ) : approvedProducts.length === 0 ? (
        <EmptyState title="No approved services" subtitle="Services you approve will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {approvedProducts.map((item) => (
            <Card hover key={item.id} className="overflow-hidden">
              <img width={500} height={500} src={item.picture} alt={item.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h5 className="font-display text-lg font-semibold text-ink-900">{item.name}</h5>
                <p className="mt-1 text-sm text-ink-500">Views: {item.views}</p>
                <p className="mt-1 font-display text-lg font-bold text-brand-600">Gh₵{item.price}</p>
                <p className="mt-1 text-sm text-ink-600">{item.description}</p>
                <p className="mt-1 text-sm text-ink-500">{item.region}, {item.town}</p>
                <p className="text-sm text-ink-500">{item.location}</p>
                <p className="mt-1 text-xs text-ink-400">{formatDate(item.dateCreated)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ApprovedServices;
