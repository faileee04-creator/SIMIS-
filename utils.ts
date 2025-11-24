import { NumberingRequest } from './types';

export const toRoman = (num: number): string => {
  const map: Record<number, string> = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
    7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
  };
  return map[num] || '';
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

// Core logic for the numbering system
export const calculateNumber = (
  req: NumberingRequest, 
  allRequests: NumberingRequest[]
): string => {
  // 1. Get all unique dates, sorted chronologically
  const uniqueDates = Array.from(new Set(allRequests.map(r => r.dateSupervision)))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // 2. Find the index of the current request's date (1-based index) -> This is the base Number
  const dateIndex = uniqueDates.indexOf(req.dateSupervision);
  if (dateIndex === -1) return "ERR"; // Should not happen
  
  const baseSequence = dateIndex + 1;
  const formattedSequence = baseSequence.toString().padStart(3, '0');

  // 3. Find requests for THIS date, sorted by creation time
  const requestsForThisDate = allRequests
    .filter(r => r.dateSupervision === req.dateSupervision)
    .sort((a, b) => a.createdAt - b.createdAt);

  // 4. Find index of current request within this date group (0-based)
  const indexInDate = requestsForThisDate.findIndex(r => r.id === req.id);
  
  // 5. Determine suffix: First one is empty, subsequent are .1, .2
  const suffix = indexInDate > 0 ? `.${indexInDate}` : '';

  // 6. Format parts
  const dateObj = new Date(req.dateSupervision);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const monthRoman = toRoman(dateObj.getMonth() + 1);
  const year = dateObj.getFullYear();

  // 7. Construct string: XXX[.Y]/LHP/PM.00.02/JI-24/DD/MM_ROMAN/YYYY
  return `${formattedSequence}${suffix}/LHP/PM.00.02/JI-24/${day}/${monthRoman}/${year}`;
};

export const recalculateAllNumbers = (requests: NumberingRequest[]): NumberingRequest[] => {
  // Need to process effectively to ensure stability, but dynamic recalculation 
  // allows inserting "late" dates correctly into the sequence logic.
  return requests.map(req => ({
    ...req,
    generatedNumber: calculateNumber(req, requests)
  }));
};