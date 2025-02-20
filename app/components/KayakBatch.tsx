import Image from 'next/image'
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Sample data for demonstration
const kayakVideos = [
  { id: 1, title: "Top Kayak Reviews 2024", thumbnail: "/placeholder.svg?height=120&width=200" },
  { id: 2, title: "Best Recreational Kayaks", thumbnail: "/placeholder.svg?height=120&width=200" },
  { id: 3, title: "Single-Seat Kayak Comparison", thumbnail: "/placeholder.svg?height=120&width=200" },
]

const defaultSpecs = `
Length: 12 ft
Width: 30 inches
Weight: 50 lbs
Capacity: 350 lbs
Material: Polyethylene
Accessories: Paddle holders, storage compartments
`

export default function KayakBatch() {
  const [specs, setSpecs] = useState(Array(kayakVideos.length).fill(defaultSpecs))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Kayak Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {kayakVideos.map((video) => (
            <Card key={video.id} className="flex">
              <Image 
                src={video.thumbnail}
                alt={video.title}
                width={160}
                height={96}
                className="object-cover"
              />
              <CardContent className="flex-1 p-4">
                <h2 className="text-lg font-semibold">{video.title}</h2>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {specs.map((spec, index) => (
            <Textarea
              key={index}
              value={spec}
              onChange={(e) => {
                const newSpecs = [...specs]
                newSpecs[index] = e.target.value
                setSpecs(newSpecs)
              }}
              className="h-40"
              placeholder="Enter kayak specifications here..."
            />
          ))}
        </div>
      </div>
    </div>
  )
} 