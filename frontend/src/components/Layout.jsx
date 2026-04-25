import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#060f1e] text-white">
      <Sidebar />
      <Navbar title={title} />
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}