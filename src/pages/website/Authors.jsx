import React from 'react';
import authresimag1 from '../../assets/authers1.jpg';
import authresimag2 from '../../assets/authers2.jpg';
import authresimag3 from '../../assets/authers3.jpg';

const Authors = () => {
  return (
    <div className='max-w-7xl mx-auto py-10 px-8'>
      <div className="max-w-4xl mx-auto">
        <h3 className='text-3xl text-gray-600 font-semibold'>Authors Publications</h3>
        <p className='text-lg text-gray-500 my-2'>Authors list and wih relation the books name</p>
      </div>

      {/* authers list */}
      <div className="max-w-4xl mx-auto">
        <div className="shadow rounded-3xl py-2 px-5 mt-4">
          <div className="flex gap-15">
            <div className="">
              <img
                src={authresimag1}
                alt="Profile"
                className="w-32 h-32 sm:w-32 sm:h-32 lg:rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="">
              <h1 className="mt-5 text-2xl font-bold text-gray-800">
                Hello
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Welcome to our Book Library Store.
              </p>
            </div>
          </div>
        </div>
        <div className="shadow rounded-3xl py-2 px-5 mt-4">
          <div className="flex gap-15">
            <div className="">
              <img
                src={authresimag2}
                alt="Profile"
                className="w-32 h-32 sm:w-32 sm:h-32 lg:rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="">
              <h1 className="mt-5 text-2xl font-bold text-gray-800">
                Hello
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Welcome to our Book Library Store.
              </p>
            </div>
          </div>
        </div>
        <div className="shadow rounded-3xl py-2 px-5 mt-4">
          <div className="flex gap-15">
            <div className="">
              <img
                src={authresimag3}
                alt="Profile"
                className="w-32 h-32 sm:w-32 sm:h-32 lg:rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="">
              <h1 className="mt-5 text-2xl font-bold text-gray-800">
                Hello
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Welcome to our Book Library Store.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authors
