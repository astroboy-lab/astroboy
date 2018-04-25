const ViewManager = require('../lib/ViewManager');
const VIEW = Symbol('Application#view');

module.exports = {

  get view() {
    if (!this[VIEW]) {
      this[VIEW] = new ViewManager(this);
    }
    return this[VIEW];
  }

};