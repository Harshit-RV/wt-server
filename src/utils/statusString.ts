import { AlertCondition } from "../models/Monitor";

export const statusString = ( alertCondition: AlertCondition ) => {
  switch (alertCondition) {
    case 'ISNOT200':
      return 'URL returns a non-200 status code';
    case 'IS500':
      return 'URL returns a 500 status code';
    case 'ISUNAVAILABLE':
      return 'URL is unavailable';
    case 'IS404':
      return 'URL returns a 404 status code';
    case 'IS501':
      return 'URL returns a 501 status code';
    default:
      return 'URL is down';
  }
}