import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import ProblemDescription from './pages/Description/ProblemDescription';
import ProblemList from './pages/ProblemList/ProblemList';
import LandingPage from './pages/Home/LandingPage';

function App() {


  return (
    <div className='h-[100vh] '>
      <Navbar />
      <Routes>
        <Route path='/problems' element={<ProblemList />} />
        <Route path='/problems/:problemId' element={ <ProblemDescription  />} />
        <Route path='/' element={ <LandingPage  />} />
      </Routes>
    </div>
  );
}

export default App;
