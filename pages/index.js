import Image from 'next/image'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import TopCards from '@/components/TopCards'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className='bg-grey-100 min-h-screen'>
      <Header/>
      <TopCards/>
    </main>
  )
}
