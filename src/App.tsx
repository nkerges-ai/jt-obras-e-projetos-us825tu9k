import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'
import { Layout } from './components/Layout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import CustomersPage from './pages/admin/CustomersPage'
import ProjectsPage from './pages/admin/ProjectsPage'
import TemplateEditor from './pages/admin/TemplateEditor'
import OSNREditor from './pages/admin/OSNREditor'
import PGREditor from './pages/admin/PGREditor'
import PrintReport from './pages/admin/PrintReport'
import PublicGallery from './pages/PublicGallery'
import PublicSignature from './pages/PublicSignature'
import ClientLogin from './pages/client/Login'
import ClientDashboard from './pages/client/Dashboard'
import EngineeringTemplateEditor from './pages/admin/EngineeringTemplateEditor'
import ContractEditor from './pages/admin/ContractEditor'
import BudgetEditor from './pages/admin/BudgetEditor'
import LetterheadEditor from './pages/admin/LetterheadEditor'
import CertificateEditor from './pages/admin/CertificateEditor'
import FieldApp from './pages/FieldApp'
import { SyncManager } from './components/SyncManager'
import PublicDocument from './pages/PublicDocument'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// New Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Certificates from './pages/Certificates'
import AttendanceLists from './pages/AttendanceLists'
import Contracts from './pages/Contracts'
import Budgets from './pages/Budgets'
import Evidence from './pages/Evidence'
import Profile from './pages/Profile'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <SyncManager />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* New unified auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* New unified dashboard layout protected */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/certificados" element={<Certificates />} />
            <Route path="/listas-presenca" element={<AttendanceLists />} />
            <Route path="/contratos" element={<Contracts />} />
            <Route path="/orcamentos" element={<Budgets />} />
            <Route path="/evidencias" element={<Evidence />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/clientes" element={<CustomersPage />} />
            <Route path="/admin/projetos" element={<ProjectsPage />} />
            <Route path="/admin/template/os-nr01/:id?" element={<OSNREditor />} />
            <Route path="/admin/template/certificado/:id?" element={<CertificateEditor />} />
            <Route path="/admin/template/contrato/:id?" element={<ContractEditor />} />
            <Route path="/admin/template/orcamento/:id?" element={<BudgetEditor />} />
            <Route path="/admin/template/timbrado/:id?" element={<LetterheadEditor />} />
            <Route path="/admin/template/nr18/:id?" element={<CertificateEditor />} />
            <Route path="/admin/acervo/template/:type" element={<EngineeringTemplateEditor />} />
            <Route path="/admin/acervo/pgr" element={<PGREditor />} />
            <Route path="/cliente/login" element={<ClientLogin />} />
            <Route path="/cliente/dashboard" element={<ClientDashboard />} />
          </Route>
          {/* Route without global layout for public gallery, field app and printing views */}
          <Route path="/campo" element={<FieldApp />} />
          <Route path="/projeto/:id/galeria" element={<PublicGallery />} />
          <Route path="/admin/print/:type/:id" element={<PrintReport />} />
          <Route path="/assinatura/:id" element={<PublicSignature />} />
          <Route path="/publico/documento/:token" element={<PublicDocument />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
