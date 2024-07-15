import React from 'react';
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

const About = () => {
  return (
    <div className='p-4 min-h-screen font-serif'>
      <div className="text-black flex flex-col items-center md:flex-row md:justify-center text-xl font-bold font-serif mb-4">
        <img src={Logo} className='h-12 w-12 rounded-full md:h-16 md:w-16 animate-rotate' alt="logo" />
        <h1 className='mt-2 md:mt-0 md:ml-4'>LinkPii</h1>
      </div>

      <h1 className='text-2xl md:text-3xl mb-4 flex justify-center'>About</h1>
      <div className='md:flex justify-between'>
      <div className='flex-0.7 text-center md:text-left font-serif md:text-2xl'>
          <p className='font-bold'>Linkpii is a market platform that helps you:</p>
            <li className=''>Sell your products to the world</li>
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
        </div>

        <div className='md:w-1/2'>
          <img className='rounded-md' src={Pic} alt='pic' />
        </div>


      </div>

      <h1 className='text-xl flex md:text-2xl justify-center pt-3'>Features</h1>
      <div className='flex flex-wrap justify-center'>
        <img src={MyCall} className='w-full h-auto sm:w-1/2 md:w-1/3 p-2' alt='call' />
        <img src={MyCar} className='w-full h-auto sm:w-1/2 md:w-1/3 p-2' alt='car' />
        <img src={MyOptions} className='w-full h-auto sm:w-1/2 md:w-1/3 p-2' alt='options' />
      </div>


      <h1 className='text-xl flex md:text-2xl justify-center'>Contacts</h1>
    <div className='bg-gray-200  p-4 '>
    <div className='md:flex justify-between'>
   
    <Link to="mailto://linkpiiapp@gmail.com" className='flex'>
    <MdOutlineMailOutline size={50} /> <h1 className='pt-3'>linkpiiapp@gmail.com</h1>
  
    </Link>

    <Link to="https://wa.me/233247747624" className='flex'>
    <FaSquareWhatsapp size={50} color='green' />   <h1 className='pt-3'>+233209317581</h1>
    </Link>

    <Link className='flex'>
  
    <IoCall size={40} color='green' /> <h1  className='pt-2'> +233247747624</h1>
    </Link>
  

 

 
    </div>
    <div className='flex justify-center font-serif pt-6'>
    <h1 className=' md:text-2xl pt-6 mr-2'>@Linkpii</h1>
    <img src={Downl} className='w-80 h-20' alt='down' />
    </div>


    </div>


    </div>
  );
}

export default About;
