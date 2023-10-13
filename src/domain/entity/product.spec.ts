import Product from "./product";

describe("Product unit test", () => {
  it("should instantiate a product", () => {
    const expectedProduct = {
      _id: '34',
      _name: 'wallet',
      _price: 15
    }

    const newProduct = new Product("34", "wallet", 15);

    expect(newProduct).toEqual(expectedProduct);
  });

  it("should throw an error when Id is empty", () => {
    expect(() => { const newProduct = new Product("", "wallet", 15);}).toThrowError("Id is required");
  });

  it("should throw an error when name is empty", () => {
    expect(() => { const newProduct = new Product("123", "", 15);}).toThrowError("Name is required");
  });

  it("should throw an error when price is empty", () => {
    expect(() => { const newProduct = new Product("123", "wallet", -18);}).toThrowError("Price must be greater than 0");
  });

  it("should change product name", () => {
    const newProduct = new Product("34", "wallet", 15);
    newProduct.changeName("wallet 2");
    expect(newProduct.name).toEqual("wallet 2");
  });

  it("should throw an error when try change product name to empty", () => {
    const newProduct = new Product("34", "wallet", 15);
    expect(() => newProduct.changeName("")).toThrowError("Name cannot be a empty value");
  });

  it("should change product price", () => {
    const newProduct = new Product("34", "wallet", 15);
    newProduct.changePrice(20);
    expect(newProduct.price).toEqual(20);
  });

  it("should throw an error when try change product price to negative", () => {
    const newProduct = new Product("34", "wallet", 15);
    expect(() => newProduct.changePrice(-20)).toThrowError("Price must be greater than 0");
  });

});