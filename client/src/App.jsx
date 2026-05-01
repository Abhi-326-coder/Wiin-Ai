import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'

import {Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
