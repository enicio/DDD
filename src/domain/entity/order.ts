import type OrderItem from './order_item'

export default class Order {
  private readonly _id: string
  private readonly _customerId: string
  private readonly _items: OrderItem[]
  private readonly _total: number

  constructor (id: string, customerId: string, items: OrderItem[]) {
    this._id = id
    this._customerId = customerId
    this._items = items
    this._total = this.calculateTotal()
    this.validate()
  }

  get id (): string {
    return this._id
  }

  get customerId (): string {
    return this._customerId
  }

  get items (): OrderItem[] {
    return this._items
  }

  calculateTotal (): number {
    return this._items.reduce((total, item) => total + item.orderItemTotal(), 0)
  }

  total (): number {
    return this._total
  };

  validate (): void {
    if (this._id.length === 0) {
      throw new Error('Id is required')
    }
    if (this._customerId.length === 0) {
      throw new Error('CustomerId is required')
    }
  }
}
