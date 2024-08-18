import { setAdsDataWithRedux } from "../../redux/slices/adsData";

const getAllPosts = async (dispatch, ads = [], page = 1, pageSize = 10) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/posts/?page=${page}&pageSize=${pageSize}`
    );
    const data = await response.json();
    if (data.success) {
      // Merge the new ads with the existing ones for each model without duplicates
      const updatedAds = data.adsData.map((newAds) => {
        const existingAds = ads.find((ad) => ad.model === newAds.model);
        if (existingAds) {
          const existingAdIds = new Set(existingAds.ads.map((ad) => ad._id));
          const filteredNewAds = newAds.ads.filter((ad) => !existingAdIds.has(ad._id));
          return { ...existingAds, ads: [...existingAds.ads, ...filteredNewAds] };
        } else {
          return newAds;
        }
      });

      dispatch(setAdsDataWithRedux({ payload: updatedAds }));
    } else {
      console.error("Failed to fetch ads");
    }
  } catch (err) {
    console.error(err);
  }
};

export { getAllPosts };
