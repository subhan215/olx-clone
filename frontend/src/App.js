import { Routes  ,Route} from 'react-router-dom';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import SignUp from './screens/SignUp';
//import './App.css';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path = "signin" element = {<SignIn />}/>
        <Route path = "home" element = {<Home />}/>
        <Route path = "signup" element = {<SignUp />}/>
      </Routes>
    </div>
  );
}

export default App;
