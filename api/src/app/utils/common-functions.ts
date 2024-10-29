export const capitalizeFirstLetter = (item: string) => {
  return capitalizeName(item);
};

export const capitalizeName = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toLocaleUpperCase() + s.slice(1).toLocaleLowerCase();
};
