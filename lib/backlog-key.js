'use babel';

import BacklogKeyView from './backlog-key-view';
import { CompositeDisposable } from 'atom';

export default {

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
      'backlog-key:toggle': () => this.toggle()
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
  }

};
