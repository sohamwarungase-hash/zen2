import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { Toaster } from '@/components/ui/toaster'
import { SocketProvider } from '@/contexts/SocketContext'

function App() {
  return (
    <SocketProvider>
      <RouterProvider router={router} />
      <Toaster />
    </SocketProvider>
  )
}

export default App
