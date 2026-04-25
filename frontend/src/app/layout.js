import './globals.css'

export const metadata = {
  title: 'Jai Balaji Bath and Tile',
  description: 'Shop Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}