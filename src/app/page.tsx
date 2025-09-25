'use client'

import { useState } from 'react'
import { StumbleResponse } from '@/types'

export default function Home() {
  const [currentLink, setCurrentLink] = useState<StumbleResponse['link'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStumble = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/stumble')
      if (!response.ok) {
        throw new Error('Failed to fetch link')
      }
      const data: StumbleResponse = await response.json()
      setCurrentLink(data.link)
    } catch (error) {
      console.error('Failed to stumble:', error)
      setError('Failed to load a new link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (action: 'like' | 'dislike' | 'skip' | 'save') => {
    if (!currentLink) return

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          linkId: currentLink.id,
          userId: 'test-user', // TODO: Replace with actual user ID from auth
          action: action.toUpperCase()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send feedback')
      }

      console.log(`Feedback sent: ${action} for link ${currentLink.id}`)
    } catch (error) {
      console.error('Failed to send feedback:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Something New
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Click stumble to find interesting content from around the web
          </p>

          <button
            onClick={handleStumble}
            disabled={isLoading}
            className={`stumble-button ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Stumbling...' : 'Stumble!'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {currentLink && (
          <div className="link-card max-w-2xl mx-auto">
            {currentLink.image && (
              <img
                src={currentLink.image}
                alt={currentLink.title}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentLink.title}
                </h2>
                <p className="text-gray-600 mb-2">{currentLink.description}</p>
                <p className="text-sm text-gray-500">{currentLink.domain}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFeedback('like')}
                    className="bg-stumble-green hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    👍 Like
                  </button>
                  <button
                    onClick={() => handleFeedback('dislike')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    👎 Dislike
                  </button>
                  <button
                    onClick={() => handleFeedback('skip')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    ⏭️ Skip
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFeedback('save')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    💾 Save
                  </button>
                  <a
                    href={currentLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    🔗 Visit
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}