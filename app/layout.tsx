import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'模型纪元 · 科研竞技场',description:'构筑你的 AI 研究流派，在十二回合中争夺科研之巅。',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
