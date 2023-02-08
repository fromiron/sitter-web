import { SetStateAction } from "react";

const PAGE_SIZE = 10;

export function paginationNumGenerator(
  totalPageCount: number,
  pageNum: number
) {
  const pageNumRange = 3;
  const tempArray: Array<number> = [...Array(totalPageCount)].map((_, i) => i);
  const newArray: Array<any> = tempArray.slice(
    pageNum - pageNumRange >= 1 ? pageNum - pageNumRange : 1,
    pageNum + pageNumRange + 1
  );

  if (!newArray.includes(1)) {
    newArray.unshift(1);
  }

  if (!newArray.includes(totalPageCount) && totalPageCount > 0) {
    newArray.push(totalPageCount);
  }
  if (newArray[1] - newArray[0] >= 3) {
    newArray.splice(1, 0, "...");
  }
  if (newArray[newArray.length - 1] - newArray[newArray.length - 2] >= 3) {
    newArray.splice(newArray.length - 1, 0, "...");
  }

  if (newArray[newArray.length - 1] - newArray[newArray.length - 2] === 2) {
    newArray.splice(newArray.length - 1, 0, newArray[newArray.length - 1] - 1);
  }
  return newArray;
}

export function showColumRangeGenerator(
  dataLength: number,
  pageNum: number
): { from: number; to: number } {
  const from: number = dataLength - PAGE_SIZE * (pageNum - 1);
  const to: number =
    from - PAGE_SIZE > 0 ? from - PAGE_SIZE : dataLength > 0 ? 1 : 0;
  return { from, to };
}

export function totalPageCountGenerator(pageCount: number | undefined) {
  const count = pageCount ? pageCount : 0;
  return Math.ceil(count / PAGE_SIZE);
}
