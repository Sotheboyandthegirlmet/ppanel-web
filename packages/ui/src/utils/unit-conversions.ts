import { evaluate, format } from 'mathjs';

export function unitConversion(
  type: 'centsToDollars' | 'dollarsToCents' | 'bitsToMb' | 'mbToBits' | 'bytesToGb' | 'gbToBytes',
  value?: number | string,
) {
  if (!value) return;
  switch (type) {
    case 'centsToDollars':
      return evaluate(`${value} / 100`);
    case 'dollarsToCents':
      return evaluate(`${value} * 100`);
    case 'bitsToMb':
      return evaluate(`${value} / 1024 / 1024`);
    case 'mbToBits':
      return evaluate(`${value} * 1024 * 1024`);
    case 'bytesToGb':
      return evaluate(`${value} / 1024 / 1024 / 1024`);
    case 'gbToBytes':
      return evaluate(`${value} * 1024 * 1024 * 1024`);
    default:
      throw new Error('Invalid conversion type');
  }
}

export function evaluateWithPrecision(expression: string) {
  const result = evaluate(expression);

  const formatted = format(result, { notation: 'fixed', precision: 2 });

  return Number(formatted);
}
