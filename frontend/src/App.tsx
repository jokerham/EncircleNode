import { AuthProvider } from './contexts/authContext'
import DynamicRouter from './DynamicRouter'
import './app.css'

function App() {
  return (
    <AuthProvider>
      <DynamicRouter />
    </AuthProvider>
  )
}

export default App
