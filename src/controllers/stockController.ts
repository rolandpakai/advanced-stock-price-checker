import { ScheduledTask } from "node-cron";
import { getStock } from "./stock/getStock";
import { startStockJob, setActiveJobs as setActiveJobsStart } from "./stock/startStockJob";
import { stopStockJob, setActiveJobs as setActiveJobsStop } from "./stock/stopStockJob";

const activeJobs = new Map<string, ScheduledTask>();

setActiveJobsStart(activeJobs);
setActiveJobsStop(activeJobs);

export { getStock, startStockJob, stopStockJob };
