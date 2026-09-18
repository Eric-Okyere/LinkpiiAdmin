import Logo from '../assets/screen.png';
import Pic from '../assets/bussi.jpeg';
import MyCall from '../assets/picc.png';
import Downl from '../assets/downl.jpeg';
import MyCar from '../assets/Car.png';
import MyOptions from '../assets/picx.png';
import { MdOutlineMailOutline } from "react-icons/md";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";

import { Link } from 'react-router-dom';
import { Container, Card } from '../components/ui';

const About = () => {
  return (
    <Container>
      <div className="mb-8 flex flex-col items-center gap-3 md:flex-row md:justify-center">
        <img src={Logo} className="h-14 w-14 rounded-full md:h-16 md:w-16" alt="logo" />
        <h1 className="font-display text-2xl font-bold text-ink-900">LinkPii</h1>
      </div>

      <h2 className="mb-6 text-center font-display text-2xl font-bold text-ink-900 md:text-3xl">About</h2>

      <Card className="mb-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-10">
        <div className="flex-1 text-center md:text-left">
          <p className="mb-3 font-display font-semibold text-ink-900 md:text-xl">
            Linkpii is a market platform that helps you:
          </p>
          <ul className="space-y-1 text-sm text-ink-600 md:text-base">
            <li>Sell your products to the world</li>
            <li>Hire professional drivers for your daily activities</li>
            <li>Rent a car</li>
            <li>Rent an apartment</li>
            <li>Rent an equipments</li>
            <li>Hire a skill</li>
            <li>Advertise your products</li>
            <li>Advertise your company</li>
            <li>Buy all the products you want</li>
            <li>Connect with customers all over the world</li>
            <li>and so on</li>
          </ul>
        </div>

        <div className="md:w-1/2">
          <img className="rounded-2xl shadow-card" src={Pic} alt="pic" />
        </div>
      </Card>

      <h2 className="mb-6 text-center font-display text-xl font-bold text-ink-900 md:text-2xl">Features</h2>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <img src={MyCall} className="h-auto w-full rounded-xl p-2 sm:w-1/2 md:w-1/3" alt="call" />
        <img src={MyCar} className="h-auto w-full rounded-xl p-2 sm:w-1/2 md:w-1/3" alt="car" />
        <img src={MyOptions} className="h-auto w-full rounded-xl p-2 sm:w-1/2 md:w-1/3" alt="options" />
      </div>

      <h2 className="mb-4 text-center font-display text-xl font-bold text-ink-900 md:text-2xl">Contacts</h2>
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <Link
            to="mailto://linkpiiapp@gmail.com"
            className="flex items-center gap-2 text-ink-700 hover:text-brand-600"
          >
            <MdOutlineMailOutline size={36} />
            <span>linkpiiapp@gmail.com</span>
          </Link>

          <Link
            to="https://wa.me/233247747624"
            className="flex items-center gap-2 text-ink-700 hover:text-brand-600"
          >
            <FaSquareWhatsapp size={36} color="green" />
            <span>+233209317581</span>
          </Link>

          <Link className="flex items-center gap-2 text-ink-700 hover:text-brand-600">
            <IoCall size={30} color="green" />
            <span>+233247747624</span>
          </Link>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <h3 className="font-display text-lg font-bold text-ink-900 md:text-2xl">@Linkpii</h3>
          <img src={Downl} className="h-20 w-80" alt="down" />
        </div>
      </Card>
    </Container>
  );
}

export default About;
