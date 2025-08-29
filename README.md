# Vue Collaborative Editor

[![npm version](https://img.shields.io/npm/v/vue-collaborative-editor.svg?style=flat-square)](https://www.npmjs.com/package/vue-collaborative-editor)
[![npm downloads](https://img.shields.io/npm/dm/vue-collaborative-editor.svg?style=flat-square)](https://www.npmjs.com/package/vue-collaborative-editor)
[![license](https://img.shields.io/github/license/jamone19/vue-collaborative-editor.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/jamone19/vue-collaborative-editor/pulls)

A simple, ready-to-use Vue component for collaborative rich-text editing, powered by **Y.js** and **y-websocket**.

This module wraps a `contenteditable` div and syncs its content in real-time with other clients connected to the same document room. It's designed to be a lightweight and easy-to-integrate solution for adding collaborative features to your Vue 3 application.

---

## 🔗 Quick Links
- 🌍 [Live Demo](#-live-demo)  
- 🖼 [Screenshots & Demo](#-screenshots--demo)  
- 🚀 [Features](#features)  
- 📦 [Installation](#installation)  
- 🛠 [Usage](#usage)  
- ⚙️ [Props](#props)  
- 📖 [How It Works](#how-it-works)  
- 💻 [Development & Demo](#development-and-demo)  
- 🐳 [Testing with Podman](#testing-with-podman)  
- 📜 [License & Terms](#license-and-terms)  

---

## 🌍 Live Demo

Try it instantly with a **globally hosted backend**:

👉 [**Open in StackBlitz**](https://stackblitz.com/fork/github/jamone19/vue-collaborative-editor/tree/main/demo-app)  

This demo connects to a **public y-websocket server** so you can collaborate across devices in real-time.  
Open the link in two browsers (or share it with a friend) and watch edits sync live.  

---

### 🛠 Deploy Your Own Backend

You can deploy your own y-websocket server to allow full global collaboration.

#### Docker
```bash
docker build -t y-websocket -f deploy/Dockerfile .
docker run -p 1234:1234 y-websocket
```

#### Render (1-click deploy)
Click below to deploy instantly on Render (free tier):

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

#### Fly.io
```bash
fly launch
fly deploy
```

After deployment, update your Vue app’s `CollaborativeEditor`:

```vue
<CollaborativeEditor
  room-name="my-room"
  websocket-url="wss://your-server-url"
/>
```

---

## 🖼 Screenshots & Demo

### Real-time editing with multiple users
![Collaborative Editing Demo](docs/demo.gif)

> 🔧 To create your own demo GIF:  
> - Run the [demo app](#development-and-demo)  
> - Use a tool like **ScreenToGif**, **Kap**, or **OBS**  
> - Save it into `docs/demo.gif` and it will render here automatically  

---

## Features

- **Real-time Collaboration**: Multiple users can edit the same document simultaneously.  
- **Simple Integration**: Drop the component into your Vue app with minimal setup.  
- **Lightweight**: Relies on the highly efficient Y.js CRDT library.  
- **Customizable**: Style the editor to match your application's theme.  

---

## Installation

You can install the package using npm or yarn:

```bash
npm install vue-collaborative-editor
# or
yarn add vue-collaborative-editor
```

You will also need to have a **y-websocket server** running for collaboration to work. For local development, you can quickly start one:

```bash
npx y-websocket
```

This will start a server at `ws://localhost:1234`.

---

## Usage

Here's a basic example of how to use the `CollaborativeEditor` component in your Vue application:

```vue
<template>
  <div id="app">
    <h1>My Collaborative Document</h1>
    <CollaborativeEditor
      room-name="my-document-room"
      websocket-url="ws://localhost:1234"
    />
  </div>
</template>

<script setup>
import CollaborativeEditor from 'vue-collaborative-editor';
</script>

<style>
.collaborative-editor {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  min-height: 300px;
}
</style>
```

---

## Props

| Prop           | Type   | Default               | Description                                    |
|----------------|--------|-----------------------|------------------------------------------------|
| `roomName`     | String | **required**          | A unique name for the collaborative document room. |
| `websocketUrl` | String | `'ws://localhost:1234'` | The URL of the y-websocket server.             |

---

## License and Terms

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

**Important**: By using this software, you also agree to the terms outlined in the [ADDENDUM.md](ADDENDUM.md) file, which includes important clauses on indemnification and liability.

---

## How It Works

This component uses a `contenteditable` HTML element as the rich-text editor. It leverages **Y.js** to create a shared document (`Y.Doc`) that represents the editor's content. A **y-websocket provider** connects this shared document to a central server, which then broadcasts changes to all connected clients.

The component creates a custom binding between the `contenteditable` div and the Y.js document, ensuring that:

- Local edits are sent to other users  
- Remote edits are rendered locally  

---

## Development and Demo

To contribute or run the demo application locally:

1. **Clone the repository:**

```bash
git clone https://github.com/jamone19/vue-collaborative-editor.git
cd vue-collaborative-editor
```

2. **Install root dependencies:**

```bash
npm install
```

3. **Start the y-websocket server (in a separate terminal):**

```bash
npx y-websocket
```

4. **Run the demo app:**

```bash
cd demo-app
npm install
npm run dev
```

The demo will be available at [http://localhost:4000](http://localhost:4000).

---

## Testing with Podman

You can run the entire development environment, including the websocket server and the demo app, inside a single ephemeral Podman container.

1. **Clone the repository and navigate to the root directory:**

```bash
git clone https://github.com/jamone19/vue-collaborative-editor.git
cd vue-collaborative-editor
```

2. **Run the ephemeral container:**

```bash
podman run -it --rm -p 1234:1234 -p 4000:4000   -w /app -v $(pwd):/app:z   -v /app/node_modules -v /app/demo-app/node_modules   node:22-alpine /bin/sh
```

3. **Inside the container's shell, run the setup script:**

```bash
apk add --update yarn
yarn install
echo "Starting websocket server..."
npx y-websocket &
cd demo-app
yarn install
yarn run dev
```

4. **Access the demo:**

- Demo app: [http://localhost:4000](http://localhost:4000)  
- Websocket server: `ws://localhost:1234`  
