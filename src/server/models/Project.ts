import { Model, Document, Schema, model, models, Types } from 'mongoose';
import { Project } from '@/utils/types/models';

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
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

interface MongooseProjectAttributes extends Omit<Project, 'id'> {
  _id: Types.ObjectId;
}

export interface ProjectDocument extends MongooseProjectAttributes, Document {
  _id: Types.ObjectId; // Ensuring the _id type is consistent
}

export default (models.Project as Model<ProjectDocument>) ||
  model<ProjectDocument>('Project', ProjectSchema);
