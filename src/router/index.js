import { Route, Routes } from 'react-router-dom'
import withUserState from '../context/withUserState';
import App from '../App';
import PrivateRoute from './private-router';
import NotFound from '../pages/not-found';
import Login from '../pages/login';
import Blog from '../pages/blog';
import Career from '../pages/career';
import Event from '../pages/event';
import BlogDetail from '../pages/blog/blog-detail';
import CareerDetail from '../pages/career/career-detail';
import EventDetail from '../pages/event/event-detail';
import FormBlog from '../pages/blog/form-blog';
import FormCareer from '../pages/career/form-career';
import FormEvent from '../pages/event/form-event';
import MapManagement from '../pages/map';

const publicRoute = [
  // all public route
  { path: '/login', element: <Login /> },
  { path: '/', element: <Login /> },
]

const privateRoute = [
  { path: '/home', element: <App /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:id', element: <BlogDetail /> },
  { path: '/blog/form', element: <FormBlog /> },
  { path: '/blog/form/:url', element: <FormBlog /> },
  { path: '/career', element: <Career /> },
  { path: '/career/:id', element: <CareerDetail /> },
  { path: '/career/form', element: <FormCareer /> },
  { path: '/career/form/:url', element: <FormCareer /> },
  { path: '/event', element: <Event /> },
  { path: '/event/:id', element: <EventDetail /> },
  { path: '/event/form', element: <FormEvent /> },
  { path: '/event/form/:url', element: <FormEvent /> },
  { path: '/map', element: <MapManagement /> },
]

const publicRouting = publicRoute.map((props, key) => (
  <Route
    {...props}
    key={key}
  />
));

const privateRouting = privateRoute.map((props, key) => (
    <Route
      {...props}
      key={key}
    />
));

const AppRoute = () => {
  return (
    <Routes>
      {publicRouting}
      <Route path='/' element={<PrivateRoute/>}>
        {privateRouting}
      </Route>
      <Route element={NotFound} path='*' />
    </Routes>
  )
}

export default withUserState(AppRoute)