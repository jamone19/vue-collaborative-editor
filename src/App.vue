<template>
  <div class="container">
    <header>
      <h1>Vue Collaborative Editor Demo</h1>
      <p>
        Open this page in another browser tab to see real-time collaboration.
      </p>
    </header>
    <main>
      <CollaborativeEditor
        room-name="my-awesome-document-room"
        websocket-url="ws://localhost:1234"
      />
    </main>
  </div>
</template>

<script setup>
// In a real project, you would import from the npm package:
// import { CollaborativeEditor } from 'vue-collaborative-editor';
import { CollaborativeEditor } from '../../src/index';
</script>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  width: 100%;
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

header {
  margin-bottom: 2rem;
}

/* Basic styling for the editor component */
.collaborative-editor {
  border: 1px solid #555;
  border-radius: 8px;
  padding: 1rem;
  min-height: 400px;
  text-align: left;
  background-color: #2f2f2f;
}
</style>

