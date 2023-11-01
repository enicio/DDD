/* eslint-disable @typescript-eslint/method-signature-style */
import type EventHandlerInterface from './event-handler.interface'
import type EventInterface from './event.interface'

export default interface EventDispatcherInterface {
  notify(event: EventInterface): void
  register(eventname: string, eventHandler: EventHandlerInterface): void
  unregister(eventname: string, eventHandler: EventHandlerInterface): void
  unregisterAll(): void
}
