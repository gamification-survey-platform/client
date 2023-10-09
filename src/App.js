import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import routes from './routes'
import React, { useState } from 'react';
import Joyride from 'react-joyride';

const router = createBrowserRouter(routes)

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
