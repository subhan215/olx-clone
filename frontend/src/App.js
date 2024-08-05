import { Routes  ,Route} from 'react-router-dom';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import SignUp from './screens/SignUp';
import VehicleAd from './screens/adPostingScreens/vehicleAd';
import MobileAd from './screens/adPostingScreens/MobileAd';
import JobsAd from './screens/adPostingScreens/JobsAd';
import ServiceAd from './screens/adPostingScreens/ServiceAd';
import Profile from './screens/Profile';
import Chat from './screens/Chat';

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
        <Route path='sell'>
          <Route path='vehicle' element = {<VehicleAd />}/>
          <Route path='mobile' element = {<MobileAd />}/>
          <Route path='jobs' element = {<JobsAd />}/>
          <Route path='service' element = {<ServiceAd />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
