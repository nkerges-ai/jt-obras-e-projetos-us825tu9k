import pb from '@/lib/pocketbase/client'

export interface CloudProject {
  id: string
  client_id: string
  name: string
  start_date: string
  deadline_days: number
  total_value: number
  description?: string
  status: string
  address_street: string
  address_number: string
  address_complement?: string
  address_city: string
  address_state: string
  address_zip: string
}

export const getCloudProjects = async () => {
  return pb.collection('projects').getFullList<CloudProject>({ sort: '-created' })
}

export const getCloudProject = async (id: string) => {
  return pb.collection('projects').getOne<CloudProject>(id)
}

export const createCloudProject = async (data: Partial<CloudProject>) => {
  return pb.collection('projects').create<CloudProject>(data)
}

export const updateCloudProject = async (id: string, data: Partial<CloudProject>) => {
  return pb.collection('projects').update<CloudProject>(id, data)
}

export const deleteCloudProject = async (id: string) => {
  return pb.collection('projects').delete(id)
}
