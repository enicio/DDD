import Order from '../entity/order'
import type Customer from '../entity/customer'
import type OrderItem from '../entity/order_item'

import { v4 as uuidv4 } from 'uuid'

export default class OrderService {
  static getTotal (orders: Order[]): number {
    let total = 0
    orders.forEach((order) => {
      total += order.total()
    })
    return total
  }

  static placeOrder (customer: Customer, items: OrderItem[]): Order {
    const order = new Order(uuidv4(), customer.id, items)
    const reawardPoints = order.total() / 2
    customer.addRewardPoints(reawardPoints)
    return order
  }
}
