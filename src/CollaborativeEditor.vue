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
let yText = null;

// Flag to prevent infinite loops
let isUpdatingFromYjs = false;

// --- CURSOR POSITION HELPER FUNCTIONS ---

// Saves the current cursor position within the editor
function saveSelection(containerEl) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(containerEl);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;

  return {
    start: start,
    end: start + range.toString().length
  };
}

// Restores the cursor position based on the saved offsets
function restoreSelection(containerEl, savedSelection) {
  if (!savedSelection) {
    return;
  }
  let charIndex = 0;
  const range = document.createRange();
  range.setStart(containerEl, 0);
  range.collapse(true);
  const nodeStack = [containerEl];
  let node, foundStart = false;
  const stop = false;

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType === 3) { // Text node
      const nextCharIndex = charIndex + node.length;
      if (!foundStart && savedSelection.start >= charIndex && savedSelection.start <= nextCharIndex) {
        range.setStart(node, savedSelection.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSelection.end >= charIndex && savedSelection.end <= nextCharIndex) {
        range.setEnd(node, savedSelection.end - charIndex);
        break;
      }
      charIndex = nextCharIndex;
    } else {
      let i = node.childNodes.length;
      while (i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}


// --- Y.js SYNC FUNCTIONS ---

const handleLocalUpdate = () => {
  if (isUpdatingFromYjs || !yText || !editorRef.value) {
    return;
  }
  const newContent = editorRef.value.innerHTML;
  if (newContent !== yText.toString()) {
    ydoc.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, newContent);
    });
  }
};

const renderRemoteChanges = () => {
  if (!editorRef.value) return;

  // Save cursor position before updating the DOM
  const savedSelection = saveSelection(editorRef.value);

  isUpdatingFromYjs = true;
  editorRef.value.innerHTML = yText.toString();
  isUpdatingFromYjs = false;

  // Restore cursor position after the DOM has been updated
  restoreSelection(editorRef.value, savedSelection);
};

onMounted(() => {
  ydoc = new Y.Doc();
  provider = new WebsocketProvider(props.websocketUrl, props.roomName, ydoc);
  yText = ydoc.getText('shared-content');

  yText.observe(renderRemoteChanges);

  if (yText.length > 0) {
    renderRemoteChanges();
  }
});

onUnmounted(() => {
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
