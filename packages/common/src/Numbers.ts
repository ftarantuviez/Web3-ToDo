/** Static helpers for {@link Number}. */
export const Numbers = {
  /** Formats a number with commas and a fixed number of decimal places, with a suffix. */
  nFormatter,
  /** Utility function to format a number with commas and a fixed number of decimal places. */
  toLocaleDecimals: (value: number | string | bigint, min = 2, max = 4) => {
    const numValue = Number(value);
    return numValue.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  },
};

/**
 * Formats a number with a suffix (K, M, B, etc.) and a specified number of decimal places.
 *
 * @param value - The number to format. Can be a number, string, or BigInt.
 * @param decimals - The number of decimal places to show. Defaults to 2.
 * @param roundingMode - The rounding mode to use. Can be "ROUND_DOWN" or "ROUND_UP". Defaults to "ROUND_DOWN".
 * @returns A formatted string representation of the number with an appropriate suffix.
 *
 * @example
 * nFormatter(1234, 2) // Returns "1.23K"
 * nFormatter(1234567, 1, "ROUND_UP") // Returns "1.3M"
 * nFormatter(1234567890, 3) // Returns "1.235B"
 *
 * @remarks
 * - The function supports suffixes up to 'Z' (10^21).
 * - If the number is smaller than 1000, no suffix is added.
 * - The function removes trailing zeros after the decimal point.
 */
function nFormatter(
  value: number | string | BigInt,
  decimals = 2,
  roundingMode: "ROUND_DOWN" | "ROUND_UP" = "ROUND_DOWN"
): string {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "Q" },
    { value: 1e18, symbol: "Z" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  // Convert value to a number if it's a string or BigInt
  const numValue = +value;

  // Find the appropriate symbol based on the value
  const item = lookup
    .slice()
    .reverse()
    .find((item) => numValue >= item.value);

  // Calculate the formatted number
  if (item) {
    const dividedValue = numValue / item.value;
    let result: string;

    // Handle rounding modes
    if (roundingMode === "ROUND_DOWN") {
      result = (
        Math.floor(dividedValue * Math.pow(10, decimals)) /
        Math.pow(10, decimals)
      ).toFixed(decimals);
    } else if (roundingMode === "ROUND_UP") {
      result = (
        Math.ceil(dividedValue * Math.pow(10, decimals)) /
        Math.pow(10, decimals)
      ).toFixed(decimals);
    } else {
      result = dividedValue.toFixed(decimals);
    }

    return result.replace(rx, "$1") + item.symbol;
  } else {
    return numValue.toFixed(decimals);
  }
}
