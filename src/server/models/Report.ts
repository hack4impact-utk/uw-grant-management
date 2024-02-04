import { Model, Document, Schema, model, models } from 'mongoose';
import { Report } from '@/utils/types/models';
import { zipCodes, months } from '@/utils/constants';

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

const ReportSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    periodStart: TimePeriodSchema,
    periodEnd: TimePeriodSchema,

    amountAwarded: {
      type: Number,
      required: false,
    },
    clientsServed: {
      type: Number,
      required: true,
    },
    jobsCreated: {
      type: Number,
      required: true,
    },
    partners: {
      type: Number,
      required: true,
    },

    /**************************
     *          FOOD          *
     ***************************/

    // Number of individuals provided food assistance
    foodAssistance: {
      type: Number,
      required: true,
    },

    // Number of individuals with increased food knowledge and skills
    foodKnowledgeAndSkills: {
      type: Number,
      required: true,
    },
    // Number of individuals with increased access to health foods
    accessToHealthyFoods: {
      type: Number,
      required: true,
    },

    // Number of regional fargers, growers, or gardeners supported
    producerSupport: {
      type: Number,
      required: true,
    },

    /**************************
     *        CLOTHING        *
     ***************************/

    // Number of individuals provided clothing assistance
    clothingAssistance: {
      type: Number,
      required: true,
    },

    /**************************
     *        HYGIENE         *
     ***************************/

    // Nu,ber of individuals provided hygiene assistance
    hygieneAssistance: {
      type: Number,
      required: true,
    },

    /**************************
     *      HEALTH CARE       *
     ***************************/

    // Number of individuals provided health care assistance
    healthCareAssistance: {
      type: Number,
      required: true,
    },

    /**************************
     *     MENTAL HEALTH      *
     ***************************/

    // Number of people provided mental health assistance
    mentalHealthAssistance: {
      type: Number,
      required: true,
    },

    /**************************
     *       CHILD CARE       *
     ***************************/

    // Number of birth through PreK children provided child care
    childCareBirthToPreK: {
      type: Number,
      required: true,
    },

    // Total number of child care hours provided for birth through PreK aged children
    childCareBirthToPreKHours: {
      type: Number,
      required: true,
    },

    // Number of school-aged children provided child care
    childCareSchoolAged: {
      type: Number,
      required: true,
    },

    // Total number of child care hours provided for school-aged children
    childCareSchoolAgedHours: {
      type: Number,
      required: true,
    },

    // Number of children provided subsidized or scholarship tuition for child care
    subsidiesOrScholarships: {
      type: Number,
      required: true,
    },

    /**************************
     *        HOUSING         *
     ***************************/

    // Number of individuals provided rental assistance
    rentalAssistance: {
      type: Number,
      required: true,
    },

    // Number of individuals provided utility assistance
    utilityAssistance: {
      type: Number,
      required: true,
    },

    /**************************
     *         OTHER          *
     ***************************/

    // Number of individuals provided other assistance
    otherAssistance: {
      type: Number,
      required: true,
    },

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

export interface ReportDocument extends Omit<Report, '_id'>, Document {}

export default (models.Member as Model<ReportDocument>) ||
  model<ReportDocument>('Report', ReportSchema);
