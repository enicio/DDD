import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import ProductRepository from "./product.repository";
import OrderRepository from "./order.repository";

describe('CustomerRepository', () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a new order', async () => {
    const newCustomer = new Customer("34", "John");
    const newAddress = new Address("Rua 1", 10, "BH", "MG");
    newCustomer.setAddress(newAddress);
    newCustomer.activate();
    await new CustomerRepository().create(newCustomer);

    const newProduct = new Product("1", "product 1", 1);
    await new ProductRepository().create(newProduct);

    const newOrderItem = new OrderItem("1", newProduct.name, newProduct.price, newProduct.id, 5);
    const newOrder = new Order("1", newCustomer.id,[newOrderItem]);

    const orderRepository = new OrderRepository();

    await orderRepository.create(newOrder);

    const orderModel = await OrderModel.findOne(
      { where: { id: "1" },
      include: ["items"],
    });

    expect(orderModel?.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "34",
      total: newOrder.total(),
      items: [
        {
          id: newOrderItem.id,
          name: newOrderItem.name,
          product_id: newOrderItem.productId,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
          order_id: "1",
        }
      ]
    });
  });

  it('should update a order', async () => {
    const newCustomer = new Customer("34", "John");
    const newAddress = new Address("Rua 1", 10, "BH", "MG");
    newCustomer.setAddress(newAddress);
    newCustomer.activate();
    await new CustomerRepository().create(newCustomer);

    const newProduct = new Product("1", "product 1", 1);
    await new ProductRepository().create(newProduct);

    const newOrderItem = new OrderItem("1", newProduct.name, newProduct.price, newProduct.id, 5);
    const newOrder = new Order("1", newCustomer.id,[newOrderItem]);

    const orderRepository = new OrderRepository();

    await orderRepository.create(newOrder);

    const updatedOrderItem = new OrderItem("1", newProduct.name, newProduct.price, newProduct.id, 10);
    const updatedOrder = new Order("1", newCustomer.id,[updatedOrderItem]);
    await orderRepository.update(updatedOrder);

    const orderModel = await OrderModel.findOne(
      { where: { id: "1" },
      include: ["items"],
    });

    expect(orderModel?.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "34",
      total: updatedOrder.total(),
      items: [
        {
          id: updatedOrderItem.id,
          name: updatedOrderItem.name,
          product_id: updatedOrderItem.productId,
          price: updatedOrderItem.price,
          quantity: updatedOrderItem.quantity,
          order_id: "1",
        }
      ]
    });
  });

  it('should find a order', async () => {
    const newCustomer = new Customer("34", "John");
    const newAddress = new Address("Rua 1", 10, "BH", "MG");
    newCustomer.setAddress(newAddress);
    newCustomer.activate();
    await new CustomerRepository().create(newCustomer);

    const newProduct = new Product("1", "product 1", 1);
    await new ProductRepository().create(newProduct);

    const newOrderItem = new OrderItem("1", newProduct.name, newProduct.price, newProduct.id, 5);
    const newOrder = new Order("1", newCustomer.id,[newOrderItem]);

    const orderRepository = new OrderRepository();

    await orderRepository.create(newOrder);

    const orderFinded = await orderRepository.find("1");

    expect(orderFinded).toStrictEqual(newOrder);
  });

  it('should find all orders', async () => {
    const orderRepository = new OrderRepository();

    const newCustomer_1 = new Customer("34", "John");
    const newAddress_1 = new Address("Rua 1", 10, "BH", "MG");
    newCustomer_1.setAddress(newAddress_1);
    newCustomer_1.activate();
    await new CustomerRepository().create(newCustomer_1);

    const newProduct_1 = new Product("1", "product 1", 1);
    await new ProductRepository().create(newProduct_1);

    const newOrderItem_1 = new OrderItem("1", newProduct_1.name, newProduct_1.price, newProduct_1.id, 5);
    const newOrder_1 = new Order("1", newCustomer_1.id,[newOrderItem_1]);

    await orderRepository.create(newOrder_1);

    const newCustomer_2 = new Customer("35", "John");
    const newAddress_2 = new Address("Rua 1", 10, "BH", "MG");
    newCustomer_2.setAddress(newAddress_2);
    newCustomer_2.activate();
    await new CustomerRepository().create(newCustomer_2);

    const newProduct_2 = new Product("2", "product 1", 1);
    await new ProductRepository().create(newProduct_2);

    const newOrderItem_2 = new OrderItem("2", newProduct_2.name, newProduct_2.price, newProduct_2.id, 5);
    const newOrder_2 = new Order("2", newCustomer_2.id,[newOrderItem_2]);


    await orderRepository.create(newOrder_2);

    const ordersFinded = await orderRepository.findAll();

    expect(ordersFinded).toStrictEqual([newOrder_1, newOrder_2]);
  });
});