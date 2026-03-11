import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ required: true })
  price!: string;

  @Prop({ required: true })
  user_id!: string;

  @Prop(
    raw({
      method: { type: String, required: true },
      status: { type: String, required: true },
      transactionId: { type: String, required: true },
    }),
  )
  payment!: {
    method: string;
    status: string;
    transactionId: string;
  };

  @Prop()
  notes!: string;

  @Prop({ required: true })
  currency!: string;

  @Prop({
    required: true,
    type: [
      raw({
        productId: { type: String, required: true },
        name: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      }),
    ],
  })
  items!: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;

  @Prop({ required: true })
  total!: string;

  @Prop({ required: true })
  subtotal!: string;

  @Prop()
  tax!: string;

  @Prop({ required: true })
  status!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
