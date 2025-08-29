<template>
  <div
    ref="editorRef"
    class="collaborative-editor"
    contenteditable="true"
    @input="handleLocalUpdate"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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
let yText = null; // Switched from Y.XmlFragment to Y.Text

// Flag to prevent infinite loops between Y.js and the DOM
let isUpdatingFromYjs = false;

// Function to handle local user input
const handleLocalUpdate = () => {
  if (isUpdatingFromYjs || !yText || !editorRef.value) {
    return;
  }

  const newContent = editorRef.value.innerHTML;

  // Only update if the content has actually changed to prevent unnecessary transactions
  if (newContent !== yText.toString()) {
    ydoc.transact(() => {
      // Replace the entire content of the Y.Text type with the new HTML string
      yText.delete(0, yText.length);
      yText.insert(0, newContent);
    });
  }
};

// Function to render remote changes into the editor
const renderRemoteChanges = () => {
  if (!editorRef.value) return;

  isUpdatingFromYjs = true;
  editorRef.value.innerHTML = yText.toString();

  // A timeout helps prevent the update loop
  setTimeout(() => {
    isUpdatingFromYjs = false;
  }, 0);
};

onMounted(() => {
  // Initialize Y.js document
  ydoc = new Y.Doc();

  // Connect to the WebSocket provider with the given room name
  provider = new WebsocketProvider(props.websocketUrl, props.roomName, ydoc);

  // **FIX:** Use Y.Text to store the editor's HTML content as a shared string.
  // This is simpler and more reliable than parsing the DOM with Y.XmlFragment.
  yText = ydoc.getText('shared-content');

  // Listen for changes from other users
  yText.observe(renderRemoteChanges);

  // Initial render of the content if it already exists
  if (yText.length > 0) {
    renderRemoteChanges();
  }
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
