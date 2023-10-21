import Order from '../../domain/entity/order'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import OrderModel from '../db/sequelize/model/order.model'
import type OrderRepositoryInterface from '../../domain/repository/order-repository.interface'
import OrderItem from '../../domain/entity/order_item'

export default class OrderRepository implements OrderRepositoryInterface {
  async create (entity: Order): Promise<void> {
    try {
      await OrderModel.create({
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map(item => {
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            product_id: item.productId,
            order_id: entity.id
          }
        }
        )
      },
      {
        include: [{ model: OrderItemModel }]
      })
    } catch (error) {
      throw new Error('something went wrong to create order')
    }
  }

  async update (entity: Order): Promise<void> {
    try {
      await OrderModel.sequelize?.transaction(async (t) => {
        await OrderItemModel.destroy({
          where: {
            order_id: entity.id
          },
          transaction: t
        })

        const items = entity.items.map(item => {
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            product_id: item.productId,
            order_id: entity.id
          }
        })

        await OrderItemModel.bulkCreate(items, { transaction: t })

        await OrderModel.update(
          {
            total: entity.total()
          },
          {
            where: {
              id: entity.id
            },
            transaction: t
          }
        )
      })
    } catch (error) {
      throw new Error('something went wrong to update order')
    }
  }

  async find (id: string): Promise<Order> {
    try {
      const orderFound = await OrderModel.findOne({ where: { id }, include: [{ model: OrderItemModel }] })

      if (orderFound == null) {
        throw new Error('Order not found')
      }

      const items = orderFound.items?.map(item =>
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity
        ))

      return new Order(orderFound.id, orderFound.customer_id, items)
    } catch (error) {
      throw new Error('Failed to find the order')
    }
  }

  async findAll (): Promise<Order[]> {
    try {
      const orders = await OrderModel.findAll({ include: [{ model: OrderItemModel }] })

      return orders.map((order: { items: any[], id: string, customer_id: string }) => {
        const items = order.items.map(item =>
          new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity
          ))
        return new Order(order.id, order.customer_id, items)
      })
    } catch (error) {
      throw new Error('Failed to find the order')
    }
  }

  async delete (id: string): Promise<number> {
    const rowsDeleted = await OrderModel.destroy({ where: { id } })
    return rowsDeleted
  }
}
