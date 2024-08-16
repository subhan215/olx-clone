import { removeCookie } from "../../cookies/removeCookie"
import { setUserDataWithRedux } from "../../redux/slices/userData"

const handleLogOut =  async (dispatch, setIsLogOutBool) => {
    removeCookie("token")
    dispatch(setUserDataWithRedux({payload: {}}))
    setIsLogOutBool(true)
}
export {handleLogOut}