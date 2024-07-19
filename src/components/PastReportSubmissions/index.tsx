import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  useGridApiRef,
} from '@mui/x-data-grid';
import {
  CSVReportRow,
  ReportSubmission,
  TimePeriod,
} from '@/utils/types/models';
import layout from '@/utils/constants/layout';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { ExpectedCSVInfo } from '@/utils/constants';
import MoreVert from '@mui/icons-material/MoreVert';
import { useActionMenu } from '@/hooks/ui';
import { useConfirm } from 'material-ui-confirm';
import { reportSubmissionService } from '@/utils/report-submissions';
import { enqueueSnackbar } from 'notistack';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function generateReportingPeriod(report: ReportSubmission) {
  return `${report.periodStart.month} ${report.periodStart.year} - ${report.periodEnd.month} ${report.periodEnd.year}`;
}
function generateReportTitle(report: ReportSubmission | null) {
  if (!report) {
    return '';
  }
  const dateString = new Date(report.createdAt).toLocaleString();
  return `${generateReportingPeriod(report)} Report (Submitted at ${dateString})`;
}

export default function PastReportSubmissions() {
  const confirm = useConfirm();
  const [data, setData] = useState<ReportSubmission[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportSubmission | null>(
    null
  );
  const reportDialogGridApiRef = useGridApiRef();
  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const reportDialogColumns = useMemo(
    () =>
      Array.from(ExpectedCSVInfo.keys()).map((key) => ({
        field: key,
        headerName: key,
      })),
    []
  );

  const getReportSubmissions = async () => {
    const response = await fetch('/api/report-submissions/');
    const reportSubmissions = await response.json();
    setData(
      reportSubmissions.map((submission: ReportSubmission) => {
        return {
          ...submission,
          data: submission.data.map((row: CSVReportRow, i: number) => ({
            id: i,
            ...row,
          })),
          organizations: Array.from(
            new Set<string>(
              submission.data.map(
                (row: CSVReportRow) => row['Organization Name']
              )
            )
          ).length,
          projects: Array.from(
            new Set<string>(
              submission.data.map((row: CSVReportRow) => row['Project Name'])
            )
          ).length,
        };
      })
    );
    setIsLoading(false);
  };

  useEffect(() => {
    getReportSubmissions();
  }, []);

  const openReportDialog = () => {
    setReportDialogOpen(true);
    setTimeout(() => reportDialogGridApiRef.current.autosizeColumns(), 500);
  };
  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };
  const handleDeleteReportClick = async () => {
    confirm({
      title: 'Are you sure?',
      description: `Please confirm that you want to delete ${generateReportTitle(selectedReport)}. This action is irreversible.`,
    })
      .then(async () => {
        if (!selectedReport) {
          return;
        }
        // TODO: Add more client services like this
        const response = await reportSubmissionService.deleteReportSubmission(
          selectedReport.id
        );

        if (!response.ok) {
          // TODO: Add bad response handling
          return;
        }

        enqueueSnackbar({
          variant: 'success',
          message: 'Report submission deleted!',
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
          autoHideDuration: 2000,
        });
        getReportSubmissions();
      })
      .catch(() => {});
  };
  const { handleOpen, ActionMenu } = useActionMenu({
    actions: [
      {
        label: 'View Report',
        onClick: openReportDialog,
      },
      {
        label: 'Delete Report',
        onClick: handleDeleteReportClick,
      },
    ],
  });

  const handleCellClick: GridEventListener<'cellClick'> = (params, event) => {
    setSelectedReport(params.row);
    handleOpen(event);
  };

  const gridColumns: GridColDef[] = [
    {
      field: 'periodStart',
      headerName: 'Reporting Period',
      width: 200,
      valueGetter: (_: TimePeriod, row: ReportSubmission) =>
        generateReportingPeriod(row),
    },
    {
      field: 'organizations',
      headerName: 'Organizations',
      width: 100,
    },
    {
      field: 'projects',
      headerName: 'Projects',
      width: 100,
    },
    {
      field: 'submittedByName',
      headerName: 'Submitter Name',
      width: 200,
    },
    {
      field: 'submittedByEmail',
      headerName: 'Submitter Email',
      width: 200,
    },
    {
      field: 'createdAt',
      headerName: 'Submitted At',
      type: 'dateTime',
      width: 200,
      valueGetter: (dateString) => new Date(dateString),
    },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<MoreVert />}
            label="More Actions"
            color="inherit"
            key={0}
            onClick={(event) => {
              setSelectedReport(params.row);
              handleOpen(event);
            }}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: `calc(100vh - ${layout.navBarHeight + 5}rem)`,
          margin: '0 2rem',
        }}
      >
        <DataGrid
          loading={isLoading}
          columns={gridColumns}
          rows={data}
          onCellClick={handleCellClick}
        />
        <Dialog
          fullScreen
          open={reportDialogOpen}
          onClose={handleReportDialogClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleReportDialogClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {generateReportTitle(selectedReport)}
              </Typography>
            </Toolbar>
          </AppBar>
          <DataGrid
            columns={reportDialogColumns}
            rows={selectedReport?.data}
            apiRef={reportDialogGridApiRef}
            autosizeOptions={{
              columns: reportDialogColumns.map((colDef) => colDef.field),
              includeOutliers: true,
              includeHeaders: true,
            }}
          />
        </Dialog>
      </Box>
      <ActionMenu />
    </>
  );
}
