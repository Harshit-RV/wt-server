import Monitor, { ContactProps, MonitorDoc, MonitorProps } from "../models/Monitor";

export const createNewMonitor = async (args: MonitorProps) : Promise<MonitorDoc> => {
  const output = new Monitor(args);
  return output.save();
}

export const getMonitorsByUserId = async (id: String) : Promise<MonitorDoc[]> => {
  return Monitor.find({ userId: id });
}

export const getMonitorById = async (id: String) : Promise<MonitorDoc | null> => {
  return Monitor.findById(id);
}

export async function addContactToMonitor(monitorId:string, email:string) {
  try {
    const monitor = await Monitor.findById(monitorId);

    if (!monitor) {
      throw new Error('Monitor not found');
    }

    const newContact : ContactProps = {
      email,
      priorityOrder: monitor.contacts.length + 1,
    }

    monitor.contacts.push(newContact as any);
    await monitor.save();

    return monitor;
  } catch (error) {
    console.error('Error adding contact to monitor:', error);
    throw error;
  }
}

export const deleteMonitor = async (id: string) => {
  return Monitor.findByIdAndDelete(id);
}