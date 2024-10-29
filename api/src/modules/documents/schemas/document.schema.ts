import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { AttachmentType } from 'src/types/attachment.type';

@Schema({
  timestamps: true,
})
export class Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  attachments: Array<AttachmentType>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
DocumentSchema.pre('save', function (next) {
  let document = this;
  // Force first letter in capitalize before saving
  document.name =
    document.name.charAt(0).toLocaleUpperCase() +
    document.name.slice(1).toLocaleLowerCase();
  return next();
});
