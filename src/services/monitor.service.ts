import Monitor, { MonitorDoc, MonitorProps } from "../models/Monitor";



export const createNewMonitor = async (args: MonitorProps) : Promise<MonitorDoc> => {
  const output = new Monitor(args);
  return output.save();
}

export const getMonitorsByUserId = async (id: String) : Promise<MonitorDoc[]> => {
  return Monitor.find({ userId: id });
}