import Address from '../../domain/entity/address'
import Customer from '../../domain/entity/customer'
import { Sequelize } from 'sequelize-typescript'
import CustomerModel from '../db/sequelize/model/customer.model'
import CustomerRepository from './customer.repository'

describe('CustomerRepository', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()

    await new CustomerRepository().create(newCustomer)

    const customerFinded = await CustomerModel.findOne({ where: { id: '34' } })

    expect(customerFinded?.toJSON()).toStrictEqual({
      id: '34',
      name: 'John',
      street: 'Rua 1',
      number: 10,
      city: 'BH',
      state: 'MG',
      rewardPoints: 0,
      active: true
    })
  })

  it('should update a customer', async () => {
    const newCustomer = new Customer('34', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)

    await new CustomerRepository().create(newCustomer)

    const updatedAddress = new Address('Rua 2', 12, 'Uberaba', 'MG')

    newCustomer.setAddress(updatedAddress)

    await new CustomerRepository().update(newCustomer)

    const customerWithAddresUpdate = await CustomerModel.findOne({ where: { id: '34' } })
    expect(customerWithAddresUpdate?.toJSON()).toStrictEqual({
      id: '34',
      name: 'John',
      street: 'Rua 2',
      number: 12,
      city: 'Uberaba',
      state: 'MG',
      rewardPoints: 0,
      active: false
    })
  })

  it('should find a customer', async () => {
    const newCustomer = new Customer('35', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    newCustomer.activate()
    await new CustomerRepository().create(newCustomer)

    const customerFinded = await new CustomerRepository().find('35')

    expect(customerFinded?.id).toBe('35')
    expect(customerFinded?.name).toBe('John')
    expect(customerFinded?.address._street).toBe('Rua 1')
    expect(customerFinded?.address._number).toBe(10)
    expect(customerFinded?.address._city).toBe('BH')
    expect(customerFinded?.address._state).toBe('MG')
    expect(customerFinded?.active).toBe(true)
    expect(customerFinded?.rewardPoints).toBe(0)
  })

  it('should find all customers', async () => {
    const newCustomer1 = new Customer('35', 'John')
    const newAddress1 = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer1.setAddress(newAddress1)
    await new CustomerRepository().create(newCustomer1)

    const newCustomer2 = new Customer('36', 'John')
    const newAddress2 = new Address('Rua 2', 12, 'Uberaba', 'MG')
    newCustomer2.setAddress(newAddress2)
    await new CustomerRepository().create(newCustomer2)

    const customersFinded = await new CustomerRepository().findAll()

    expect(customersFinded.length).toBe(2)
    expect(customersFinded).toEqual([newCustomer1, newCustomer2])
  })

  it('should throw a error when try find a customer that not exists', async () => {
    const customerRepository = new CustomerRepository()

    await expect(customerRepository.find('36')).rejects.toThrow('Something went wrong to find customer')
  })

  it('should throw a error when try create a customer with id that already exists', async () => {
    const newCustomer = new Customer('35', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    await new CustomerRepository().create(newCustomer)

    await expect(new CustomerRepository().create(newCustomer)).rejects.toThrow('Something went wrong to create customer')
  })

  it('should delete a customer', async () => {
    const newCustomer = new Customer('35', 'John')
    const newAddress = new Address('Rua 1', 10, 'BH', 'MG')
    newCustomer.setAddress(newAddress)
    await new CustomerRepository().create(newCustomer)

    await new CustomerRepository().delete('35')

    const customerFinded = await CustomerModel.findOne({ where: { id: '35' } })
    expect(customerFinded).toBeNull()
  })
})
