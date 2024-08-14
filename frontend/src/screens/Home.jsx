import React, { useEffect, useState } from "react";
import { getCookie } from "../cookies/getCookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserDataWithRedux } from "../redux/slices/userData";
import Nav from "../components/Navbar/Nav";
import { setAdsDataWithRedux } from "../redux/slices/adsData";
import { getAllPosts } from "../functions/allPosts";
import Categories from "../components/Categories/Categories";
import { PrimeReactProvider } from "primereact/api";
import { Carousel } from "primereact/carousel";
import { NavLink } from "react-router-dom";
import { setIndividualAdData } from "../redux/slices/individualAd";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setNotifications } from "../redux/slices/notifications";
import './Home.css'

const Home = () => {
  const dispatch = useDispatch();
  const token = getCookie("token");
  const ads = useSelector((state) => state.adsData.data);
  const search = useSelector((state) => state.searchFilter.search);
  const province = useSelector((state) => state.locationData.province);
  const user = useSelector((state) => state.userData.data);
  const city = useSelector((state) => state.locationData.city);
  const [userLoginBool, setUserLoginBool] = useState(false);
  const [filterBool , setFilterBool] = useState(false);

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 3,
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

  useEffect(() => {
    const getNotifications = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/chat/notifications/${userId}`
        );
        let data = await response.json();
        console.log(data);
        if (data.success) {
          dispatch(setNotifications({ payload: data.notifications }));
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (user && user._id) {
      setTimeout(() => {
        getNotifications(user._id);
      }, 500);
    }
  }, [user, dispatch]);

  let filteredAds = [];

  if (
    ["Sindh", "Punjab", "Balochistan", "KPK", "Kashmir"].includes(province) &&
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

  if (city && city !== "All Cities" && city !== "") {
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
  const vehicleAds = ads.filter((ad) => ad.model === "vehicle");
  const jobAds = ads.filter((ad) => ad.model === "jobs");
  const serviceAds = ads.filter((ad) => ad.model === "service");

  const adTemplate = (ad) => {
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    const maxTitleLength = 30;
    const croppedTitle =
      ad.adTitle.length > maxTitleLength
        ? `${ad.adTitle.substring(0, maxTitleLength)}...`
        : ad.adTitle;

    const croppedDescription =
      ad?.description?.length > 70
        ? `${ad.description.substring(0, 70)}...`
        : ad.description;

    const addAdDataToRedux = () => {
      dispatch(setIndividualAdData({ payload: ad }));
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
        if (data.success) {
          getAllPosts(dispatch);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }

    return (
      !ad.completed && (
        <div className="border rounded-lg overflow-hidden p-4 m-2 bg-gray-200">
          <div className="rounded-lg overflow-hidden p-4 m-2 bg-white border border-black">
            <div className="m-2">
              <FontAwesomeIcon icon={faHeart} size="xl" style={ad.likes.includes(user._id) ? { color: "red" } : {}} onClick={handleLike} />
            </div>
            <NavLink to="/individualAd" onClick={addAdDataToRedux} className="block no-underline text-black">
              <div className="rounded-lg h-48 bg-gray-200 flex items-center justify-center">
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
              <div className="p-4 mt-2 bg-white border-t border-black">
                <h3 className="text-lg font-bold mb-4">{croppedTitle}</h3>
                <div className="text-lg font-bold text-black">{ad.price} PKR</div>
                <div className="text-gray-600">{croppedDescription}</div>
                <div className="text-gray-600">{ad.city}, {ad.province}</div>
                <div className="text-gray-600">Posted on {formatDate(ad.createdAt)}</div>
              </div>
            </NavLink>
          </div>
        </div>
      )
    );
  };

  return (
    <PrimeReactProvider>
      {!filterBool ? (
        <div>
          <Nav />
          <Categories />
          <div className="p-4">
            <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
              Mobile Phones
            </p>
          </div>
          <div className="">
            {mobileAds[0]?.ads?.length > 0 ? (
              <Carousel
                value={mobileAds[0].ads}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                className="custom-carousel"
                circular
                autoplayInterval={3000}
                itemTemplate={adTemplate}
              />
            ) : (
              <p className="text-center mt-4">No Ads Found</p>
            )}
          </div>
          <div className="p-4">
            <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
              Vehicles
            </p>
          </div>
          <div className="">
            {vehicleAds[0]?.ads?.length > 0 ? (
              <Carousel
                value={vehicleAds[0].ads}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                className="custom-carousel"
                circular
                autoplayInterval={3000}
                itemTemplate={adTemplate}
              />
            ) : (
              <p className="text-center mt-4">No Ads Found</p>
            )}
          </div>
          <div className="p-4">
            <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
              Jobs
            </p>
          </div>
          <div className="">
            {jobAds[0]?.ads?.length > 0 ? (
              <Carousel
                value={jobAds[0].ads}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                className="custom-carousel"
                circular
                autoplayInterval={3000}
                itemTemplate={adTemplate}
              />
            ) : (
              <p className="text-center mt-4">No Ads Found</p>
            )}
          </div>
          <div className="p-4">
            <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
              Services
            </p>
          </div>
          <div className="">
            {serviceAds[0]?.ads?.length > 0 ? (
              <Carousel
                value={serviceAds[0].ads}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                className="custom-carousel"
                circular
                autoplayInterval={3000}
                itemTemplate={adTemplate}
              />
            ) : (
              <p className="text-center mt-4">No Ads Found</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Nav />
          <Categories />
          <p className="ml-10 mt-4 text-gray-700 text-3xl font-bold">
            Ads
          </p>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {filteredAds.map((ad) => adTemplate(ad))}
          </div>
        </div>
      )}
    </PrimeReactProvider>
  );
}

export default Home;
