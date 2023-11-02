import type EventHandlerInterface from '../../@shared/event-handler.interface'
import type CustomerChangeNameEvent from '../customer-change-name.events'

export default class CallConsoleLogWhenChangeName implements EventHandlerInterface {
  handle (event: CustomerChangeNameEvent): void {
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`)
  }
}
