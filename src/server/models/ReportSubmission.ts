import { Model, Document, Schema, model, models, Types } from 'mongoose';
import { CSVReportRow, ReportSubmission } from '@/utils/types/models';
import { months } from '@/utils/constants';

const TimePeriodSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
      enum: months,
    },
    year: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const ReportSubmissionSchema = new Schema(
  {
    submittedByName: {
      type: String,
      required: true,
    },
    submittedByEmail: {
      type: String,
      required: true,
    },
    periodStart: TimePeriodSchema,
    periodEnd: TimePeriodSchema,
    data: {
      type: Array<CSVReportRow>,
      required: false,
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

interface MongooseReportSubmissionAttributes
  extends Omit<ReportSubmission, 'id'> {
  _id: Types.ObjectId;
}

export interface ReportSubmissionDocument
  extends MongooseReportSubmissionAttributes,
    Document {
  _id: Types.ObjectId; // Ensuring the _id type is consistent
}

export default (models.ReportSubmission as Model<ReportSubmissionDocument>) ||
  model<ReportSubmissionDocument>('ReportSubmission', ReportSubmissionSchema);
