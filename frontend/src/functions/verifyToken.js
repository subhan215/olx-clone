import { getCookie } from "../cookies/getCookie";
import { setUserDataWithRedux } from "../redux/slices/userData";


const verifyToken = async (dispatch) => {
    let token = getCookie("token");
    if(token) {
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
        dispatch(setUserDataWithRedux({ payload: data.data }));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
}
  };
  export {verifyToken}