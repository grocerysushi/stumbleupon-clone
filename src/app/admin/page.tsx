'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [url, setUrl] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const availableTopics = [
    'technology', 'science', 'programming', 'design', 'art', 'photography',
    'music', 'gaming', 'humor', 'news', 'education', 'business',
    'health', 'food', 'travel', 'sports'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url.trim(),
          userId: 'test-user', // TODO: Replace with actual user ID
          topics: topics
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`✅ Successfully added site! Status: ${result.status}`)
        setUrl('')
        setTopics([])
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Failed to add site: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTopic = (topic: string) => {
    setTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Add New Site to StumbleUpon Clone
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stumble-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Topics ({topics.length} selected)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableTopics.map(topic => (
                  <label key={topic} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={topics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-stumble-orange hover:bg-orange-600 text-white'
              }`}
            >
              {isSubmitting ? 'Adding Site...' : 'Add Site'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-md ${
              message.startsWith('✅')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Examples to Try:
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• <code>https://www.wikipedia.org</code> - education</div>
              <div>• <code>https://www.youtube.com</code> - education,music</div>
              <div>• <code>https://www.netflix.com</code> - entertainment</div>
              <div>• <code>https://www.spotify.com</code> - music</div>
              <div>• <code>https://www.medium.com</code> - education,business</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}