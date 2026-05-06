import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import History from './pages/History'
import Settings from './pages/Settings'
import DashBoardLayout from './components/DashBoardLayout'
import Chat from './pages/Chat'
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from './store/useAuthStore'

import {Routes, Route, Navigate} from 'react-router-dom'
import { useEffect } from 'react'

function App() {

  const {authUser , isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth])

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/dashboard' element={authUser ? <DashBoardLayout/> : <Navigate to='/login'  />}>
            <Route index element={<Chat />} />
            <Route path='history' element={<History />} />
            <Route path='settings' element={<Settings />} />
          </Route>
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/dashboard'  />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/dashboard'  />} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App
