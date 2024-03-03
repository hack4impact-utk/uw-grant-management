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

// Corrected to check models.Organization instead of models.Member
export default (models.Organization as Model<OrganizationDocument>) ||
  model<OrganizationDocument>('Organization', OrganizationSchema);
