import { Routes  ,Route} from 'react-router-dom';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import SignUp from './screens/SignUp';
import VehicleAd from './screens/adPostingScreens/vehicleAd';
import MobileAd from './screens/adPostingScreens/MobileAd';
import JobsAd from './screens/adPostingScreens/JobsAd';
import ServiceAd from './screens/adPostingScreens/ServiceAd';
//import './App.css';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path = "signin" element = {<SignIn />}/>
        <Route path = "home" element = {<Home />}/>
        <Route path = "signup" element = {<SignUp />}/>
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
