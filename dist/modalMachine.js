"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modalMachine = void 0;
var _xstate = require("xstate");
const modalMachine = (0, _xstate.Machine)({
  id: 'modal-machine',
  initial: 'hidden',
  context: {
    originalTitle: 'Default Modal Machine Title',
    finalTitle: 'Default Modal Machine Title',
    payload: {}
  },
  states: {
    hidden: {
      on: {
        OPEN: 'visible'
      }
    },
    visible: {
      on: {
        CLOSE: 'hidden'
      }
    }
  },
  on: {
    'SEND.PAYLOAD': {
      actions: (0, _xstate.assign)({
        payload: (ctx, e) => e
      })
    },
    'APPEND.TITLE': {
      actions: (0, _xstate.assign)({
        finalTitle: (ctx, e) => ctx.finalTitle + e.value
      })
    },
    'CHANGE.TITLE': {
      actions: (0, _xstate.assign)({
        finalTitle: (ctx, e) => e.value
      })
    },
    'RESET.TITLE': {
      actions: (0, _xstate.assign)({
        finalTitle: (ctx, e) => ctx.originalTitle
      })
    }
  }
});
exports.modalMachine = modalMachine;