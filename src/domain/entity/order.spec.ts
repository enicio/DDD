import Order from './order'
import OrderItem from './order_item'

describe('Order', () => {
  it('should instantiate a order', () => {
    const expectedOrder = {
      _id: '34',
      _customerId: '12',
      _items: [],
      _total: 0
    }

    const newOrder = new Order('34', '12', [])

    expect(newOrder).toEqual(expectedOrder)
  })

  it('should calculate total', () => {
    const item1 = new OrderItem('1', 'item 1', 10, 'prod1', 2)
    const item2 = new OrderItem('2', 'item 2', 20, 'prod2', 3)
    const newOrder = new Order('34', '12', [item1, item2])
    expect(newOrder.total()).toEqual(80)
  })

  it('should throw an error when User Id is empty', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(() => { const newOrder = new Order('', '12', []) }).toThrowError('Id is required')
  })

  it('should throw an error when Custumer Id is empty', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(() => { const newOrder = new Order('1', '', []) }).toThrowError('CustomerId is required')
  })
})
