import pb from '@/lib/pocketbase/client'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  tax_id: string
  type: 'PF' | 'PJ'
  address_street: string
  address_number: string
  address_complement: string
  address_city: string
  address_state: string
  address_zip: string
  created: string
  updated: string
}

export const getCustomers = () =>
  pb.collection('customers').getFullList<Customer>({ sort: '-created' })
export const createCustomer = (data: Partial<Customer>) =>
  pb.collection('customers').create<Customer>(data)
export const updateCustomer = (id: string, data: Partial<Customer>) =>
  pb.collection('customers').update<Customer>(id, data)
export const deleteCustomer = (id: string) => pb.collection('customers').delete(id)
