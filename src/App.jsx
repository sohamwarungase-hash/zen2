import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { Toaster } from '@/components/ui/toaster'
import { SocketProvider } from '@/contexts/SocketContext'
import AuthBootstrap from '@/components/AuthBootstrap'

function App() {
  return (
    <SocketProvider>
      <AuthBootstrap>
        <RouterProvider router={router} />
        <Toaster />
      </AuthBootstrap>
    </SocketProvider>
  )
}

export default App
