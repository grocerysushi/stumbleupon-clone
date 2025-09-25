export interface LinkData {
  id: string
  url: string
  title: string
  description?: string
  domain: string
  image?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED'
  submittedBy: string
  createdAt: Date
  updatedAt: Date
  viewCount: number
  likeCount: number
  dislikeCount: number
  skipCount: number
  saveCount: number
}

export interface UserData {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface TopicData {
  id: string
  name: string
  slug: string
}

export interface EventData {
  id: string
  userId: string
  linkId: string
  action: 'VIEW' | 'LIKE' | 'DISLIKE' | 'SKIP' | 'SAVE' | 'SHARE'
  createdAt: Date
}

export interface CollectionData {
  id: string
  name: string
  description?: string
  userId: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StumbleResponse {
  link: LinkData & {
    topics: TopicData[]
  }
}