import type Order from '../entity/order'
import type RepositoryInterface from './repository-interface'

export default interface OrderRepositoryInterface extends RepositoryInterface<Order> {

  delete: (id: string) => Promise<number>
}
