import pb from '@/lib/pocketbase/client'

export interface SiteVideo {
  id: string
  title: string
  category?: string
  description?: string
  video_url?: string
  video_file?: string
  poster?: string
  active?: boolean
  order?: number
  created: string
  updated: string
}

export async function getSiteVideos(): Promise<SiteVideo[]> {
  try {
    const records = await pb.collection('site_videos').getFullList<SiteVideo>({
      filter: 'active = true',
      sort: 'order,created',
    })
    return records
  } catch (err) {
    console.warn('Falha ao carregar site_videos do PocketBase, usando lista padrão:', err)
    return []
  }
}

export function getFileUrl(record: SiteVideo, filename?: string): string {
  if (!filename) return ''
  return pb.files.getURL(record, filename)
}
