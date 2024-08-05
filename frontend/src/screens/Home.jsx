import React, { useEffect, useState } from "react";
import { getCookie } from "../cookies/getCookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserDataWithRedux } from "../redux/slices/userData";
import Nav from "../components/Navbar/Nav";
import { setAdsDataWithRedux } from "../redux/slices/adsData";
import { getAllPosts } from "../functions/allPosts";
import Categories from "../components/Categories/Categories";
import { useNavigate } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { Carousel } from "primereact/carousel";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getCookie("token");
  const ads = useSelector((state) => state.adsData.data);
  const search = useSelector((state) => state.searchFilter.search);
  const province = useSelector((state) => state.locationData.province);
  const city = useSelector((state) => state.locationData.city);
  const [userLoginBool, setUserLoginBool] = useState(false);
  let user = useSelector((state) => state.userData.data);

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
  } else {
    ads.forEach((adObject) => {
      adObject.ads.forEach((ad) => {
        filteredAds.push(ad);
      });
    });
  }

  if (city) {
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

  const mobileAds = ads.filter((ad) => ad.model === "mobile");
  console.log(mobileAds);

  const handleChat= async (adId , adCategory)=>{
    try {
        const response = await fetch('http://localhost:8000/api/v1/chat/new',{
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ 
            adId:adId,
            adCategory: adCategory,
            user:user._id
          }),
        })
        const data = await response.json()
        console.log(data)
        if(data.success){
          navigate(`/chat/${data.chat._id}`)
        }else{
          alert(data.message)
        }
        
    } catch (error) {
      console.log(error)
    }
  }

  const adTemplate = (ad) => {
    const croppedDescription =
      ad?.description?.length > 100
        ? `${ad.description.substring(0, 100)}...`
        : ad.description;

    return (
      <div className="border rounded-lg overflow-hidden p-4 m-2 bg-gray-200">
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
          <button className="ml-4 p-2 border border-black rounded" onClick={()=> handleChat(ad._id , ad.category)}>Chat</button>
        </div>
      </div>
    );
  };

  return (
    <PrimeReactProvider>
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
        <div className="p-2">
          <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
            Services
          </p>
        </div>
        <div className="p-2">
          <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">Jobs</p>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default Home;
