export interface KayakReview {
  id: number
  title: string
  specs: {
    length: string | number
    width: string | number
    weight: string | number
    capacity: string | number
    material: string
    type: string
    price: string | number
    accessories: string
    seats: string | number
  }
  summary: string
  reviewDate: string
} 