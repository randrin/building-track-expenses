import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import mongoose from 'mongoose';
import { StatusEnums } from 'src/app/utils/common-enums';
import { Document } from 'src/modules/documents/schemas/document.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { AttachmentType } from 'src/types/attachment.type';

@Schema({
  timestamps: true,
})
export class Project {
  @Prop({ type: Object })
  logo: AttachmentType;

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  contributors: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Document.name })
  documents: Document[];

  @Prop({
    type: String,
    enum: StatusEnums,
    default: StatusEnums.PENDING,
  })
  @IsEnum(StatusEnums)
  status: StatusEnums;

  @Prop()
  deletedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  manager: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.pre('save', function (next) {
  let project = this;
  // Force first letter in capitalize before saving
  project.name =
    project.name.charAt(0).toLocaleUpperCase() +
    project.name.slice(1).toLocaleLowerCase();
  return next();
});
