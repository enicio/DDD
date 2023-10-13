import Address from './address';

describe('Address', () => {
  it('should create an address object with valid properties', () => {
    const address = new Address('123 Main St', 15, 'BH', 'MG');
    expect(address._street).toBe('123 Main St');
    expect(address._number).toBe(15);
    expect(address._city).toBe('BH');
    expect(address._state).toBe('MG');
  });

  it('should throw an error if any property is invalid', () => {
    expect(() => new Address('', 15, 'CA', '12345')).toThrow();
    expect(() => new Address('123 Main St', -12, 'CA', '12345')).toThrow();
    expect(() => new Address('123 Main St', 15, '', '12345')).toThrow();
    expect(() => new Address('123 Main St', 15, 'CA', '')).toThrow();
  });
});