import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRouter from './private-router';
import NotFound from '../pages/not-found';
import Login from '../pages/login';
import Blog from '../pages/blog';
import withUserState from '../context/withUserState';
import App from '../App';

const publicRoute = [
  // all public route
  { path: '/login', element: <Login /> },
  { path: '/', element: <Login /> },
  { path: '/blog', element: <Blog /> },
  { path: '/home', element: <App /> },
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