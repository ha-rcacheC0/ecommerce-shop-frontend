// reports.api.ts
import { Report } from "../../types"; // Assuming you have a Report type defined
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL;

// Define the pagination response interface
export interface ReportsPaginatedResponse {
  items: Report[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Define params interface for the reports endpoint
export interface ReportsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
}

export const getReports = async (
  token: string,
  params: ReportsQueryParams = {}
): Promise<ReportsPaginatedResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.type) queryParams.append("type", params.type);
  if (params.status) queryParams.append("status", params.status);

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  const response = await fetch(`${BASE_URL}/reports${queryString}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// Function to generate a specific report
export const generateReport = async (
  token: string,
  reportType: string,
  params: {
    startDate?: string;
    endDate?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // For additional parameters based on report type
  }
): Promise<{ reportId: string }> => {
  const response = await fetch(`${BASE_URL}/reports/generate/${reportType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

// Function to download a report
export const downloadReport = async (
  token: string,
  reportId: string
): Promise<Blob> => {
  const response = await fetch(`${BASE_URL}/reports/${reportId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.blob();
};
