import { lazy } from 'react'
import { Outlet, Link } from 'react-router-dom'
import TestComponent from '@/components/testComponent'
import Search from './Search'

const BPageInfo =  lazy(() => import('libA/InfoPage'))

console.log('BPageInfo', BPageInfo)

type AppType = {
  title?: React.ReactNode,
  showError?: boolean,
}

const App = (props: AppType) => {
  const { title, showError } = props
  if(showError) {
    throw new Error('test')
  }
  return (<div>
    { title && <h1>{title}</h1>}
    Hello React Page in test1
    <TestComponent />
    <div>
      <Link to="about">to Aubout</Link>
    </div>
    <div>
      <Outlet />
    </div>
    <Search />
    <div>
      <div style={{background: 'yellow'}}>remote</div>
      <BPageInfo />
    </div>
  </div>)
}

export default App