<template>
  <div
    ref="editorRef"
    class="collaborative-editor"
    contenteditable="true"
    @input="handleLocalUpdate"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Define the component's props
const props = defineProps({
  roomName: {
    type: String,
    required: true,
  },
  websocketUrl: {
    type: String,
    default: 'ws://localhost:1234',
  },
});

const editorRef = ref(null);

// Y.js instances
let ydoc = null;
let provider = null;
let yXmlFragment = null;

// Flag to prevent infinite loops between Y.js and the DOM
let isUpdatingFromYjs = false;

// Function to handle local user input
const handleLocalUpdate = () => {
  if (isUpdatingFromYjs || !yXmlFragment || !editorRef.value) {
    return;
  }

  // Perform changes within a Y.js transaction
  ydoc.transact(() => {
    // Clear the existing content
    yXmlFragment.delete(0, yXmlFragment.length);

    // Parse the new HTML from the editor
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(editorRef.value.innerHTML, 'text/html');
    const newContent = Y.XmlFragment.fromDOM(doc.body);

    // Insert the new content into the shared type
    yXmlFragment.insert(0, [newContent]);
  });
};

// Function to render remote changes into the editor
const renderRemoteChanges = () => {
  if (!editorRef.value) return;

  isUpdatingFromYjs = true;
  editorRef.value.innerHTML = yXmlFragment.toString();
  // A timeout helps prevent cursor jumping issues
  setTimeout(() => {
    isUpdatingFromYjs = false;
  }, 0);
};

onMounted(() => {
  // Initialize Y.js document
  ydoc = new Y.Doc();

  // Connect to the WebSocket provider with the given room name
  provider = new WebsocketProvider(props.websocketUrl, props.roomName, ydoc);

  // Get the shared data type for our rich text content
  yXmlFragment = ydoc.get('shared-content', Y.XmlFragment);

  // Listen for changes from other users
  yXmlFragment.observe(renderRemoteChanges);

  // Initial render of the content
  renderRemoteChanges();
});

onUnmounted(() => {
  // Clean up connections when the component is destroyed
  if (provider) {
    provider.disconnect();
  }
  if (ydoc) {
    ydoc.destroy();
  }
});
</script>

<style>
.collaborative-editor {
  outline: none;
}
</style>

