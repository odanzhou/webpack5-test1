import { createRoot } from 'react-dom/client'
import RouterIndex from '@/router'

const domNode = document?.getElementById('root')
if(domNode) {
  createRoot(domNode).render(<RouterIndex />)
}