import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import baseURL from '../assets/baseURL';
import axios from 'axios'; // Import Axios for HTTP requests
import { Container, PageHeader, Card, Button, Loader, EmptyState, ConfirmModal } from '../components/ui';

const Advert = () => {
  const [advertImages, setAdvertImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchAdvertImages = async () => {
      try {
        const response = await fetch(`${baseURL}advert`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAdvertImages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching advert images:', error.message);
        setLoading(false);
      }
    };

    const fetchProductCount = async () => {
      try {
        const response = await fetch(`${baseURL}advert/count`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const productCount = await response.json();
        console.log('Product Count:', productCount);
        setProductCount(productCount); // Set the count in the state
      } catch (error) {
        console.error('Error fetching product count:', error.message);
      }
    };

    fetchAdvertImages();
    fetchProductCount();
  }, []);

  const handleDelete = (id) => {
    // Show delete confirmation popup
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(`${baseURL}advert/${deleteId}`)
      .then((res) => {
        const updatedImages = advertImages.filter((image) => image._id !== deleteId);
        setProductCount(productCount - 1);
        setAdvertImages(updatedImages);
        // Hide delete confirmation popup after deletion
        setShowDeleteConfirmation(false);
      })
      .catch((error) => console.log(error));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <PageHeader title="Adverts" total={productCount} totalLabel="Total Adverts" />

      {loading ? (
        <Loader />
      ) : advertImages.length === 0 ? (
        <EmptyState title="No adverts yet" subtitle="Post a new advert to see it here." />
      ) : (
        <>
          <Card className="mb-8 overflow-hidden p-2">
            <Slider {...settings}>
              {advertImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.picture}
                    alt={`Slide ${index + 1}`}
                    className="h-96 w-full rounded-xl object-cover"
                  />
                </div>
              ))}
            </Slider>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advertImages.map((image, index) => (
              <Card hover key={index} className="flex gap-4 p-4">
                <img
                  width={112}
                  height={96}
                  src={image.picture}
                  alt={image.name}
                  className="h-24 w-28 flex-shrink-0 rounded-xl object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-ink-900">{image.name}</h3>
                    <p className="mt-0.5 text-sm text-ink-500">{image?.author}</p>
                    <p className="text-sm text-ink-500">{image?.phone}</p>
                    <p className="text-sm text-ink-500">{image?.whatsapp}</p>
                    <p className="mt-1 text-xs text-ink-400">{formatDate(image.dateCreated)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    className="mt-3 self-start"
                    onClick={() => handleDelete(image._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <ConfirmModal
        open={showDeleteConfirmation}
        title="Delete this advert?"
        message="This removes the advert image permanently. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Container>
  );
};

export default Advert;
