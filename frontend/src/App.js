import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavbarComponent from './components/navbar/navbar';
import Home from './pages/home';

function App() {
  return (
      <>
        <NavbarComponent/>
        <Home/>
      </>
  );
}

export default App;
