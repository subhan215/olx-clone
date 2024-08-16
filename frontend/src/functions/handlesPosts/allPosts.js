import { setAdsDataWithRedux } from "../../redux/slices/adsData"


const getAllPosts = async (dispatch) => {
     try {
        const response = await fetch('http://localhost:8000/api/v1/posts/' , {
          headers : {
             'Content-Type' : "application/json"
          } , 
           method: "GET"
        })
        let data = await response.json()
        console.log(data)
        if(data.success) {
            dispatch(setAdsDataWithRedux({payload:data.adsData })) 
        }
        else {
            alert(data.message)
        }
      }
      catch(err) {
          console.log(err)
      }
     }
export {getAllPosts} 