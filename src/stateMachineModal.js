import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Modal, Button } from 'antd';
import * as sqrl from 'squirrelly';
import { modalMachine } from './modalMachine';
import { getNestedObject } from '../../../../src/utils/nestedObjectHelpers';

export default function StateMachineModal(props) {
    // Params from sample-db.json
    const {
        modalMachineName,
        modalMachineInitialContext,
        modalFooter = null,
    } = props.component.params;

    // withContext() is the state machine factory method
    const modalMachineRef = modalMachine.withContext({
        ...modalMachine.context,
        ...modalMachineInitialContext,
    });

    const [newModalMachineRef, sendnewModalMachine] = useMachine(
        modalMachineRef
    );

    useEffect(() => {
        window[window.sessionStorage?.tabId][modalMachineName] = newModalMachineRef;

        return () => {
            delete window[window.sessionStorage?.tabId][modalMachineName];
        };
    });

    // The Modal State Machine can accept a payload from another component, e.g. the Async State Machine
    const { finalTitle, payload } = newModalMachineRef.context;

    // adding these functions to the window object so they can be accessed by the executeJavascriptString function
    useEffect(() => {
        window[window.sessionStorage?.tabId][`send${modalMachineName}`] = sendnewModalMachine;

        return () => {
            delete window[window.sessionStorage?.tabId][`send${modalMachineName}`];
        };
    });

    const {
        maskClosable,
        modalCancelFunction,
        modalClassName,
        modalStyles = { margin: '0 10%' },
        bodyStyles = { width: '80%' },
    } = props.component.params.modalMachineParams;

    const modalVisible = newModalMachineRef.matches('visible');

    const template = (input, data) => {
        const html = input;
        return sqrl.Render(html, data || []);
    };

    function createHTML(input, data = []) {
        if (input === '') {
            return { __html: '' };
        } 
        return { __html: template(input, data) };
    }

    function FooterElement(props) {
        const { containerClassName = '', template = '' } = props.props;
        return (
            <div
                className={containerClassName}
                dangerouslySetInnerHTML={createHTML(template)}
            />
        );
    }

    // Needed for IE 11
    function crossBrowserEval(input) {
        if (window[window.sessionStorage?.tabId].execScript) {
            window[window.sessionStorage?.tabId].execScript(input);

            return null;
        }
        return window[window.sessionStorage?.tabId].eval ? window[window.sessionStorage?.tabId].eval(input) : eval(input);
    }

    function ButtonsContainer(props) {
        const {
            containerClassName = 'buttons-container',
            buttonsArray = [],
        } = props.buttonsContainer;
        if (buttonsArray.length > 0) {
            return (
                <div className={containerClassName}>
                    {buttonsArray.map((button) => {
                        const {
                            onClick = null,
                            onClickES6 = null,
                            buttonText = '',
                            isLoadingProperty = null,
                            shouldHideButtonProperty = null,
                            ...buttonProps
                        } = button;
                        let loading;
                        let shouldHideButton = false;
                        // The Modal State Machine can accept a payload from another component that will control whether button(s) are loading and whether they should render.
                        if (isLoadingProperty !== null) {
                            loading =
                                payload !== null &&
                                Object.prototype.hasOwnProperty.call(payload, 'value') &&
                                getNestedObject(payload, isLoadingProperty);
                        }
                        if (shouldHideButtonProperty !== null) {
                            shouldHideButton =
                                payload !== null &&
                                Object.prototype.hasOwnProperty.call(payload, 'value') &&
                                getNestedObject(
                                    payload,
                                    shouldHideButtonProperty
                                );
                        }
                        if (shouldHideButton) {
                            return null;
                        }
                        return (
                            <Button
                                {...buttonProps}
                                onClick={crossBrowserEval(onClick)}
                                loading={loading}
                            >
                                {buttonText}
                            </Button>
                        );
                    })}
                </div>
            );
        } 
        return <div />;
    }

    let footer = null;

    if (modalFooter !== null) {
        const {
            footerContainerClassName = 'modal-footer',
            beforeButtonsContainer = {},
            afterButtonsContainer = {},
            buttonsContainer = {},
        } = modalFooter;

        // The footer can accept an html template with options for before and after the buttons container.
        footer = [
            <div
                key={`${modalMachineName  }footerContainer`}
                className={footerContainerClassName}
            >
                <FooterElement props={beforeButtonsContainer} />
                <ButtonsContainer buttonsContainer={buttonsContainer} />
                <FooterElement props={afterButtonsContainer} />
            </div>,
        ];
    }

    const { children } = props;

    return (
        <div className="state-machine-modal">
            <Modal
                title={finalTitle}
                open={modalVisible}
                onCancel={crossBrowserEval(modalCancelFunction)}
                maskClosable={maskClosable}
                className={modalClassName}
                style={{ ...modalStyles }}
                bodyStyle={{ ...bodyStyles }}
                footer={footer}
                forceRender
            >
                {children}
            </Modal>
        </div>
    );
}
