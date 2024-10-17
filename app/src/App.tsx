// import { useState } from 'react'
// import { Button } from '@mui/material'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Login from './sign-in/login.tsx'
import UserSection from './stat-screens/user_section.tsx'
import { UserProvider } from './UserContext.tsx'
import './App.css'

function App() {

  return (
    <div className="App">
      <UserProvider>
        <Login />
        <UserSection />
      </UserProvider>
    </div>
  )
}

export default App
