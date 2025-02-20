import Image from 'next/image'
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// ... rest of the code, but replace <img> with <Image>
<Image 
  src={video.thumbnail || "/placeholder.svg"} 
  alt={video.title} 
  width={160}
  height={96}
  className="object-cover"
/> 