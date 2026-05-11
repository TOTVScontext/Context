import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./routes/Home"
import Login from "./routes/Login"
import ChangeIcon from './hooks/ChangeIcon'
import { ConsoleBanner } from "./hooks/ConsoleBanner"
import ProtectedRoute from "./routes/ProtectedRoute"
import Chat from "./routes/Chat"
import NewChat from "./components/chat/NewChat"
import ActiveChat from "./components/chat/ActiveChat"
import Profile from "./routes/Profile"
import Welcome from "./routes/Welcome"

function App() {

  ConsoleBanner();
  ChangeIcon();

  const isFirstLogin = Boolean(localStorage.getItem("first_login"))

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={`${isFirstLogin == false ? '/welcome' : '/home'}`} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/chat' element={<Chat />} >
            <Route index element={<Navigate to='new' />} />
            <Route path='new' element={<NewChat />} />
            <Route path=':id' element={<ActiveChat />} />
          </Route>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
