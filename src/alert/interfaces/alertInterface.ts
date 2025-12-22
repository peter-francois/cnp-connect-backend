import { Alert, LineAlert } from "@prisma/client";

export interface AlertWithLineAlertInterface extends Alert {
  lineAlert: LineAlert[];
}
