type Locale = "en-US" | "ru-RU"

export interface Configuration {
  token: string
  color: string
  lang: Locale
  whitelabel: boolean
  popupIcon: string
  popupMessage: string
  windowHeading: string
  welcomeMessage: string
  addUnreadDot: boolean
  bottomIndent: number
  rightIndent: number
}

export type AskguruApiVersion = "v1" | "v2"

export interface AskguruConfiguration {
  token: string
  apiUrl: string
  apiVersion: AskguruApiVersion
  streamGetAnswer: boolean
  sourcePattern: string
}

type Role = "system" | "user" | "assistant"

export interface MessageType {
  role: Role
  content: string
  requestId?: string
}

export type EventType = "TEST" | "POPUP_SEEN" | "POPUP_CALLED" | "POPUP_NO_ANSWER_CLIENT" | "POPUP_NO_ANSWER_SERVER"

export type LikeStatus = "good_answer" | "wrong_answer"

interface Localization {
  clear: string
  collapse: string
  resize: string
  send: string
  inputPlaceholder: string
  errorMessage: string
}

export type Localizations = {
  [key in Locale]: Localization
}

export type ReactionType = "LIKE" | "DISLIKE"
