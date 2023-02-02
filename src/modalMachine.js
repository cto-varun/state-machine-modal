import { Machine, assign } from 'xstate';

export const modalMachine = Machine({
    id: 'modal-machine',
    initial: 'hidden',
    context: {
        originalTitle: 'Default Modal Machine Title',
        finalTitle: 'Default Modal Machine Title',
        payload: {},
    },
    states: {
        hidden: {
            on: { OPEN: 'visible' },
        },
        visible: {
            on: {
                CLOSE: 'hidden',
            },
        },
    },
    on: {
        'SEND.PAYLOAD': {
            actions: assign({
                payload: (ctx, e) => e,
            }),
        },
        'APPEND.TITLE': {
            actions: assign({
                finalTitle: (ctx, e) => ctx.finalTitle + e.value,
            }),
        },
        'CHANGE.TITLE': {
            actions: assign({
                finalTitle: (ctx, e) => e.value,
            }),
        },
        'RESET.TITLE': {
            actions: assign({
                finalTitle: (ctx, e) => ctx.originalTitle,
            }),
        },
    },
});
