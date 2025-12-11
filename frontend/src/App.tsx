import { AuthProvider } from './contexts/authContext'
//import Layout from './layouts/default'
import Layout from './layouts/admin'
import './app.css'

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )
}

export default App
