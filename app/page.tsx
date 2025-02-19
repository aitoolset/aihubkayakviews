import ElectricBikeGrid from './components/ElectricBikeGrid'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Top Electric Bikes - Last 3 Months</h1>
      <ElectricBikeGrid />
    </main>
  )
}

