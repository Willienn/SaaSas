import { IsArray, IsObject, IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  price!: string;

  @IsString()
  user_id!: string;

  @IsObject()
  payment!: {
    method: string;
    status: string;
    transactionId: string;
  };

  @IsString()
  notes!: string;

  @IsString()
  currency!: string;

  @IsArray()
  items!: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;

  @IsString()
  total!: string;

  @IsString()
  subtotal!: string;

  @IsString()
  tax!: string;

  @IsString()
  status!: string;
}
