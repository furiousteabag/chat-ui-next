import { Configuration, AskguruConfiguration } from "@/app/_interfaces"

export const defaultConfiguration: Configuration = {
  token: "",
  color: "FFFFFF",
  popupIcon: "https://i.ibb.co/Smdd1Xc/clickhelp-logo.png",
  popupMessage: "Hi bro",
  addUnreadDot: false,
  whitelabel: true,
  lang: "en-US",
  windowHeading: "Chat with AI Assistant",
  welcomeMessage: "Hi, ask me anything",
}

export const defaultAskguruConfiguration: AskguruConfiguration = {
  token: "",
  apiUrl: "https://api.askguru.ai/",
  apiVersion: "v2",
  sourcePattern: "{ *doc_idx *: *([^}]*)}",
  streamGetAnswer: true,
}
