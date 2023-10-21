// Objeto de valor
export default class Address {
  _street: string
  _number: number
  _city: string
  _state: string

  constructor (
    street: string,
    number: number,
    city: string,
    state: string
  ) {
    this._street = street
    this._number = number
    this._city = city
    this._state = state
    this.validate()
  }

  validate (): void {
    if (this._street.length === 0) {
      throw new Error('Street is required')
    }
    if (this._number <= 0) {
      throw new Error('Number is required')
    }
    if (this._city.length === 0) {
      throw new Error('City is required')
    }
    if (this._state.length === 0) {
      throw new Error('State is required')
    }
  }
}
