import pb from '@/lib/pocketbase/client'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  tax_id: string
  type: string
  address_street: string
  address_number: string
  address_complement?: string
  address_city: string
  address_state: string
  address_zip: string
}

export const getCustomers = async () => {
  return pb.collection('customers').getFullList<Customer>({ sort: '-created' })
}

export const getCustomer = async (id: string) => {
  return pb.collection('customers').getOne<Customer>(id)
}

export const createCustomer = async (data: Partial<Customer>) => {
  return pb.collection('customers').create<Customer>(data)
}

export const updateCustomer = async (id: string, data: Partial<Customer>) => {
  return pb.collection('customers').update<Customer>(id, data)
}

export const deleteCustomer = async (id: string) => {
  return pb.collection('customers').delete(id)
}
