import OrderItem from "./order_item";

export default class Order {

  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.calculateTotal();
    this.validate();
  }
  calculateTotal(): number {
    return this._items.reduce((total, item) => total + item.orderItemTotal(), 0);
  }

  total(): number {
    return this._total;
  };

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
  }

}