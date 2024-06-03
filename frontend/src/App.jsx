import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import {
  Test,
  Login, 
  Register,
  Settings
} from './pages'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/settings" element={<Settings/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
