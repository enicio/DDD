import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer) {
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
        });
      } catch (error) {
        throw new Error('something went wrong to create customer');
      }
    }

    async update(entity: Customer) {
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
        });
      } catch (error) {
        throw new Error('something went wrong to update customer');
      }
    }

    async find(id: string): Promise<Customer> {
      let customerModel;
      try {
        customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
      } catch (error) {
        throw new Error('Customer not found');
      }
      const newCustomer = new Customer(customerModel!.id, customerModel!.name);
      const newAddress = new Address(customerModel!.street, customerModel!.number, customerModel!.city, customerModel!.state);
      newCustomer.setAddress(newAddress);
      if (customerModel!.active) {
        newCustomer.activate();
      }
      return newCustomer;
    }


    async findAll(): Promise<Customer[]> {
      let customerModels;
      try {
        customerModels = await CustomerModel.findAll();
      } catch (error) {
        throw new Error('Customer not found');
      }
        return customerModels.map(customerModel => {
        const user = new Customer(customerModel.id, customerModel.name);
        const address = new Address(customerModel.street, customerModel.number,  customerModel.city, customerModel.state);
        user.setAddress(address);
        if (customerModel.active) {
          user.activate();
        }
        return user;
      });
    }
}