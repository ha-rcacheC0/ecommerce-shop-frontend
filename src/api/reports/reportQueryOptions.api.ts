// reportQueryOptions.api.ts
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getReports,
  ReportsQueryParams,
  generateReport,
  downloadReport,
} from "./reports.api";

export const getReportsQueryOptions = (
  token: string,
  params: ReportsQueryParams = {}
) => {
  return queryOptions({
    queryKey: ["reports", params],
    queryFn: () => getReports(token, params),
  });
};

// Custom hook for report generation
export const useGenerateReport = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({
      reportType,
      params,
    }: {
      reportType: string;
      params: ReportsQueryParams;
    }) => generateReport(token, reportType, params),
    onSuccess: () => {
      // Invalidate and refetch reports list when a new report is generated
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// Custom hook for report download
export const useDownloadReport = (token: string) => {
  return useMutation({
    mutationFn: (reportId: string) => downloadReport(token, reportId),
    onSuccess: (data) => {
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${new Date().toISOString()}.csv`; // or appropriate file extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
};
