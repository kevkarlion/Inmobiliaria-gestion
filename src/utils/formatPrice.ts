// utils/format.ts
export const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR").format(value);
