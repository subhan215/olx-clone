import { getAllPosts } from "./allPosts";


const handleLike = async (dispatch , ad , user) => {
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
export {handleLike}  