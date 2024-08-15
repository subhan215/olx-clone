import React from 'react'
import { useLocation } from 'react-router-dom';
function ViewAll() {
  const location = useLocation();
  const { user, mobileAds } = location.state || {};
  console.log(mobileAds)
  return (
    <div>
      <h1>View All Page</h1>
      <h2>User: {user?.email}</h2>
      <h3>Mobile Ads:</h3>
      <ul>
        {mobileAds[0].ads?.map((ad, index) => (
          <li key={index}>{ad.price}</li>
        ))}
      </ul>
    </div>
  )
}

export default ViewAll
