import { PMTiles } from "pmtiles"
import { CACHE, getSource, nativeDecompress } from "utils/pmtiles"

export type tileReqParams = {
  params: {
    args: string[]
  }
}
export async function GET(request: Request, reqParams: tileReqParams) {
  try {
    // get the tilesArgs from the request object
    const tileArgs = reqParams.params.args
    if (!tileArgs || tileArgs.length < 4 || tileArgs.some((a) => typeof a !== "string")) {
      return Response.json(
        "Invalid tileset request. Please provide your tileset request as endpoint/{tileset}/{z}/{x}/{y}",
        { status: 400 }
      )
    }
    const [name, z, x, y] = tileArgs as [string, string, string, string]

    if (!process.env.DATA_ENDPOINT) {
      console.error("DATA_ENDPOINT environment variable is not set")
      return Response.json(
        { error: "Server configuration error: DATA_ENDPOINT not configured" },
        { status: 500 }
      )
    }

    const source = getSource(name)
    const p = new PMTiles(source, CACHE, nativeDecompress)
    
    let pHeader
    try {
      pHeader = await p.getHeader()
    } catch (headerError: any) {
      console.error(`Failed to get header for tileset "${name}":`, headerError)
      return Response.json(
        { 
          error: `Failed to load tileset "${name}"`, 
          message: headerError?.message || "Tileset file may not exist or be inaccessible",
          hint: `Check that ${process.env.DATA_ENDPOINT}${name}.pmtiles exists and is accessible`
        },
        { status: 404 }
      )
    }
    
    if (+z < pHeader.minZoom || +z > pHeader.maxZoom) {
      return Response.json(
        { 
          error: "Tile outside bounds", 
          minZoom: pHeader.minZoom, 
          maxZoom: pHeader.maxZoom, 
          requestedZoom: +z 
        },
        { status: 404 }
      )
    }
    
    const tiledata = await p.getZxy(+z, +x, +y)

    if (!tiledata) {
      return Response.json(
        { error: "Tile not found", z, x, y },
        { status: 404 }
      )
    }
    // return the tile data as image/x-protobuf
    return new Response(tiledata.data, {
      headers: {
        "Content-Type": "image/x-protobuf",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error: any) {
    console.error("Error fetching tile:", error)
    return Response.json(
      { error: "Failed to fetch tile", message: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
