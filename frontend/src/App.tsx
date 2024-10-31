import CreateCategories from './components/CreateCategories';
import TaskForm from './components/TaskForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './pages/Header/Navbar';
import Tasks from './pages/Tasks';
import Category from './pages/Category';
import TaskDetails from './pages/TaskDetails';


function App() {
  return (
    <Router>
      <Navbar /> {/* Directly include Navbar here */}
      <div className="mt-16 p-4"> {/* Apply top margin to content */}
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/createcategory' element={<CreateCategories/>} />
          <Route path='/taskform/:taskId?' element={<TaskForm/>} />
          <Route path='/tasks' element={<Tasks/>} />
          <Route path='/categories' element={<Category/>} />
          <Route path='/details/:taskId' element={<TaskDetails/>}/>
        </Routes>    
      </div>
    </Router>
  );
}

export default App;
