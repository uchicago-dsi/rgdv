export const deepCompareArray = (arr1: unknown[] | undefined, arr2: unknown[] | undefined) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false
  for (let i=0;i<arr1.length;i++){
    if (arr1[i] !== arr2[i])  return false
  }
  return true
}

export const deepCompare2d1d = (arr1: unknown[][], arr2: unknown[]) => {
  for (let i=0;i<arr1.length;i++){
    if (deepCompareArray(arr1[i], arr2)) return true
  }
  return false
}