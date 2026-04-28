import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./routes/Home"
import Login from "./routes/Login"
import ChangeIcon from './hooks/ChangeIcon'
import { ConsoleBanner } from "./hooks/ConsoleBanner"
import ProtectedRoute from "./routes/ProtectedRoute"
import Chat from "./routes/Chat"

function App() {

  ConsoleBanner();
  ChangeIcon();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/chat' element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
