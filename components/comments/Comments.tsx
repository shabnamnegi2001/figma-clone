import React from 'react'
import { CommentsOverlay } from '@/components/comments/CommentsOverlay'
import { ClientSideSuspense } from '@liveblocks/react/suspense'

export const Comments = () => {
  return (
    <ClientSideSuspense fallback={null}>
        {() => <CommentsOverlay />}
    </ClientSideSuspense>
  )
}

