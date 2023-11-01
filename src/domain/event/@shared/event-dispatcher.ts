import type EventDispatcherInterface from './event-dispatcher.interface'
import type EventHandlerInterface from './event-handler.interface'
import type EventInterface from './event.interface'

export default class EventDispatcher implements EventDispatcherInterface {
  private eventHandlers: Record<string, EventHandlerInterface[]> = {}

  get getEventHandlers (): Record<string, EventHandlerInterface[]> {
    return this.eventHandlers
  }

  notify (event: EventInterface): void {
    const eventname = event.constructor.name
    if (this.eventHandlers[eventname] === undefined) {
      console.log(`Event ${eventname} was not dispatched because there are no handlers registered for it`)
      return
    }

    this.eventHandlers[eventname].forEach((eventHandler: EventHandlerInterface) => {
      eventHandler.handle(event)
    })
  }

  register (eventname: string, eventHandler: EventHandlerInterface): void {
    if (this.eventHandlers[eventname] === undefined) {
      this.eventHandlers[eventname] = []
    }

    this.eventHandlers[eventname].push(eventHandler)
  }

  unregister (eventname: string, eventHandler: EventHandlerInterface<EventInterface>): void {
    if (this.eventHandlers[eventname] === undefined) {
      return
    }

    const index = this.eventHandlers[eventname].indexOf(eventHandler)
    if (index > -1) {
      this.eventHandlers[eventname].splice(index, 1)
    }
  };

  unregisterAll (): void {
    this.eventHandlers = {}
  }
}
