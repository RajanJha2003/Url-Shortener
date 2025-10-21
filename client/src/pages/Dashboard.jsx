import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createShortUrl, fetchUserUrls, clearError, clearSuccess } from '../store/slices/urlSlice'
import { Link2, Copy, CheckCircle, Plus, ExternalLink, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [longUrl, setLongUrl] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { urls, loading, fetchLoading, error, success } = useSelector((state) => state.url)

  useEffect(() => {
    // Fetch user URLs when component mounts
    dispatch(fetchUserUrls())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      toast.success(success)
      setLongUrl('')
      setShowForm(false)
      dispatch(clearSuccess())
    }
  }, [success, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!longUrl.trim()) {
      toast.error('Please enter a valid URL')
      return
    }

    try {
      new URL(longUrl)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    dispatch(createShortUrl(longUrl))
  }

  const copyToClipboard = async (shortUrl, index) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedIndex(index)
      toast.success('URL copied to clipboard!')
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      toast.error('Failed to copy URL')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>
              Welcome back, {user?.userName || 'User'}!
            </h1>
            <p style={{ color: '#666' }}>Manage your shortened URLs</p>
          </div>
          
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              New URL
            </button>
          )}
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '2rem', background: '#f8f9fa' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Create Short URL</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="longUrl">Enter your long URL</label>
                <input
                  type="url"
                  id="longUrl"
                  className="form-control"
                  placeholder="https://example.com/very-long-url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Short URL'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setLongUrl('')
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#333', margin: 0 }}>Your URLs</h2>
            {urls.length > 0 && (
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                {urls.length} URL{urls.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {fetchLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div>Loading your URLs...</div>
            </div>
          ) : urls.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <Link2 size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No URLs created yet</p>
              <p style={{ fontSize: '0.9rem' }}>Create your first short URL to get started</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {urls.map((url, index) => (
                <div 
                  key={index}
                  className="card"
                  style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <a 
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="short-url"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            textDecoration: 'none',
                            fontSize: '1.1rem'
                          }}
                        >
                          {url.shortUrl}
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                        <strong>Original:</strong> {url.longUrl}
                      </div>
                      {url.createdAt && (
                        <div style={{ fontSize: '0.8rem', color: '#999', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={12} />
                          Created {formatDate(url.createdAt)}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => copyToClipboard(url.shortUrl, index)}
                      className="copy-btn"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        flexShrink: 0
                      }}
                    >
                      {copiedIndex === index ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard