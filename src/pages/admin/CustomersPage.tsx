import { CustomersTab } from './components/CustomersTab'

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 mt-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
        <p className="text-gray-500 mt-2">
          Área administrativa para gerenciamento da base de clientes.
        </p>
      </div>
      <CustomersTab />
    </div>
  )
}
