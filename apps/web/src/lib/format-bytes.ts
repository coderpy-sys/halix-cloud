/** Binary byte formatting for RAM, disk, and bandwidth (IEC-ish labels). */

export type ByteUnit = 'B' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB';

export function formatBytes(
  bytes: number,
  decimals = 2,
): { value: number; unit: ByteUnit } {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return { value: 0, unit: 'B' };
  }
  const k = 1024;
  const units: ByteUnit[] = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k)),
  );
  const dm = Math.max(0, Math.floor(decimals));
  const value = Number((bytes / k ** i).toFixed(dm));
  return { value, unit: units[i] };
}

export function bytesToString(bytes: number, decimals = 2): string {
  const { value, unit } = formatBytes(bytes, decimals);
  return `${value} ${unit}`;
}
