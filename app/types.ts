export interface BikeReview {
  id: number
  title: string
  videoUrl: string
  thumbnailUrl: string
  specs: {
    range: string
    topSpeed: string
    motor: string
    battery: string
    weight: string
    price: string
  }
  reviewDate: string
} 