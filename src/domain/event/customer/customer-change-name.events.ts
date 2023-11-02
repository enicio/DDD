import type EventInterface from '../@shared/event.interface'

export default class CustomerChangeNameEvent implements EventInterface {
  dataTimeOccured: Date
  eventData: { id: number, nome: string, endereco: string }

  constructor (eventData: { id: number, nome: string, endereco: string }) {
    this.dataTimeOccured = new Date()
    this.eventData = eventData
  }
}
