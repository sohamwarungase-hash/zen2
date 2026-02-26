import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { Toaster } from '@/components/ui/toaster'
import { initAuthListener } from '@/store/authStore'
import { SocketProvider } from '@/contexts/SocketContext'

function App() {
  useEffect(() => {
    // Start listening for Supabase auth events (token refresh, sign out)
    const unsubscribe = initAuthListener()
    return () => unsubscribe()
  }, [])

  return (
    <SocketProvider>
      <RouterProvider router={router} />
      <Toaster />
    </SocketProvider>
  )
}

export default App
