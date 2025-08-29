import CollaborativeEditor from './CollaborativeEditor.vue';

export default {
  install: (app, options) => {
    app.component('CollaborativeEditor', CollaborativeEditor);
  },
};

export { CollaborativeEditor };

