import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusEnums } from 'src/app/utils/common-enums';
import { User } from 'src/modules/users/schemas/user.schema';
import { Category } from 'src/modules/categories/schemas/category.schema';

@Schema({
  timestamps: true,
})
export class SubCategory {
  @Prop({ unique: [true, 'Title will be unique'] })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: String, enum: StatusEnums, default: StatusEnums.ACTIVE })
  @IsEnum(StatusEnums)
  @IsOptional()
  status: StatusEnums;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
SubCategorySchema.pre('save', function (next) {
  let subCategory = this;
  // Force first letter in capitalize before saving
  subCategory.title =
    subCategory.title.charAt(0).toLocaleUpperCase() +
    subCategory.title.slice(1).toLocaleLowerCase();
  subCategory.description =
    subCategory.description.charAt(0).toLocaleUpperCase() +
    subCategory.description.slice(1).toLocaleLowerCase();
  return next();
});