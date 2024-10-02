import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/sideBar';
import Header from './components/header';
import { useEffect, useState } from 'react';

const App = () => {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(location.pathname === '/');
  const { id } = useParams();
  
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = `StudyStorm | Home`;
        break;
      case '/instructor/courses':
      case '/admin/courses':
        document.title = `StudyStorm | Courses`;
        break;
      case `/instructor/courses/${id}`:
      case `/admin/courses/${id}`:
        document.title = `StudyStorm | Course`;
        break;
      case '/instructor/courses/create':
        document.title = `StudyStorm | Add Course`;
        break;
        case `/instructor/courses/update/${id}`:
          document.title = `StudyStorm | Update Course`;
          break;
      case '/login':
        document.title = `StudyStorm | Login`;
        break;
      case '/register':
        document.title = `StudyStorm | Register`;
        break;
      case '/learner':
      case '/admin':
      case '/instrutor':
        document.title = `StudyStorm | Profile`;
        break;
      case '/forgotpassword':
        document.title = `StudyStorm | Forgot Password`;
        break;
      default:
        document.title = `StudyStorm | 404 Not Found`;
        break;
    }

    if (location.pathname.includes('/admin') || location.pathname.includes('/instructor') || location.pathname.includes('/learner')) {
      setShowHeader(false);
    } else { 
      setShowHeader(true);
    }

  }, [location.pathname]);

  return (
    <>
      <ToastContainer />
      <Container className='mw-100 py-0 px-0' id="main" style={{position:'fixed', minHeight:'100vh', width:'100%', height:'100%', overflow:'auto', display:'flex', background:'rgb(246 245 238)'}}>
        {showHeader ? <Header /> : <Sidebar />}        
        <Outlet />
      </Container>
    </>
  );
};

export default App;