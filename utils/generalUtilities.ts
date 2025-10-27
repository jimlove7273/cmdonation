// utils/fixEncoding.ts
export function fixEncoding(str: string): string {
  try {
    // Encode the misinterpreted Latin-1 text back into bytes
    const bytes = new TextEncoder().encode(str);

    // Decode those bytes as UTF-8
    const decoder = new TextDecoder('utf-8', { fatal: false });
    return decoder.decode(Uint8Array.from(bytes));
  } catch {
    return str; // fallback if decoding fails
  }
}
