export interface Product {
  id: string
  name: string
  brand: string
  category: "mobiles" | "chargers" | "earphones" | "covers" | "power-banks" | "sim-cards" | "accessories"
  barcode: string
  sku: string
  buyPrice: number
  sellPrice: number
  stock: number
  minStock: number
  warranty: string
  image: string
  dateAdded: string
  supplier: string
}

export interface Sale {
  id: string
  productId: string
  productName: string
  quantity: number
  total: number
  date: string
  customer: string
}

export const categories = [
  { id: "mobiles", label: "Mobiles", icon: "Smartphone" },
  { id: "chargers", label: "Chargers", icon: "Zap" },
  { id: "earphones", label: "Earphones", icon: "Headphones" },
  { id: "covers", label: "Covers", icon: "Shield" },
  { id: "power-banks", label: "Power Banks", icon: "Battery" },
  { id: "sim-cards", label: "SIM Cards", icon: "Sim" },
  { id: "accessories", label: "Accessories", icon: "Cable" },
] as const

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "mobiles",
    barcode: "8901234567890",
    sku: "APL-IP15PM-256",
    buyPrice: 1199,
    sellPrice: 1399,
    stock: 12,
    minStock: 5,
    warranty: "12 months",
    image: "/images/iphone.jpg",
    dateAdded: "2026-01-15",
    supplier: "Apple Dist. Inc.",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "mobiles",
    barcode: "8901234567891",
    sku: "SAM-S24U-256",
    buyPrice: 1099,
    sellPrice: 1299,
    stock: 8,
    minStock: 5,
    warranty: "12 months",
    image: "/images/samsung.jpg",
    dateAdded: "2026-01-20",
    supplier: "Samsung Corp.",
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "earphones",
    barcode: "8901234567892",
    sku: "APL-APP2",
    buyPrice: 199,
    sellPrice: 249,
    stock: 25,
    minStock: 10,
    warranty: "6 months",
    image: "/images/airpods.jpg",
    dateAdded: "2026-02-01",
    supplier: "Apple Dist. Inc.",
  },
  {
    id: "4",
    name: "Anker 65W GaN Charger",
    brand: "Anker",
    category: "chargers",
    barcode: "8901234567893",
    sku: "ANK-65W-GAN",
    buyPrice: 35,
    sellPrice: 55,
    stock: 40,
    minStock: 15,
    warranty: "18 months",
    image: "/images/charger.jpg",
    dateAdded: "2026-02-05",
    supplier: "Anker Direct",
  },
  {
    id: "5",
    name: "Spigen Ultra Hybrid Case",
    brand: "Spigen",
    category: "covers",
    barcode: "8901234567894",
    sku: "SPG-UH-IP15",
    buyPrice: 12,
    sellPrice: 25,
    stock: 3,
    minStock: 10,
    warranty: "3 months",
    image: "/images/case.jpg",
    dateAdded: "2026-02-10",
    supplier: "Spigen Ltd.",
  },
  {
    id: "6",
    name: "Anker PowerCore 20000mAh",
    brand: "Anker",
    category: "power-banks",
    barcode: "8901234567895",
    sku: "ANK-PC-20K",
    buyPrice: 30,
    sellPrice: 49,
    stock: 18,
    minStock: 8,
    warranty: "12 months",
    image: "/images/powerbank.jpg",
    dateAdded: "2026-02-12",
    supplier: "Anker Direct",
  },
  {
    id: "7",
    name: "Jio 5G SIM Starter Kit",
    brand: "Jio",
    category: "sim-cards",
    barcode: "8901234567896",
    sku: "JIO-5G-SK",
    buyPrice: 2,
    sellPrice: 5,
    stock: 100,
    minStock: 30,
    warranty: "N/A",
    image: "/images/sim.jpg",
    dateAdded: "2026-02-15",
    supplier: "Reliance Telecom",
  },
  {
    id: "8",
    name: "USB-C to Lightning Cable",
    brand: "Baseus",
    category: "accessories",
    barcode: "8901234567897",
    sku: "BAS-UCLC-1M",
    buyPrice: 5,
    sellPrice: 15,
    stock: 60,
    minStock: 20,
    warranty: "6 months",
    image: "/images/cable.jpg",
    dateAdded: "2026-02-18",
    supplier: "Baseus Store",
  },
]

export const sampleSales: Sale[] = [
  { id: "s1", productId: "1", productName: "iPhone 15 Pro Max", quantity: 1, total: 1399, date: "2026-02-28", customer: "Walk-in" },
  { id: "s2", productId: "3", productName: "AirPods Pro 2", quantity: 2, total: 498, date: "2026-02-28", customer: "John D." },
  { id: "s3", productId: "4", productName: "Anker 65W GaN Charger", quantity: 3, total: 165, date: "2026-02-27", customer: "Walk-in" },
  { id: "s4", productId: "5", productName: "Spigen Ultra Hybrid Case", quantity: 1, total: 25, date: "2026-02-27", customer: "Sarah M." },
  { id: "s5", productId: "2", productName: "Samsung Galaxy S24 Ultra", quantity: 1, total: 1299, date: "2026-02-26", customer: "Mike R." },
  { id: "s6", productId: "8", productName: "USB-C to Lightning Cable", quantity: 5, total: 75, date: "2026-02-26", customer: "Walk-in" },
  { id: "s7", productId: "6", productName: "Anker PowerCore 20000mAh", quantity: 2, total: 98, date: "2026-02-25", customer: "Amy L." },
  { id: "s8", productId: "1", productName: "iPhone 15 Pro Max", quantity: 1, total: 1399, date: "2026-02-25", customer: "David K." },
]
