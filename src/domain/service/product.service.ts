import type Product from '../entity/product'

export function increasePrice (products: Product[], percentage: number): void {
  products.forEach((product: { price: number, changePrice: (arg0: any) => void }) => {
    const newPrice = product.price + (product.price * percentage / 100)
    product.changePrice(newPrice)
  })
}
