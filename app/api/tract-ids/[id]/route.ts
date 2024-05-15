import { getTracts } from "utils/getTracts"

export type ReqParams = {
  params: {
    id: string
  }
}

export async function GET(_req: Request, reqParams: ReqParams) {
  const id = reqParams.params.id
  if (typeof id !== "string") {
    return new Response("Error: Invalid ID", {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    })
  }
  try {
    const tracts = await getTracts(id)
    return new Response(JSON.stringify(tracts), {
      headers: {
        "content-type": "application/json",
      },
    })
  } catch (e: any) {
    return new Response(e.message, {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    })
  }
}