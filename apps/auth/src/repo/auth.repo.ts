import { UserModel } from '@lib/src';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { RecoveryPasswordRepoDto, RegisterRepoDto } from '../dto';

@Injectable()
export class AuthRepo {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  public async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  public async getUserByName(username: string) {
    return this.userModel.findOne({ username });
  }

  public async create(dto: RegisterRepoDto) {
    return this.userModel.create(dto);
  }

  public async setIat(_id: Types.ObjectId, iat: number) {
    return this.userModel.updateOne({ _id }, { iat });
  }

  public async setNewPassword(dto: RecoveryPasswordRepoDto) {
    const { _id, ...data } = dto;
    return this.userModel.findByIdAndUpdate({ _id }, data);
  }
}
