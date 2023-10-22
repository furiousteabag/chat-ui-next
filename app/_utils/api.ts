import { AskguruConfiguration, EventType, LikeStatus } from "@/app/_interfaces"
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

  private async createApiRequest({
    method,
    route,
    params,
    data,
  }: {
    method: "GET" | "POST"
    route: string
    params?: { [k: string]: any }
    data?: { [k: string]: any }
  }) {
    params ||= {}
    data ||= {}
    if (params.stream) {
      const queryString = qs.stringify(params, { arrayFormat: "repeat" })
      const eventSourceUrl = `${this._config.apiUrl}${this._config.apiVersion}${route}?${queryString}`
      const eventSource = new EventSourcePolyfill(eventSourceUrl, {
        headers: {
          Authorization: "Bearer " + this._config.token,
        },
      })

      return eventSource
    } else {
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
      return response.data
    }
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

  public async getAnswer({ query, collections }: { query: string; collections?: string[] }) {
    collections ||= [""]
    return this.createApiRequest({
      method: "GET",
      route: "/collections/answer",
      params: {
        collections: collections,
        query: query,
        stream: this._config.streamGetAnswer,
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
