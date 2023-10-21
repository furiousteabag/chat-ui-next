import { defaultConfiguration } from "../configuration"
import { Configuration } from "@/app/_interfaces"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const configurationCookie = req.cookies.get("configuration")

  if (configurationCookie) {
    // If the cookie exists, it's safe to use JSON.parse.
    const configurationOld = JSON.parse(configurationCookie.value)
    console.log(configurationOld)
  }

  const searchParams: { [id: string]: any } = {}
  req.nextUrl.searchParams.forEach((value, key) => {
    searchParams[key] = value
  })
  const token = searchParams["token"]

  if (!token) {
    return Response.json({ details: "Token should be provided" }, { status: 400 })
  }

  const configuration: Configuration = {
    ...defaultConfiguration,
    ...searchParams,
  }

  return Response.json(configuration, {
    status: 200,
    headers: { "Set-Cookie": `configuration=${JSON.stringify(configuration)}` },
  })
  // return PopupButton()
}
