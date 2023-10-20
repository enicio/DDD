import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import CustomerModel from './customer.model';
import ProductModel from './product.model';
import OrderModel from './order.model';
import { Col } from 'sequelize/types/utils';

@Table({
  tableName: 'order-items',
  timestamps: false,
})

export default class OrderItemModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @ForeignKey(() => ProductModel)
  @Column({allowNull: false})
  declare product_id: string;

  @BelongsTo(() => ProductModel)
  declare product: ProductModel;

  @ForeignKey(() => OrderModel)
  @Column({allowNull: false})
  declare order_id: string;

  @BelongsTo(() => OrderModel)
  declare order: ProductModel;

  @Column({allowNull: false})
  declare quantity: number;

  @Column({allowNull: false})
  declare name: string;

  @Column({allowNull: false})
  declare price: number;
}