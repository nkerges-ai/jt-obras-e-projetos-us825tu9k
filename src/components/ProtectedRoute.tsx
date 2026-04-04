import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Carregando Sistema...
      </div>
    )
  if (!user) return <Navigate to="/login" />

  return <>{children}</>
}
