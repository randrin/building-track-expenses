import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusEnums } from 'src/app/utils/common-enums';
import mongoose from 'mongoose';
import { IsEnum, IsOptional } from 'class-validator';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({ unique: [true, 'Title will be unique'] })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: String, enum: StatusEnums, default: StatusEnums.ACTIVE })
  @IsEnum(StatusEnums)
  @IsOptional()
  status: StatusEnums;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre('save', function (next) {
  let category = this;
  // Force first letter in capitalize before saving
  category.title =
    category.title.charAt(0).toLocaleUpperCase() +
    category.title.slice(1).toLocaleLowerCase();
  category.description =
    category.description.charAt(0).toLocaleUpperCase() +
    category.description.slice(1).toLocaleLowerCase();
  return next();
});