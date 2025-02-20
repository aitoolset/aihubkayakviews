import KayakGrid from './components/KayakGrid'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Top Kayak Rides - Last 6 Months
      </h1>
      <div className="flex justify-center">
        <KayakGrid />
      </div>
    </main>
  )
}

