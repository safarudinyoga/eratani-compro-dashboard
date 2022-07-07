import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import withUserState from '../context/withUserState';
import App from '../App';
import PrivateRouter from './private-router';
import NotFound from '../pages/not-found';
import Login from '../pages/login';
import Blog from '../pages/blog';
import Career from '../pages/career';
import Event from '../pages/event';
import BlogDetail from '../pages/blog/blog-detail';
import CareerDetail from '../pages/career/career-detail';
import EventDetail from '../pages/event/event-detail';
import FormBlog from '../pages/blog/form-blog';

const publicRoute = [
  // all public route
  { path: '/login', element: <Login /> },
  { path: '/', element: <Login /> },
  { path: '/home', element: <App /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:id', element: <BlogDetail /> },
  { path: '/blog/form/*', element: <FormBlog /> },
  { path: '/career', element: <Career /> },
  { path: '/career/:id', element: <CareerDetail /> },
  { path: '/event', element: <Event /> },
  { path: '/event/:id', element: <EventDetail /> },
]

const privateRoute = [

]

const publicRouting = publicRoute.map((props, key) => (
  <Route
    {...props}
    key={key}
  />
));

const privateRouting = privateRoute.map((props, key) => (
  <PrivateRouter
    {...props}
    key={key}
  />
));

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        {publicRouting}
        {/* {privateRouting} */}
        <Route element={NotFound} path='*' />
      </Routes>
    </Router>
  )
}

export default withUserState(AppRoute)