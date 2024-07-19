class ReportSubmissionService {
  public async deleteReportSubmission(reportSubmissionId: string) {
    return await fetch(`/api/report-submissions/${reportSubmissionId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
const reportSubmissionService = new ReportSubmissionService();
export default reportSubmissionService;
