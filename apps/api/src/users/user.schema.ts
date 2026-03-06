import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: -1 });
UserSchema.index({ name: 1 });

UserSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});
