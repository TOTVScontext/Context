import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ChangeIcon from './hooks/ChangeIcon'
import { ConsoleBanner } from "./hooks/ConsoleBanner"

function App() {
  
  ConsoleBanner();
  ChangeIcon();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
