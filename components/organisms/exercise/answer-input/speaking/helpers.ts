const getColorForValue = (value: number) => {
  if (value === 2) return 'green';
  if (value === 1) return 'orange';
  return 'red';
};

export { getColorForValue };
