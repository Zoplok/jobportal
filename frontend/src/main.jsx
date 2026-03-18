import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Error boundary to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'red' }}>
          <h1>React Error</h1>
          <pre style={{ background: '#fee', padding: '10px' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = '<div style="padding:20px;color:red">Root element not found</div>'
} else {
  try {
    const root = createRoot(rootElement)
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (err) {
    console.error('Mount error:', err)
    rootElement.innerHTML = `<div style="padding:20px;color:red"><h1>Mount Error</h1><pre>${err.message}</pre></div>`
  }
}
