import pb from '@/lib/pocketbase/client'
import type { Customer } from './customers'

export interface CloudProject {
  id: string
  client_id: string
  name: string
  address: string
  start_date: string
  deadline_days: number
  total_value: number
  description: string
  status: 'Planning' | 'In Execution' | 'Paused' | 'Completed'
  created: string
  updated: string
  expand?: {
    client_id: Customer
  }
}

export const getCloudProjects = () =>
  pb.collection('projects').getFullList<CloudProject>({ expand: 'client_id', sort: '-created' })
export const createCloudProject = (data: Partial<CloudProject>) =>
  pb.collection('projects').create<CloudProject>(data)
export const updateCloudProject = (id: string, data: Partial<CloudProject>) =>
  pb.collection('projects').update<CloudProject>(id, data)
export const deleteCloudProject = (id: string) => pb.collection('projects').delete(id)
