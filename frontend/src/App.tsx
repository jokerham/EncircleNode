import { AuthProvider } from './contexts/authContext'
import Layout from './layouts/default'

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )
}

export default App
