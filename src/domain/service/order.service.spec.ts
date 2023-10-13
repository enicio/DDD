import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("OrderService unit test", () => {
  it("Should get total of all orders", () => {
    const item1 = new OrderItem("1", "p1", 10, "i1", 1);
    const item2 = new OrderItem("2", "p2", 20, "i2", 2);
    const item3 = new OrderItem("3", "p3", 30, "i3", 1);
    const item4 = new OrderItem("4", "p4", 40, "i4", 2);

    const order1 = new Order("1", "1", [
      item1,
      item2,
    ]);
    const order2 = new Order("2", "2", [
      item3,
      item4,
    ]);

    const orders = [order1, order2];

    const total = OrderService.getTotal(orders);

    expect(total).toEqual(160);
  });

  it("Should place a order", () => {
    const customer = new Customer("1", "John");
    const item1 = new OrderItem("1", "p1", 10, "i1", 1);
    const item2 = new OrderItem("2", "p2", 20, "i2", 1);

    const order = OrderService.placeOrder(customer, [item1, item2]);

    expect(customer.rewardPoints).toEqual(15);
    expect(order.total()).toEqual(30);
  });
});