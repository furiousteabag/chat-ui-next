type Lang = "en-US" | "ru-RU"

export interface Configuration {
  token: string
  color: string
  lang: Lang
  whitelabel: boolean
  popupIcon: string
  popupMessage: string
  windowHeading: string
  welcomeMessage: string
  addUnreadDot: boolean
}

export type AskguruApiVersion = "v1" | "v2"

export interface AskguruConfiguration {
  token: string
  apiUrl: string
  apiVersion: AskguruApiVersion
  sourcePattern: string
  streamGetAnswer: boolean
}

type Role = "system" | "user" | "assistant"

interface Message {
  role: Role
  content: string
}

export type Chat = Message[]

export type EventType = "TEST" | "POPUP_SEEN" | "POPUP_CALLED" | "POPUP_NO_ANSWER_CLIENT" | "POPUP_NO_ANSWER_SERVER"

export type LikeStatus = "good_answer" | "wrong_answer"
