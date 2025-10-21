import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createShortUrl, clearError, clearSuccess } from '../store/slices/urlSlice'
import { Link2, Copy, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Home = () => {
  const [longUrl, setLongUrl] = useState('')
  const [copied, setCopied] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { currentUrl, loading, error, success } = useSelector((state) => state.url)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to shorten URLs')
      navigate('/login')
      return
    }

    if (!longUrl.trim()) {
      toast.error('Please enter a valid URL')
      return
    }

    // Basic URL validation
    try {
      new URL(longUrl)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    dispatch(createShortUrl(longUrl))
  }

  const copyToClipboard = async () => {
    if (currentUrl?.shortUrl) {
      try {
        await navigator.clipboard.writeText(currentUrl.shortUrl)
        setCopied(true)
        toast.success('URL copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast.error('Failed to copy URL')
      }
    }
  }

  const handleNewUrl = () => {
    setLongUrl('')
    dispatch(clearError())
    dispatch(clearSuccess())
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link2 size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
          <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>URL Shortener</h1>
          <p style={{ color: '#666' }}>
            Transform your long URLs into short, shareable links
          </p>
        </div>

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

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {currentUrl && (
          <div className="url-result">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Your shortened URL:</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="short-url" style={{ flex: 1, minWidth: '200px' }}>
                {currentUrl.shortUrl}
              </div>
              <button 
                onClick={copyToClipboard}
                className="copy-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <strong>Original:</strong> {currentUrl.longUrl}
            </div>
            <button 
              onClick={handleNewUrl}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              Shorten Another URL
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
              Want to track your shortened URLs?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-secondary"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home