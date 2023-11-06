import { Model, Document, Schema, model, models } from 'mongoose';
import { TwelveMonthReport } from '@/utils/types/models';
import {
  zipCodes,
  months,
  unitedWayFocusAreas,
  focusAreaIndicators,
} from '@/utils/constants';

const IndicatorSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: unitedWayFocusAreas,
    },
    number: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    goal: {
      type: Number,
      required: true,
    },
    indicator: {
      type: String,
      required: true,
      enum: focusAreaIndicators,
    },
    clientsServed: {
      type: Number,
      required: true,
    },
    successfulClientsServed: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

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

const ZipCodeClientsServedSchema = new Schema(
  {
    zipCode: {
      type: String,
      required: true,
      enum: zipCodes,
    },
    clientsServed: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);
const ClientsSexSchema = new Schema(
  {
    female: {
      type: Number,
      required: true,
    },
    male: {
      type: Number,
      required: true,
    },
    other: {
      type: Number,
      required: true,
    },
    unknown: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const ClientsRaceSchema = new Schema(
  {
    caucasian: {
      type: Number,
      required: true,
    },
    africanAmerican: {
      type: Number,
      required: true,
    },
    asianAmerican: {
      type: Number,
      required: true,
    },
    americanIndianAlaskan: {
      type: Number,
      required: true,
    },
    nativeHawaiianPacificIslander: {
      type: Number,
      required: true,
    },
    twoOrMoreRaces: {
      type: Number,
      required: true,
    },
    other: {
      type: Number,
      required: true,
    },
    unknown: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const ClientEthnicitySchema = new Schema(
  {
    hispanicLatino: {
      type: Number,
      required: true,
    },
    notHispanicLatino: {
      type: Number,
      required: true,
    },
    unknown: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const ClientHouseholdIncomeSchema = new Schema(
  {
    belowPoverty: {
      type: Number,
      required: true,
    },
    lowIncome: {
      type: Number,
      required: true,
    },
    aboveLowIncome: {
      type: Number,
      required: true,
    },
    unknown: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const ClientAgeSchema = new Schema(
  {
    underFive: {
      type: Number,
      required: true,
    },
    fiveToSeventeen: {
      type: Number,
      required: true,
    },
    eighteenToTwentyFour: {
      type: Number,
      required: true,
    },
    twentyFiveToFortyFour: {
      type: Number,
      required: true,
    },
    fortyFiveToSixtyFour: {
      type: Number,
      required: true,
    },
    sixtyFiveAndOver: {
      type: Number,
      required: true,
    },
    unknown: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const TwelveMonthReportSchema = new Schema(
  {
    periodStart: TimePeriodSchema,
    periodEnd: TimePeriodSchema,
    nonProfit: {
      type: Schema.Types.ObjectId,
      ref: 'NonProfit',
      required: true,
    },

    clientsServed: {
      type: Number,
      required: true,
    },

    indicators: [IndicatorSchema],

    /**************************
     *      DEMOGRAPHICS      *
     ***************************/

    reportedDemographics: [
      {
        type: String,
        required: true,
        enum: [
          'Client Zip Code',
          'Sex',
          'Race',
          'Ethnicity',
          'Household Income',
          'Age',
        ],
      },
    ],
    zipCodeClientsServed: [ZipCodeClientsServedSchema],
    clientsServedBySex: ClientsSexSchema,
    clientsServedByRace: ClientsRaceSchema,
    clientsServedByEthnicity: ClientEthnicitySchema,
    clientsServedByHouseholdIncome: ClientHouseholdIncomeSchema,
    clientsServedByAge: ClientAgeSchema,
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

TwelveMonthReportSchema.virtual('projects', {
  ref: 'ProjectMember',
  localField: '_id',
  foreignField: 'memberId',
});

TwelveMonthReportSchema.virtual('activeProject', {
  ref: 'ProjectMember',
  localField: '_id',
  foreignField: 'memberId',
  justOne: true,
  match: { active: true },
});

export interface TwelveMonthReportDocument
  extends Omit<TwelveMonthReport, '_id'>,
    Document {}

export default (models.Member as Model<TwelveMonthReportDocument>) ||
  model<TwelveMonthReportDocument>(
    'TwelveMonthReport',
    TwelveMonthReportSchema
  );
