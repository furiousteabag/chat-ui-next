import { AskguruConfiguration, Configuration } from "@/app/_interfaces"

export const defaultConfiguration: Configuration = {
  token: "",
  color: "15BE6C",
  // popupIcon: "https://i.ibb.co/Smdd1Xc/clickhelp-logo.png",
  popupIcon: "/images/popup/askguru.svg",
  popupMessage: "Try <b>AI-powered</b> search!",
  addUnreadDot: true,
  whitelabel: false,
  lang: "en-US",
  windowHeading: "Chat with AI Assistant",
  welcomeMessage: "Hi, ask me anything",
}

export const defaultAskguruConfiguration: AskguruConfiguration = {
  token: "",
  apiUrl: "https://api.askguru.ai/",
  apiVersion: "v2",
  streamGetAnswer: true,
  sourcePattern: "{ *doc_idx *: *([^}]*)}",
}
