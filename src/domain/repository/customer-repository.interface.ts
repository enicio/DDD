import type Customer from '../entity/customer'
import type RepositoryInterface from './repository-interface'

export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> {

  delete: (id: string) => Promise<void>
}
