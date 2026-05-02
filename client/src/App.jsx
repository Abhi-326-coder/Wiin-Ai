import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import DashBoard from './pages/DashBoard'
import History from './pages/History'
import Settings from './pages/Settings'
import DashBoardLayout from './components/DashBoardLayout'

import {Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/dashboard' element={<DashBoardLayout />}>
            <Route index element={<DashBoard />} />
            <Route path='history' element={<History />} />
            <Route path='settings' element={<Settings />} />
          </Route>
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
