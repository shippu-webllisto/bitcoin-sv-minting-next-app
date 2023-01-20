/**
 * @param {array} arr
 * @param {number} count
 * @returns {array} data
 */

export function extractValueOfArray(arr, count) {
  const data = arr.slice(Math.max(arr.length - count, 0));
  return data;
}
