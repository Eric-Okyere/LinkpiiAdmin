import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AllCars from './components/AllCars';
import AllUsers from './components/AllUsers';
import AllProducts from './components/AllProducts';
import ApprovedProducts from './screens/ApprovedProducts';
import ApprovedCars from './screens/ApprovedCars';
import Advert from './screens/Advert';
import PostAdvert from './screens/PostAdvert';
import Airtel from './components/codes/Airtel';
import AirtelCode from './screens/AirtelCode';
import MTN from './components/codes/MTN';
import MTNPost from './screens/MTNPost';
import Vodafone from './components/codes/Vodafone';
import VodafonePost from './screens/VodafonePost';
import Emergency from './components/codes/Emergency';
import EmergencyPost from './screens/EmergencyPost';
import Fashion from './components/Fashion';
import ApprovedFashion from './screens/AprrovedFashion';
import AllMechanics from './components/AllMechanics';
import Call from './screens/Call';
import Services from './screens/Services';
import ApprovedServices from './screens/ApprovedServices';
import Okada from './components/codes/Okada';
import SpareParts from './screens/SpareParts';
import Shops from './screens/Shops';
import Whatsapp from './screens/Whatsapp';
import Buildings from './screens/Buildings';
import RentCars from './screens/RentCars';

import Reports from './components/Reports';
import About from './screens/About';
import NewMechanics from './components/NewMechanics';
import UserDetail from './components/UserDetail';
import Equipment from './screens/Equipment';
import Boost from './components/Boost';
import ForgotPassowrd from './screens/ForgotPassowrd';
import ForgotPass from './components/ForgotPass';
import UpdateUser from './components/UpdateUser';
import AdminEditPass from './components/AdminEditPass';
import FashionPost from './components/FashionPost';

const SESSION_DURATION = 60 * 60 * 1000; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLoginTime = localStorage.getItem('loginTime');
    if (savedLoginTime) {
      const currentTime = new Date().getTime();
      const sessionExpired = currentTime - savedLoginTime > SESSION_DURATION;
      if (!sessionExpired) {
        setIsLoggedIn(true);
        setTimeout(() => {
          setIsLoggedIn(false);
          localStorage.removeItem('loginTime');
        }, SESSION_DURATION - (currentTime - savedLoginTime));
      }
    }
  }, []);

  const handleLogin = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const loginTime = new Date().getTime();
      localStorage.setItem('loginTime', loginTime);
      setTimeout(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('loginTime');
      }, SESSION_DURATION);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/agric" element={<AllProducts />} />
            <Route path="/approved" element={<ApprovedProducts />} />
            <Route path="/" element={<Fashion />} />
            <Route path="/approvedfashion" element={<ApprovedFashion />} />
            <Route path="/cars" element={<AllCars />} />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/approvedcars" element={<ApprovedCars />} />
            <Route path="/advert" element={<Advert />} />
            <Route path="/postadvert" element={<PostAdvert />} />
            <Route path="/airtel" element={<Airtel />} />
            <Route path="/airtelcode" element={<AirtelCode />} />
            <Route path="/mtn" element={<MTN />} />
            <Route path="/mtnpost" element={<MTNPost />} />
            <Route path="/vodafone" element={<Vodafone />} />
            <Route path="/vodafonepost" element={<VodafonePost />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/emergencypost" element={<EmergencyPost />} />
            <Route path="/mechanics" element={<AllMechanics />} />
            <Route path="/calls" element={<Call />} />
            <Route path="/services" element={<Services />} />
            <Route path="/servicesapproved" element={<ApprovedServices />} />
            <Route path="/okada" element={<Okada />} />
            <Route path="/spare" element={<SpareParts />} />
            <Route path="/shop" element={<Shops />} />
            <Route path="/whatsap" element={<Whatsapp />} />
            <Route path="/building" element={<Buildings />} />
            <Route path="/carrent" element={<RentCars />} />
            <Route path="/quip" element={<Equipment />} />
            <Route path="/report" element={<Reports />} />
            <Route path="/about" element={<About />} />
            <Route path="/mecha" element={<NewMechanics />} />
            <Route path="/reqt" element={<ForgotPass />} />
            <Route path="/boostproduct" element={<Boost />} />
            <Route path="/user-detail/:id" element={<UserDetail />} />
            <Route path="/user-update/:id" element={<UpdateUser />} />
            <Route path="/user-editpass/:id" element={<AdminEditPass />} />
            <Route path="/fashionedit/:id" element={<FashionPost />} />
           
          </Routes>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
