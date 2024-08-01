import React, { useEffect, useState } from "react";
import { getCookie } from "../cookies/getCookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserDataWithRedux } from "../redux/slices/userData";
import Nav from "../components/Navbar/Nav";
import { setAdsDataWithRedux } from "../redux/slices/adsData";
import { getAllPosts } from "../functions/allPosts";
const Home = () => {
  const dispatch = useDispatch()
  let token = getCookie("token")
  let ads = useSelector((state)=> state.adsData.data )
  let search = useSelector((state)=> state.searchFilter.search)
  //getting states of location from store
  let province = useSelector((state)=>state.locationData.province)
  let city = useSelector((state)=> state.locationData.city)
  const [userLoginBool , setUserLoginBool] = useState(false)
 useEffect(()=> {
    
    const verifyToken = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/users/getUser' , {
          headers : {
            'Content-Type' : "application/json"
          } , 
          method: "POST" , 
          body: JSON.stringify({token})
        })
        let data = await response.json()
        console.log(data)
        if(data.success) {
            setUserLoginBool(true)
            dispatch(setUserDataWithRedux({payload:data.data })) 
        }
        else {
            alert(data.message)
        }
      }
      catch(err) {
          console.log(err)
      }
    }
    getAllPosts(dispatch)
   
    if(token) {
      verifyToken()
    }
    
 } , [])

 //abhi ye kaam yahan kardia ha agay iska structure aur behtar kardon ga
 let filteredAds = [];

if ((province === 'Sindh' || province === 'Punjab' || province === 'Balochistan' ||
  province === 'KPK' || province === 'Kashmir') && province) {
  ads.forEach(adObject => {
    adObject.ads.forEach(ad => {
      if (ad.province === province) {
        console.log("filtering on province")
        filteredAds.push(ad);
      }
    });
  });
} else {
  ads.forEach(adObject => {
    adObject.ads.forEach(ad => {
      filteredAds.push(ad);
    });
  });
}

if (city) {
  filteredAds = filteredAds.filter(ad => ad.city === city);
}
  console.log(search)
  filteredAds = filteredAds.filter(ad => 
    ad.category?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.adTitle?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.description?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.make?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.companyName?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.careerLevel?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.salaryPeriod?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.positionType?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.brand?.toLowerCase().includes(search?.toLowerCase()) || 
    ad.condition?.toLowerCase().includes(search?.toLowerCase())
  ); 

console.log(filteredAds)
 // Filter ads for Mobile Phones category
 const mobileAds = ads.filter((object) => object.model === "mobile");
 console.log(mobileAds)
 
  return (
    <div>
      <Nav/>


       <h1>Mobile Phones</h1>
       {mobileAds[0]?.ads &&
        mobileAds[0].ads.map((ad)=>(
          <div className="border border-orange">
            <p>{ad.adTitle}</p>
            <p>{ad.province},{ad.city}</p>
          </div>
        ))
       }
    </div>
  );
};
export default Home;
