import Product from '../entity/product'
import ProductService from './product.service'

describe('OrderService unit test', () => {
  it('should increase products price', () => {
    const product1 = new Product('1', 'item 1', 10)
    const product2 = new Product('2', 'item 2', 20)
    const products = [product1, product2]

    ProductService.increasePrice(products, 100)

    expect(product1.price).toEqual(20)
    expect(product2.price).toEqual(40)
  })
})
