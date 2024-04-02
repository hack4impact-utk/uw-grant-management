import { Model, Document, Schema, model, models } from 'mongoose';
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

export interface ProjectDocument extends Omit<Project, '_id'>, Document {}
export default (models.Project as Model<ProjectDocument>) ||
  model<ProjectDocument>('Project', ProjectSchema);
