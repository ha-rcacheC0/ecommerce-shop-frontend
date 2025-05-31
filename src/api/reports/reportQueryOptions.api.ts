// reportQueryOptions.api.ts

import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  getCaseBreakReport,
  getPurchaseOrderReport,
  processCaseBreakRequest,
  updatePurchaseOrderStatus,
} from "./reports.api";
import { toast } from "react-toastify";
import { queryClient } from "../../main";
import { ReportStatus } from "../../types";

export const getAllCaseBreaksQueryOptions = (
  token: string,
  startDate: string,
  endDate: string,
  statusFilter?: ReportStatus | "ALL"
) =>
  queryOptions({
    queryKey: ["caseBreakReport", startDate, endDate],
    queryFn: () => getCaseBreakReport(token, startDate, endDate, statusFilter),
    enabled: !!token,
  });
export const useProcessCaseBreakMutation = (
  token: string,
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      processCaseBreakRequest(token, id, quantity),
    onSuccess: () => {
      onSuccess();
      toast.success("Case break request processed successfully");
      queryClient.invalidateQueries({ queryKey: ["caseBreakReport"] });
    },
    onError: (error) => {
      onError(error),
        toast.error(
          `Failed to process request: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    },
  });
};
export const getPurchaseOrderReportQueryOptions = (
  token: string,
  startDate: string,
  endDate: string
) =>
  queryOptions({
    queryKey: ["purchaseOrderReport", token, startDate, endDate],
    queryFn: () => getPurchaseOrderReport(token, startDate, endDate),
    enabled: !!token,
  });
export const useUpdatePurchaseOrderMutation = (
  token: string,
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updatePurchaseOrderStatus(token, id, status),
    onSuccess: () => {
      onSuccess();
      toast.success("Purchase order request processed successfully");
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrderReport", token],
      });
    },
    onError: (error) => {
      onError(error),
        toast.error(
          `Failed to process request: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    },
  });
};
