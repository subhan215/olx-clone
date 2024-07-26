import { Routes  ,Route} from 'react-router-dom';
import SignIn from './screens/SignIn';
//import './App.css';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path = "signin" element = {<SignIn />}/>
      </Routes>
    </div>
  );
}

export default App;
