export const getTopFrequentElements = (arr, topN = 1) => {
  const frequencyMap = {};

  for (const element of arr) {
    frequencyMap[element] = (frequencyMap[element] || 0) + 1;
  }

  const sortedElements = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map((item) => item[0]);

  return topN === 1 ? sortedElements[0] : sortedElements;
};
