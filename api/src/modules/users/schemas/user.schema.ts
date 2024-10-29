import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import mongoose from 'mongoose';
import { GenderEnums, UserStatusEnums } from 'src/app/utils/common-enums';
import { AttachmentType } from 'src/types/attachment.type';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: String, enum: GenderEnums, default: GenderEnums.MALE })
  @IsEnum(GenderEnums)
  gender: GenderEnums;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  displayName: string;

  @Prop({ unique: [true, 'Username will be unique'] })
  username: string;

  @Prop()
  biography: string;

  @Prop({ unique: [true, 'Email will be unique'] })
  email: string;

  @Prop()
  dateOfBorn: Date;

  @Prop()
  password: string;

  @Prop({ default: true })
  tmpPassword: boolean;

  @Prop({ type: Object })
  photoURL: AttachmentType;

  @Prop()
  photoRGA: string;

  @Prop({ type: Object })
  contact: {
    phonePrefix: string;
    phoneNumber: string;
  };

  @Prop({ type: Object })
  address: {
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    country: string;
    zipCode: string;
  };

  @Prop({ type: Object })
  settings: {
    currency: string;
    language: string;
  };

  @Prop({
    type: String,
    enum: UserStatusEnums,
    default: UserStatusEnums.NEVER_CONNECTED,
  })
  @IsEnum(UserStatusEnums)
  status: UserStatusEnums;

  @Prop({ type: Object })
  currentProject: any;

  @Prop()
  role: string;

  @Prop()
  lastLogin: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function (next) {
  let user = this;
  // Force first letter in capitalize before saving
  user.firstName =
    user.firstName.charAt(0).toLocaleUpperCase() +
    user.firstName.slice(1).toLocaleLowerCase();
  user.lastName =
    user.lastName.charAt(0).toLocaleUpperCase() +
    user.lastName.slice(1).toLocaleLowerCase();
  user.displayName = user.firstName + ' ' + user.lastName;
  return next();
});
