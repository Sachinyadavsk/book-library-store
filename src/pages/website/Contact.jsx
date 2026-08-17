import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faMailForward, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <section className="max-w-full mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto py-5 px-5 text-center">
        <h6 className='text-4xl text-gray-500 font-bold'>Contact us</h6>
        <p className='text-xl text-gray-500 mt-3'>Information with query get</p>
      </div>
      <div className="max-w-6xl mx-auto py-5 px-5">
        <div className="grid lg:grid-cols-2 gap-30">
          {/* query form  */}
          <div className="">
            <div className="shadow-2xl py-5 px-5">
              <form action="" method="post">
                <div className="">
                  <label htmlFor="">Your name</label>
                  <input type="text" placeholder='Enter your name' className='w-full p-3 border' />
                </div>
                <div className="mt-2">
                  <label htmlFor="">Email Address</label>
                  <input type="Email" placeholder='Enter email address' className='w-full p-3 border' />
                </div>
                <div className="mt-2">
                  <label htmlFor="">Message</label>
                  <textarea name="message" id="" cols="30" rows="8" placeholder='Enter your message Or typing' className='w-full p-3 border'></textarea>
                </div>
                <div className="">
                  <button type="submit" className='bg-blue-600 text-gray-200 border p-3 mt-2'>Send Message</button>
                </div>
              </form>
            </div>
          </div>

          {/* email, location contact number */}
          <div className="">
            <div className="flex gap-10">
              <div className=""> <FontAwesomeIcon icon={faMailForward} className='text-blue-500 rounded-2xl object-cover border-2 p-4' /></div>
              <div className="">
                <h6>Email</h6>
                <p>book@gmail.com</p>
              </div>
            </div>
            <div className="flex gap-10 mt-10">
              <div className=""> <FontAwesomeIcon icon={faPhone} className='text-blue-500 rounded-2xl object-cover border-2 p-4' /></div>
              <div className="">
                <h6>Phone</h6>
                <p>411-54545-5745</p>
              </div>
            </div>
            <div className="flex gap-10 mt-10">
              <div className=""><FontAwesomeIcon icon={faLocation} className='text-blue-500 rounded-2xl object-cover border-2 p-4' /></div>
              <div className="">
                <h6>Address</h6>
                <p>k-52 block center noida uttar pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
