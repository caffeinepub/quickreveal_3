export function formatCHF(amount: number | bigint): string {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return `CHF ${numAmount}`;
}

export function formatCHFCompact(amount: number | bigint): string {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return `${numAmount} CHF`;
}
