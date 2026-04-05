import { CustomersTab } from './components/CustomersTab'

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <div className="container mx-auto py-8 px-4 md:px-6 pt-24 md:pt-8 pb-28">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Gestão de Clientes</h1>
          <p className="text-slate-400 mt-2">
            Área administrativa para gerenciamento da base de clientes.
          </p>
        </div>
        <CustomersTab />
      </div>
    </div>
  )
}
