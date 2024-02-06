import {
  Compression,
  PMTiles,
  RangeResponse,
  ResolvedValueCache,
  Source,
  TileType,
  FetchSource
} from "pmtiles";

class KeyNotFoundError extends Error {}

export async function nativeDecompress(
  buf: ArrayBuffer,
  compression: Compression
): Promise<ArrayBuffer> {
  if (compression === Compression.None || compression === Compression.Unknown) {
    return buf;
  }
  if (compression === Compression.Gzip) {
    const stream = new Response(buf).body;
    const result = stream?.pipeThrough(new DecompressionStream("gzip"));
    return new Response(result).arrayBuffer();
  }
  throw Error("Compression method not supported");
}

export const CACHE = new ResolvedValueCache(25, undefined, nativeDecompress); 

const PMTILES_ENDPOINT = process.env.PMTILES_ENDPOINT!

const sources: Record<string, FetchSource> = {}

export const getSource = (name: string): FetchSource => {
  if (sources[name]) {
    return sources[name]!
  }
  const s = new FetchSource(`${PMTILES_ENDPOINT}${name}.pmtiles`)
  sources[name] = s
  return s
}
