import { AskguruConfiguration, EventType, LikeStatus, MessageType } from "@/app/_interfaces"
import axios from "axios"
import { EventSourcePolyfill } from "event-source-polyfill"
import qs from "qs"

export default class AskguruApi {
  private _config: AskguruConfiguration

  constructor({ askguruConfiguration }: { askguruConfiguration: AskguruConfiguration }) {
    this._config = askguruConfiguration
  }

  get sourcePattern(): string {
    return this._config.sourcePattern
  }

  public getAnswer({ chat, collections = [] }: { chat: MessageType[]; collections?: string[] }): EventSourcePolyfill {
    const route = "/collections/answer"
    const params = {
      chat: JSON.stringify(chat),
      collections: collections,
      stream: this._config.streamGetAnswer,
    }
    const queryString = qs.stringify(params, { arrayFormat: "repeat" })
    const eventSourceUrl = `${this._config.apiUrl}${this._config.apiVersion}${route}?${queryString}`
    const eventSource = new EventSourcePolyfill(eventSourceUrl, {
      headers: {
        Authorization: "Bearer " + this._config.token,
      },
    })
    return eventSource
  }

  private async createApiRequest({
    method,
    route,
    params = {},
    data = {},
  }: {
    method: "GET" | "POST"
    route: string
    params?: { [k: string]: any }
    data?: { [k: string]: any }
  }) {
    const response = await axios({
      method: method,
      url: this._config.apiUrl + this._config.apiVersion + route,
      headers: {
        Authorization: "Bearer " + this._config.token,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      params,
      data,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" })
      },
      timeout: 60000,
    })
    return response
  }

  public async logEvent({ eventType, eventContext }: { eventType: EventType; eventContext?: { [key: string]: any } }) {
    return this.createApiRequest({
      method: "POST",
      route: "/events",
      data: {
        type: eventType,
        context: eventContext,
      },
    })
  }

  public async setReaction({ requestId, likeStatus }: { requestId: string; likeStatus: LikeStatus }) {
    return this.createApiRequest({
      method: "POST",
      route: "/reactions",
      data: {
        request_id: requestId,
        like_status: likeStatus,
      },
    })
  }
}
