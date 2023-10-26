# Chat Pop-up AskGuru Client

A pop-up which embeds inside a website and answer questions.

## Usage

To start using chat on the website, insert `iframe` with params in `<body>` at the root of the website. You can pass configuration parameters with query url. List of available parameters and their default values available in `defaultConfiguration` variable in [configuration.ts](./app/configuration.ts). The only mandatory parameter is `token`.

Example insertion of widget:

```html
<iframe
  src="https://chat-popup.askguru.ai/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZW5kb3IiOiJhc2tndXJ1cHVibGljIiwib3JnYW5pemF0aW9uIjoiYXNrZ3VydSIsInNlY3VyaXR5X2dyb3VwcyI6W119.bR2GxUtV3zeER-s95AsV3UBrssa_ufP7Q1EalkBO5Kw"
  style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"
/>
```

It is deployed on [app.askguru.ai](https://app.askguru.ai/) and trained on [askguru.ai](https://www.askguru.ai/) website content.

## Development

```bash
npm run dev
```

## Deployment

To serve via next.js server, do:

```bash
npm run build
npm run start
```

To serve via static files, add `output: "export"` to `nextConfig` in [next.config.js](./next.config.js) and run:

```bash
npm run build
```

It will result with `./out` folder which can be served via webserver (e.g. nginx).
