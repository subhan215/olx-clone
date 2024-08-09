import React, { useEffect, useState } from "react";
import { getCookie } from "../cookies/getCookie";
import { useDispatch, useSelector } from "react-redux";
import userData, { setUserDataWithRedux } from "../redux/slices/userData";
import Nav from "../components/Navbar/Nav";
import { setAdsDataWithRedux } from "../redux/slices/adsData";
import { getAllPosts } from "../functions/allPosts";
import Categories from "../components/Categories/Categories";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";
import { NavLink } from "react-router-dom";
import { setIndividualAdData } from "../redux/slices/individualAd";
import JobsAd from "./adPostingScreens/JobsAd";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setNotifications } from "../redux/slices/notifications";

const Home = () => {
  const dispatch = useDispatch();
  const token = getCookie("token");
  const ads = useSelector((state) => state.adsData.data);
  const search = useSelector((state) => state.searchFilter.search);
  const province = useSelector((state) => state.locationData.province);
  let user = useSelector((state) => state.userData.data);
  const city = useSelector((state) => state.locationData.city);
  const [userLoginBool, setUserLoginBool] = useState(false);
  const [filterBool , setFilterBool] = useState(false)
  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/users/getUser",
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ token }),
          }
        );
        let data = await response.json();
        console.log(data);
        if (data.success) {
          setUserLoginBool(true);
          dispatch(setUserDataWithRedux({ payload: data.data }));
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAllPosts(dispatch);
   
    if (token) {
      verifyToken();
    }
  }, [token, dispatch]);
   useEffect(()=> {
    const getNotifications = async (userId) => {
      console.log(userId)
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/chat/notifications/${userId}`
        );
        let data = await response.json();
        console.log(data);
        if (data.success) {
          console.log(data.notifications)
          dispatch(setNotifications({ payload: data.notifications }));
        } else {
          //alert(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    console.log(user._id)
    setTimeout(()=> {
      if(user) {
        getNotifications(user._id)
      }
     
    } , 500) 
   } )
  let filteredAds = [];
  
  if (
    (province === "Sindh" ||
      province === "Punjab" ||
      province === "Balochistan" ||
      province === "KPK" ||
      province === "Kashmir") &&
    province
  ) {
    ads.forEach((adObject) => {
      adObject.ads.forEach((ad) => {
        if (ad.province === province) {
          console.log("filtering on province");
          filteredAds.push(ad);
        }
      });
    });
    //setFilterBool(true)
  } else {
    ads.forEach((adObject) => {
      adObject.ads.forEach((ad) => {
        filteredAds.push(ad);
      });
    });
  }

  if (city && city!=="All Cities" && city !== "") {
    filteredAds = filteredAds.filter((ad) => ad.city === city);
    
  }

  filteredAds = filteredAds.filter(
    (ad) =>
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
  useEffect(() => {
    if (
        (search && search !== "") ||
        (province && province !== "" && province !== "All Over Pakistan") ||
        (city && city !== "" && city !== "All Cities")
    ) {
        setFilterBool(true);
    } else {
        setFilterBool(false);
    }
}, [search, city, province]);
  

  const mobileAds = ads.filter((ad) => ad.model === "mobile");
  console.log(mobileAds);
  const vehicleAds = ads.filter((ad)=> ad.model === "vehicle")
  console.log(vehicleAds)
  const jobAds = ads.filter((ad)=> ad.model === "jobs")
  console.log(jobAds)
  const serviceAds = ads.filter((ad)=> ad.model === "service")
  console.log(serviceAds)

  const adTemplate = (ad) => {
    const croppedDescription =
      ad?.description?.length > 100
        ? `${ad.description.substring(0, 100)}...`
        : ad.description;

    const addAdDataToRedux = () => {
      dispatch(setIndividualAdData({ payload: ad }))
    }
    const handleLike = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/posts/${ad._id}/like`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ userId: user._id }),
          }
        );
        let data = await response.json();
        console.log(data);
        if (data.success) {
          getAllPosts(dispatch)
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
    return (<>
     
        <div className="border rounded-lg overflow-hidden p-4 m-2 bg-gray-200">
          <div>
            <FontAwesomeIcon icon={faHeart} style={ad.likes.includes(user._id) ? {color: "red"} : "" } onClick={handleLike}/>
          </div>
          <NavLink to="/individualAd"  onClick={addAdDataToRedux} className="block no-underline text-black">
          <div className="rounded h-48 bg-gray-200 flex items-center justify-center">
            {ad?.imagesURL?.length > 0 ? (
              <img
                src={ad.imagesURL[0]}
                alt={ad.adTitle}
                className="h-full object-contain border rounded"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <span>No Image Available</span>
              </div>
            )}
          </div>
          <div className="p-4">

            <h4 className="text-lg font-semibold mb-2">{ad.brand}</h4>
            <h3 className="text-lg font-semibold mb-2">{ad.adTitle}</h3>
            <p className="text-gray-600 mb-4">{croppedDescription}</p>
            <span className="text-lg font-bold text-orange-600">{ad.price} </span>
            <span>PKR</span>
          </div>
        
      </NavLink>
      </div>
      </>);
  };

  return (<PrimeReactProvider>
      {!filterBool  ? ( 
      <div>
        <Nav />
        <Categories />

        <div className="p-2">
          <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
            Mobile Phones
          </p>
        </div>
        <div className="card">
          {mobileAds[0]?.ads?.length > 0 ? (
            <Carousel
              value={mobileAds[0].ads}
              numScroll={1}
              numVisible={3}
              responsiveOptions={responsiveOptions}
              itemTemplate={adTemplate}
            />
          ) : (
            <div>No ads available</div>
          )}
        </div>

        <div className="p-2">
          <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">Cars</p>
        </div>
        <div className="card">
          {vehicleAds[0]?.ads?.length > 0 ? (
            <Carousel
              value={vehicleAds[0].ads}
              numScroll={1}
              numVisible={3}
              responsiveOptions={responsiveOptions}
              itemTemplate={adTemplate}
            />
          ) : (
            <div>No ads available</div>
          )}
        </div>

        <div className="p-2">
          <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
            Services
          </p>
        </div>
        {serviceAds[0]?.ads?.length > 0 ? (
            <Carousel
              value={serviceAds[0].ads}
              numScroll={1}
              numVisible={3}
              responsiveOptions={responsiveOptions}
              itemTemplate={adTemplate}
            />
          ) : (
            <div>No ads available</div>
          )}
        <div className="p-2">
          <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">Jobs</p>
        </div>
        {jobAds[0]?.ads?.length > 0 ? (
            <Carousel 
              value={jobAds[0].ads}
              numScroll={1}
              numVisible={3}
              responsiveOptions={responsiveOptions}
              itemTemplate={adTemplate}
            />
          ) : (
            <div>No ads available</div>
          )}
      </div>
   
  ):<div>
    <Nav />
    <Categories />
  <Carousel 
  value={filteredAds}
  numScroll={1}
  numVisible={3}
  responsiveOptions={responsiveOptions}
  itemTemplate={adTemplate}
/>
</div> }
  </PrimeReactProvider>

  );
};

export default Home;
