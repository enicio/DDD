import Address from "./address";
import Customer from "./customer";

describe("Customer", () => {
    it("should instantiate a user", () => {
        const expectedCustomer = {
          _id: '34',
          _name: 'John',
          _address: undefined,
          _active: false,
          _rewardPoints: 0
        }

        const newCustomer = new Customer("34", "John");

        expect(newCustomer).toEqual(expectedCustomer);
    });

    it("should change customer name", () => {
      const newCustomer = new Customer("34", "John");
      newCustomer.changeName("John Doe");
      expect(newCustomer['_name']).toEqual("John Doe");
    });

    it("should throw a erro when try change customer name to empty", () => {
      const newCustomer = new Customer("34", "John");
      expect(() => newCustomer.changeName("")).toThrowError("Name cannot be a empty value");
    });

    it("should throw an error when Id is empty", () => {

      expect(() => { const newCustomer = new Customer("", "John");}).toThrowError("Id is required");
    });

    it("should throw an error when name is empty", () => {

      expect(() => { const newCustomer = new Customer("12", "");}).toThrowError("Name is required");
    });

    it("should throw a error when try activate a customer without set a address", () => {
      const newCustomer = new Customer("34", "John");
      expect(() => newCustomer.activate()).toThrowError("Address is required to activate customer");
    });

    it("should deactivate a customer", () => {
      const newCustomer = new Customer("34", "John");
      newCustomer.deactivate();
      expect(newCustomer['_active']).toBeFalsy();
    });
    it("should activate a customer", () => {
      const newCustomer = new Customer("34", "John");
      const address = new Address("Rua 1", 10, "BH", "MG");
      newCustomer.setAddress(address);
      newCustomer.activate();
      expect(newCustomer['_active']).toBeTruthy();
    });

    it("Should set reaward points", () => {
      const newCustomer = new Customer("34", "John");
      expect(newCustomer.rewardPoints).toEqual(0);
      newCustomer.addRewardPoints(10);
      expect(newCustomer.rewardPoints).toEqual(10);
    });
});