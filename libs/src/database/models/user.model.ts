import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'user' })
export class UserModel {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  privateKey: string;

  @Prop({ type: Number, default: null })
  iat: number;

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop({ type: [Types.ObjectId], ref: 'community', default: [], index: true })
  communities: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [], ref: 'user', index: true })
  contacts: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'wallet', default: null, index: true })
  walletId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'user-chat-gpt',
    default: null,
    index: true,
  })
  chatGptId: Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(UserModel);

export interface UserDocument extends HydratedDocument<UserModel> {
  createdAt: string;
  updatedAt: string;
}
