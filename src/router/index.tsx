import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './Routes'

// createBrowserRouter 刷新后就没了，

const router = createBrowserRouter(routes)

const RouterIndex = () => {
  return <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
}

export default RouterIndex