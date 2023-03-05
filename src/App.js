import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import routes from './routes'

const router = createBrowserRouter(routes)

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
