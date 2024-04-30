import { Model, Document, Schema, model, models, Types } from 'mongoose';
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

interface MongooseOrganizationAttributes extends Omit<Organization, 'id'> {
  _id: Types.ObjectId;
}

export interface OrganizationDocument
  extends MongooseOrganizationAttributes,
    Document {
  _id: Types.ObjectId; // Ensuring the _id type is consistent
}

export default (models.Organization as Model<OrganizationDocument>) ||
  model<OrganizationDocument>('Organization', OrganizationSchema);
