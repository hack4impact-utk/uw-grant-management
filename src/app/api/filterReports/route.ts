/* Might have to edit this so that it takes/matches the ID from orgaization and ID from
 * reports. 
 */ 

import Report from '@/server/models/Report';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';

export async function GET() {
    await dbConnect(); // Ensure the database is connected
  
    try {
      // Fetch all reports from the database
      const reports = await Report.find({});
  
      // Transform the reports into a structure including detailed demographics and other specified fields
      const transformedReports = reports.map(report => ({
        id: report._id.toString(), // Convert ObjectId to string
        organizationId: report.organizationId.toString(),
        clientsServed: report.clientsServed,
        foodAssistance: report.foodAssistance,
        // Add other fields as needed
        reportedDemographics: report.reportedDemographics,
        zipCodeClientsServed: report.zipCodeClientsServed,
        clientsServedBySex: report.clientsServedBySex,
        clientsServedByRace: report.clientsServedByRace,
        clientsServedByEthnicity: report.clientsServedByEthnicity,
        clientsServedByHouseholdIncome: report.clientsServedByHouseholdIncome,
        clientsServedByAge: report.clientsServedByAge,
      }));
  
      // Return the transformed reports as JSON
      return NextResponse.json(
        {
          success: true,
          data: transformedReports,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching report data:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch data' },
        { status: 500 }
      );
    }
  }