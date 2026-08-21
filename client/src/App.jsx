import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '@/components/ScrollToTop'
import useMeStore from '@/zustand/useMeStore'

const App = () => {
  const { token, me, fetchMe } = useMeStore()

  useEffect(() => {
    if (token && !me) fetchMe()
  }, [token, me, fetchMe])

  return (
    <main>
      <ScrollToTop />
      <Outlet />
    </main>
  )
}

export default App
