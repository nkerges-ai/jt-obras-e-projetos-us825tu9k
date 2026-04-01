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
import TemplateEditor from './pages/admin/TemplateEditor'
import OSNREditor from './pages/admin/OSNREditor'
import PGREditor from './pages/admin/PGREditor'
import PrintReport from './pages/admin/PrintReport'
import PublicGallery from './pages/PublicGallery'
import PublicSignature from './pages/PublicSignature'
import ClientLogin from './pages/client/Login'
import ClientDashboard from './pages/client/Dashboard'
import EngineeringTemplateEditor from './pages/admin/EngineeringTemplateEditor'
import CertificateEditor from './pages/admin/CertificateEditor'
import FieldApp from './pages/FieldApp'
import { SyncManager } from './components/SyncManager'
import PublicDocument from './pages/PublicDocument'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <SyncManager />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/template/os-nr01" element={<OSNREditor />} />
          <Route path="/admin/template/certificado" element={<CertificateEditor />} />
          <Route path="/admin/template/:type" element={<TemplateEditor />} />
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
)

export default App
