import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CustomerManagement from './Component/CustomerManagement'

function App() {
  const [count, setCount] = useState(0)

  return (
        <CustomerManagement />
  )
}

export default App
