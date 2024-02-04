import { Model, Document, Schema, model, models } from 'mongoose';
import { Organization } from '@/utils/types/models';

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    versionKey: false,
    timestamps: true,
  }
);

export interface OrganizationDocument
  extends Omit<Organization, '_id'>,
    Document {}

export default (models.Member as Model<OrganizationDocument>) ||
  model<OrganizationDocument>('Organization', OrganizationSchema);
