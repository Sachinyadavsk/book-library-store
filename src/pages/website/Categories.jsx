import React from 'react';
import catimage from '../../assets/cat.jpg';
import categories from '../../staticValue/categoryData';
import { Link } from 'react-router-dom';

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
          {categories.map((category) => (
            <Link
              key={category.name}
              to="/books"
              className={`${category.bg} border border-white rounded-xl p-4 sm:p-5 text-center hover:shadow-md hover:-translate-y-1 transition`}
            >
              <div className="">
                <div className="shadow-2xl px-5 py-5 rounded-2xl">
                  <div className="text-3xl">{category.icon}</div>
                  <h3 className="mt-3 text-sm font-semibold text-gray-800">{category.name}</h3>
                  <p className="mt-1 text-[10px] text-gray-500">{category.books}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
