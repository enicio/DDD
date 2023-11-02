import type EventHandlerInterface from '../../@shared/event-handler.interface'
import type CustomerCreatedEvent from '../customer-created.events'

export default class EnviaConsoleLog2Handler implements EventHandlerInterface {
  handle (event: CustomerCreatedEvent): void {
    console.log('Esse é o segundo console.log do evento: CustomerCreated')
  }
}
