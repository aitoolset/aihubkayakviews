"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Sample data for demonstration
const videos = [
  { id: 1, title: "Top Electric Bike Review 2023", thumbnail: "/placeholder.svg?height=120&width=200" },
  { id: 2, title: "Electric Mountain Bike Test Ride", thumbnail: "/placeholder.svg?height=120&width=200" },
  { id: 3, title: "City Commuter E-Bike Comparison", thumbnail: "/placeholder.svg?height=120&width=200" },
]

const defaultStats = `
Max Speed: 28 mph
Range: 40-60 miles
Battery: 48V 14Ah Lithium-ion
Motor: 750W Rear Hub
Weight: 65 lbs
Frame: Aluminum Alloy
Suspension: Front Fork Suspension
Brakes: Hydraulic Disc
`

export default function ElectricBikeTopBatch() {
  const [stats, setStats] = useState(Array(videos.length).fill(defaultStats))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in-down">Electric Bike Top-Batch</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {videos.map((video) => (
            <Card key={video.id} className="flex">
              <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-40 h-24 object-cover" />
              <CardContent className="flex-1 p-4">
                <h2 className="text-lg font-semibold">{video.title}</h2>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {stats.map((stat, _index) => (
            <Textarea
              key={_index}
              value={stat}
              onChange={(e) => {
                const newStats = [...stats]
                newStats[_index] = e.target.value
                setStats(newStats)
              }}
              className="h-40"
              placeholder="Enter electric bike stats here..."
            />
          ))}
        </div>
      </div>
    </div>
  )
}

