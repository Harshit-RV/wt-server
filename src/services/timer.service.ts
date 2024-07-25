import Monitor, { ContactProps, MonitorDoc, MonitorProps } from "../models/Monitor";
import Timer, { TimerDoc, TimerProps } from "../models/Timer";

export const createTimer = async (): Promise<TimerDoc> => {
  const output = new Timer({ lastCheck: Date.now() });
  return output.save();
}

export const updateTimer = async (): Promise<TimerDoc> => {
  const currentTime = Date.now();
  let output = await Timer.findOneAndUpdate({}, { lastCheck: currentTime }, { new: true }).exec();

  if (!output) {
    output = await createTimer();
  }

  return output as TimerDoc;
}

export const getTimer = async (): Promise<TimerDoc> => {
  const output = await Timer.findOne().exec();
  if (!output) {
    return createTimer();
  }
  return output;
}