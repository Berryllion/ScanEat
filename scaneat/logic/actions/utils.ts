export const concatOrReplace = <T>(array: T[], item: T, discrimField: string) => {
  // @ts-expect-error
  const existing = array.findIndex((e: T) => e[discrimField] === item[discrimField]);
  if (existing !== -1) {
    array[existing] = item
  } else {
    array.push(item);
  }
  return Array.from(array);
}

export const multiConcatOrReplace = <T>(array: T[], items: T[], discrimField: string) => {
  let newArray = array;

  items.forEach((e) => {
    newArray = concatOrReplace(array, e, discrimField);
  });
  return newArray;
}

export const maybeConcatId = (array: Array<number>, id: number) => {
  if (!(id in array)) {
    array.push(id);
  }
  return Array.from(array);
}

export const removeDuplicates = <T>(array: T[], discrimField?: string) => {
  return array.filter((e, i) => array.findIndex((e2) => {
    if (discrimField)
      // @ts-expect-error
      return e2[discrimField] === e[discrimField]
    else
      return e2 === e;
  }) === i);
}