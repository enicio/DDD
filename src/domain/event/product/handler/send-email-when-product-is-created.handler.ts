import type EventHandlerInterface from '../../@shared/event-handler.interface'
import type ProductCreateEvent from '../product-created.events'

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductCreateEvent> {
  handle (event: ProductCreateEvent): void {
    console.log(`Send email to ${event.eventData.mail} when product ${event.eventData.name} is created`)
  }
}
