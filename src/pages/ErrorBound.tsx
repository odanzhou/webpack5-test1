import { ErrorInfo, PureComponent } from 'react'
import ErrorPage from './ErrorPage'

interface IErrorBoundProps {
  fallbackUI?: React.ReactNode,
  children?: React.ReactNode,
}

class ErrorBound extends PureComponent<IErrorBoundProps> {
  state = {
    hasError: false,
    error: null,
  }
  constructor(props: IErrorBoundProps) {
    super(props)
  }

  static getDerivedStateFromError(error: any) {
    console.log('getDerivedStateFromError', error)
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('componentDidCatch', error, errorInfo)
  }

  render() {
    const { hasError, error } = this.state
    const { fallbackUI, children } = this.props
    if(hasError) {
      return <>
        {fallbackUI || <ErrorPage />}
        <div>
          has Error
        </div>
      </>
    }
    return children
  }
}

export default ErrorBound