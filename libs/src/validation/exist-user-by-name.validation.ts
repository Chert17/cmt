import { InjectModel } from '@nestjs/mongoose';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';

import { UserModel } from '../database';

@ValidatorConstraint({ async: true })
export class ExistUserByName implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async validate(value: string) {
    const user = await this.userModel.findOne({ username: value });

    return !user;
  }

  defaultMessage() {
    return 'There’s a user with that name in the system';
  }
}
