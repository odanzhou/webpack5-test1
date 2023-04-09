// 解决方案1
import('./bootstrap')
// 解决方案2，行不通
// 通过设置 eager: true
// import { createRoot } from 'react-dom/client'
// import RouterIndex from '@/router'

// const domNode = document?.getElementById('root')
// if(domNode) {
//   createRoot(domNode).render(<RouterIndex />)
// }