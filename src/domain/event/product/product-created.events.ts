import type EventInterface from '../@shared/event.interface'

export default class ProductCreatedEvent implements EventInterface {
  dataTimeOccured: Date
  eventData: { name: string, price: number, mail: string, description: string }

  constructor (eventData: { name: string, price: number, mail: string, description: string }) {
    this.dataTimeOccured = new Date()
    this.eventData = eventData
  }
}
