import React from 'react';
import catimage from '../../assets/cat.jpg';

const Categories = () => {
  return (
    <section className="max-w-full mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto py-5 px-5">
        <h6 className='text-4xl text-gray-500 font-bold'>All Categories</h6>
        <p className='text-xl text-gray-500 mt-3'>Book Information with Details</p>
      </div>

      {/* all get list categories */}
      <div className="max-w-6xl mx-auto py-5 px-5">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>
          <div className="">
            <div className="shadow-2xl px-5 py-5 rounded-2xl">
              <img src={catimage} alt="" className='object-center border-2 border-gray-300 rounded-2xl' />
              <h3 className='text-2xl font-semibold mt-2'>History</h3>
              <p className='text-xl font-semibold text-gray-500 mt-3'>3645 Books</p>
            </div>
          </div>

  
        </div>
      </div>
    </section>
  )
}

export default Categories
