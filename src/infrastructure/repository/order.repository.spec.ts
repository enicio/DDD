import Address from '../../domain/entity/address'
import Customer from '../../domain/entity/customer'
import { Sequelize } from 'sequelize-typescript'
import CustomerModel from '../db/sequelize/model/customer.model'
import CustomerRepository from './customer.repository'
import OrderModel from '../db/sequelize/model/order.model'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import ProductModel from '../db/sequelize/model/product.model'
import Order from '../../domain/entity/order'
import OrderItem from '../../domain/entity/order_item'
import Product from '../../domain/entity/product'
import ProductRepository from './product.repository'
import OrderRepository from './order.repository'

describe('CustomerRepository', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()
    await new CustomerRepository().create(newCustomer)

    const newProduct = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProduct)

    const newOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 5)
    const newOrder = new Order('1', newCustomer.id, [newOrderItem])

    const orderRepository = new OrderRepository()

    await orderRepository.create(newOrder)

    const orderModel = await OrderModel.findOne(
      {
        where: { id: '1' },
        include: ['items']
      })

    expect(orderModel?.toJSON()).toStrictEqual({
      id: '1',
      customer_id: '34',
      total: newOrder.total(),
      items: [
        {
          id: newOrderItem.id,
          name: newOrderItem.name,
          product_id: newOrderItem.productId,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
          order_id: '1'
        }
      ]
    })
  })

  it('should update a order', async () => {
    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()
    await new CustomerRepository().create(newCustomer)

    const newProduct = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProduct)

    const newOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 5)
    const newOrder = new Order('1', newCustomer.id, [newOrderItem])

    const orderRepository = new OrderRepository()

    await orderRepository.create(newOrder)

    const updatedOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 10)
    const updatedOrder = new Order('1', newCustomer.id, [updatedOrderItem])
    await orderRepository.update(updatedOrder)

    const orderModel = await OrderModel.findOne(
      {
        where: { id: '1' },
        include: ['items']
      })

    expect(orderModel?.toJSON()).toStrictEqual({
      id: '1',
      customer_id: '34',
      total: updatedOrder.total(),
      items: [
        {
          id: updatedOrderItem.id,
          name: updatedOrderItem.name,
          product_id: updatedOrderItem.productId,
          price: updatedOrderItem.price,
          quantity: updatedOrderItem.quantity,
          order_id: '1'
        }
      ]
    })
  })

  it('should find a order', async () => {
    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()
    await new CustomerRepository().create(newCustomer)

    const newProduct = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProduct)

    const newOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 5)
    const newOrder = new Order('1', newCustomer.id, [newOrderItem])

    const orderRepository = new OrderRepository()

    await orderRepository.create(newOrder)

    const orderFinded = await orderRepository.find('1')

    expect(orderFinded).toStrictEqual(newOrder)
  })

  it('should find all orders', async () => {
    const orderRepository = new OrderRepository()

    const newCustomerOne = new Customer('34', 'John')
    const newAddressOne = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomerOne.setAddress(newAddressOne)
    newCustomerOne.activate()
    await new CustomerRepository().create(newCustomerOne)

    const newProductOne = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProductOne)

    const newOrderItemOne = new OrderItem('1', newProductOne.name, newProductOne.price, newProductOne.id, 5)
    const newOrderOne = new Order('1', newCustomerOne.id, [newOrderItemOne])

    await orderRepository.create(newOrderOne)

    const newCustomerTwo = new Customer('35', 'John')
    const newAddressTwo = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomerTwo.setAddress(newAddressTwo)
    newCustomerTwo.activate()
    await new CustomerRepository().create(newCustomerTwo)

    const newProductTwo = new Product('2', 'product 1', 1)
    await new ProductRepository().create(newProductTwo)

    const newOrderItemTwo = new OrderItem('2', newProductTwo.name, newProductTwo.price, newProductTwo.id, 5)
    const newOrderTwo = new Order('2', newCustomerTwo.id, [newOrderItemTwo])

    await orderRepository.create(newOrderTwo)

    const ordersFinded = await orderRepository.findAll()

    expect(ordersFinded).toStrictEqual([newOrderOne, newOrderTwo])
  })

  it('should throw an error when try to find a order that not exists', async () => {
    const orderRepository = new OrderRepository()

    await expect(orderRepository.find('1')).rejects.toThrow(new Error('Failed to find the order'))
  })

  it('should throw an error when try to create a order with a customer that not exists', async () => {
    const newProduct = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProduct)

    const newOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 5)
    const newOrder = new Order('1', '1', [newOrderItem])

    const orderRepository = new OrderRepository()

    await expect(orderRepository.create(newOrder)).rejects.toThrow(new Error('something went wrong to create order'))
  })

  it('should throw an error when try to create a order with a product that not exists', async () => {
    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()
    await new CustomerRepository().create(newCustomer)

    const newOrderItem = new OrderItem('1', 'product 1', 1, '1', 5)
    const newOrder = new Order('1', newCustomer.id, [newOrderItem])

    const orderRepository = new OrderRepository()

    await expect(orderRepository.create(newOrder)).rejects.toThrow(new Error('something went wrong to create order'))
  })

  it('should throw an error when try to update a order that not exists', async () => {
    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()
    await new CustomerRepository().create(newCustomer)

    const newProduct = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProduct)

    const newOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 5)
    const newOrder = new Order('1', newCustomer.id, [newOrderItem])

    const orderRepository = new OrderRepository()

    await expect(orderRepository.update(newOrder)).rejects.toThrow(new Error('something went wrong to update order'))
  })

  it('should throw an error when try to update a order with a customer that not exists', async () => {
    const newProduct = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProduct)

    const newOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 5)
    const newOrder = new Order('1', '1', [newOrderItem])

    const orderRepository = new OrderRepository()

    await expect(orderRepository.update(newOrder)).rejects.toThrow(new Error('something went wrong to update order'))
  })

  it('should delete a order', async () => {
    const orderRepository = new OrderRepository()

    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()
    await new CustomerRepository().create(newCustomer)

    const newProduct = new Product('1', 'product 1', 1)
    await new ProductRepository().create(newProduct)

    const newOrderItem = new OrderItem('1', newProduct.name, newProduct.price, newProduct.id, 5)
    const newOrder = new Order('1', newCustomer.id, [newOrderItem])

    await orderRepository.create(newOrder)

    const rowsDeleted = await orderRepository.delete('1')

    const orderModel = await OrderModel.findOne(
      {
        where: { id: '1' },
        include: ['items']
      })

    expect(orderModel).toBeNull()
    expect(rowsDeleted).toBe(1)
  })

  it('should return zero when try to delete a order that not exists', async () => {
    const orderRepository = new OrderRepository()

    await expect(orderRepository.delete('1')).rejects.toThrow(new Error('Something went wrong to delete order: Order with ID 1 not found.'))
  })
})
