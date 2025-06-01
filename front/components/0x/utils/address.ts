"use client";

export const formatWalletAddress = (address: string) => {
  if (address.length < 10) return address;

  const end = address.slice(-4);
  const start = address.slice(0, 6);

  return `${start}•••${end}`;
};
