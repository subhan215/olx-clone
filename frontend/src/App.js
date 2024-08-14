import { Routes  ,Route} from 'react-router-dom';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import SignUp from './screens/SignUp';
import VehicleAd from './screens/adPostingScreens/vehicleAd';
import MobileAd from './screens/adPostingScreens/MobileAd';
import JobsAd from './screens/adPostingScreens/JobsAd';
import ServiceAd from './screens/adPostingScreens/ServiceAd';
import Profile from './screens/Profile';
import IndividualAd from './screens/IndividualAd';
import Chat from './screens/Chat';
import ChatDetail from './components/ChatDetail/ChatDetail';
import UpdateProfile from './screens/UpdateProfile'
import AllUserAds from './screens/AllUserAds';
//import './App.css';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path = "signin" element = {<SignIn />}/>
        <Route path = "home" element = {<Home />}/>
        <Route path = "signup" element = {<SignUp />}/>
        <Route path = "profile" element = {<Profile/>}/>
        <Route path = "chat" element = {<Chat/>}/>
        <Route path = "update-profile" element = {<UpdateProfile/>}/>
        <Route path = "my-ads" element = {<AllUserAds/>}/>
        <Route path="update-vehicle-ad/:adId" element={<VehicleAd />} />
        <Route path="update-mobile-ad/:adId" element={<MobileAd />} />
        <Route path="update-job-ad/:adId" element={<JobsAd/>} />
        <Route path="update-service-ad/:adId" element={<ServiceAd/>} />
        <Route path='sell'>
          <Route path='vehicle' element = {<VehicleAd />}/>
          <Route path='mobile' element = {<MobileAd />}/>
          <Route path='jobs' element = {<JobsAd />}/>
          <Route path='service' element = {<ServiceAd />}/>
        </Route>
        <Route path='individualAd' element = {<IndividualAd />}/>
      </Routes>
    </div>
  );
}

export default App;
