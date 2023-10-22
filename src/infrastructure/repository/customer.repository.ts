import Address from '../../domain/entity/address'
import Customer from '../../domain/entity/customer'
import type CustomerRepositoryInterface from '../../domain/repository/customer-repository.interface'
import CustomerModel from '../db/sequelize/model/customer.model'

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create (entity: Customer): Promise<void> {
    try {
      await CustomerModel.create({
        id: entity.id,
        name: entity.name,
        street: entity.address._street,
        number: entity.address._number,
        city: entity.address._city,
        state: entity.address._state,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints
      })
    } catch (error) {
      throw new Error('Something went wrong to create customer')
    }
  }

  async update (entity: Customer): Promise<void> {
    try {
      await CustomerModel.update({
        name: entity.name,
        street: entity.address._street,
        number: entity.address._number,
        city: entity.address._city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints
      }, {
        where: {
          id: entity.id
        }
      })
    } catch (error) {
      throw new Error('Something went wrong to update customer')
    }
  }

  async find (id: string): Promise<Customer> {
    try {
      const customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true })
      const newCustomer = new Customer(customerModel.id, customerModel.name)
      const newAddress = new Address(customerModel.street, customerModel.number, customerModel.city, customerModel.state)
      newCustomer.setAddress(newAddress)
      if (customerModel.active) {
        newCustomer.activate()
      }
      return newCustomer
    } catch (error) {
      throw new Error('Something went wrong to find customer')
    }
  }

  async findAll (): Promise<Customer[]> {
    try {
      const customerModels = await CustomerModel.findAll()
      return customerModels.map(customerModel => {
        const user = new Customer(customerModel.id, customerModel.name)
        const address = new Address(customerModel.street, customerModel.number, customerModel.city, customerModel.state)
        user.setAddress(address)
        if (customerModel.active) {
          user.activate()
        }
        return user
      })
    } catch (error) {
      throw new Error('Something went wrong to find customer')
    }
  }

  async delete (id: string): Promise<number> {
    try {
      const order = await CustomerModel.findByPk(id)

      if (order === null) {
        throw new Error(`Customer with ID ${id} not found.`)
      }

      const rowsDeleted = await CustomerModel.destroy({ where: { id } })

      return rowsDeleted
    } catch (error: any) {
      throw new Error(`Something went wrong to delete customer: ${error.message}`)
    }
  }
}
