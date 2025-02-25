export interface KayakSpecs {
  length: number;
  width: number;
  weight: number;
  capacity: number;
  material: string;
  type: string;
  price: number;
  accessories: string[];
  seats: number;
}

export interface KayakReview {
  id: number | string;
  title: string;
  specs: KayakSpecs;
  summary: string;
  reviewDate: string;
} 