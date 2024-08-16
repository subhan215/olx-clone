import React from "react";
import { NavLink } from "react-router-dom";

const PostAd = () => {
  const categories = [
    { name: "Mobile", icon: "📱", color: "bg-red-100" },
    { name: "Vehicle", icon: "🚗", color: "bg-yellow-100" },
    { name: "Jobs", icon: "💼", color: "bg-teal-100" },
    { name: "Service", icon: "🛠️", color: "bg-pink-100" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">POST YOUR AD</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex items-center p-4 rounded-lg shadow-md bg-white border border-gray-200"
          >
            <div className={`text-3xl p-2 rounded-full ${category.color}`}>
              {category.icon}
            </div>
            <div className="ml-4 text-xl font-semibold text-gray-800">
              {category.name}
            </div>
            <NavLink
              to={`/sell/${category.name.toLowerCase()}`}
              className="ml-auto text-2xl text-gray-800 no-underline"
            >
              ➔
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostAd;
