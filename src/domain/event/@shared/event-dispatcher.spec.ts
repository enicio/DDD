/* eslint-disable @typescript-eslint/dot-notation */
import CustomerChangeNameEvent from '../customer/customer-change-name.events'
import CustomerCreatedEvent from '../customer/customer-created.events'
import CallConsoleLogWhenChangeName from '../customer/handler/call-console-log-when-change-name'
import EnviaConsoleLog1Handler from '../customer/handler/send-console-log-1'
import EnviaConsoleLog2Handler from '../customer/handler/send-console-log-2'
import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler'
import ProductCreatedEvent from '../product/product-created.events'
import EventDispatcher from './event-dispatcher'

describe('Domain events tests', () => {
  it('should register an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined()
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(2)
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toBe(eventHandler)
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined()
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(0)
  })

  it('should unregister an event handler who not exist and expext a undefined', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined()
  })

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.register('ProductCreatedEvent', eventHandler)
    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    eventDispatcher.unregisterAll()

    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined()
  })

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    const spyEventHandler = jest.spyOn(eventHandler, 'handle').mockImplementation(() => { console.log('Send Email') })

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'Product 1',
      description: 'Product 1 description',
      mail: 'test@test.com',
      price: 100
    })

    eventDispatcher.notify(productCreatedEvent)

    expect(spyEventHandler).toHaveBeenCalled()
  })

  it('Should dispatcher event when customer was created', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandlerOne = new EnviaConsoleLog1Handler()
    const eventHandlerTwo = new EnviaConsoleLog2Handler()
    const spyEventHandlerOne = jest.spyOn(eventHandlerOne, 'handle')
    const spyEventHandlerTwo = jest.spyOn(eventHandlerTwo, 'handle')

    eventDispatcher.register('CustomerCreatedEvent', eventHandlerOne)
    eventDispatcher.register('CustomerCreatedEvent', eventHandlerTwo)

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: 1,
      name: 'Customer 1',
      email: 'test@test.com'
    })

    const customerChangeNameEvent = new CustomerChangeNameEvent({
      id: 1,
      nome: 'Customer 1',
      endereco: 'Rua 1'
    })

    eventDispatcher.notify(customerCreatedEvent)
    eventDispatcher.notify(customerChangeNameEvent)

    expect(spyEventHandlerOne).toHaveBeenCalledTimes(1)
    expect(spyEventHandlerTwo).toHaveBeenCalledTimes(1)
  })

  it('Should not dispatcher event when change address for a customer', () => {
    const eventDispatcher = new EventDispatcher()
    const eventChangeNamehandler = new CallConsoleLogWhenChangeName()

    const spyEventHandlerChangeName = jest.spyOn(eventChangeNamehandler, 'handle')

    eventDispatcher.register('CustomerChangeNameEvent', eventChangeNamehandler)

    const customerChangeNameEvent = new CustomerChangeNameEvent({
      id: 1,
      nome: 'Customer 1',
      endereco: 'Rua 1'
    })

    eventDispatcher.notify(customerChangeNameEvent)

    expect(spyEventHandlerChangeName).toHaveBeenCalledTimes(1)
  })
})
