'use babel';

import BacklogKeyView from './backlog-key-view';
import { CompositeDisposable } from 'atom';

import { shell } from 'electron';

export default {
  config: {
    url: {
      type: 'string',
      description: 'your backlog space url',
      default: 'https://***.backlog.jp',
    },
  },
  backlogKeyView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.backlogKeyView = new BacklogKeyView(state.backlogKeyViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.backlogKeyView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'backlog-key:openKey': () => this.openKey()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.backlogKeyView.destroy();
  },

  serialize() {
    return {
      backlogKeyViewState: this.backlogKeyView.serialize()
    };
  },

  toggle() {
    console.log('BacklogKey was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  keyAtPosition(editor, cursorPosition) {
    line = editor.lineTextForBufferRow(cursorPosition.row);
    var m = line.match(/[ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789]+-[0-9]+/)
    if(m != null){
      return m[0];
    } else {
      console.log('key not found');
    }
  },

  openKey() {
    console.log('open');
    editor = atom.workspace.getActiveTextEditor();
    cursorPosition = editor.getCursorBufferPosition();
    key = this.keyAtPosition(editor, cursorPosition);
    url = atom.config.get('backlog-key.url');
    if(key){
      url = url + '/view/' + key;
      shell.openExternal(url);
    }
  },
};
