"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = StateMachineModal;
var _react = _interopRequireWildcard(require("react"));
var _react2 = require("@xstate/react");
var _antd = require("antd");
var sqrl = _interopRequireWildcard(require("squirrelly"));
var _modalMachine = require("./modalMachine");
var _nestedObjectHelpers = require("../../../../src/utils/nestedObjectHelpers");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function StateMachineModal(props) {
  // Params from sample-db.json
  const {
    modalMachineName,
    modalMachineInitialContext,
    modalFooter = null
  } = props.component.params;

  // withContext() is the state machine factory method
  const modalMachineRef = _modalMachine.modalMachine.withContext({
    ..._modalMachine.modalMachine.context,
    ...modalMachineInitialContext
  });
  const [newModalMachineRef, sendnewModalMachine] = (0, _react2.useMachine)(modalMachineRef);
  (0, _react.useEffect)(() => {
    window[window.sessionStorage?.tabId][modalMachineName] = newModalMachineRef;
    return () => {
      delete window[window.sessionStorage?.tabId][modalMachineName];
    };
  });

  // The Modal State Machine can accept a payload from another component, e.g. the Async State Machine
  const {
    finalTitle,
    payload
  } = newModalMachineRef.context;

  // adding these functions to the window object so they can be accessed by the executeJavascriptString function
  (0, _react.useEffect)(() => {
    window[window.sessionStorage?.tabId][`send${modalMachineName}`] = sendnewModalMachine;
    return () => {
      delete window[window.sessionStorage?.tabId][`send${modalMachineName}`];
    };
  });
  const {
    maskClosable,
    modalCancelFunction,
    modalClassName,
    modalStyles = {
      margin: '0 10%'
    },
    bodyStyles = {
      width: '80%'
    }
  } = props.component.params.modalMachineParams;
  const modalVisible = newModalMachineRef.matches('visible');
  const template = (input, data) => {
    const html = input;
    return sqrl.Render(html, data || []);
  };
  function createHTML(input) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (input === '') {
      return {
        __html: ''
      };
    }
    return {
      __html: template(input, data)
    };
  }
  function FooterElement(props) {
    const {
      containerClassName = '',
      template = ''
    } = props.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: containerClassName,
      dangerouslySetInnerHTML: createHTML(template)
    });
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
      buttonsArray = []
    } = props.buttonsContainer;
    if (buttonsArray.length > 0) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: containerClassName
      }, buttonsArray.map(button => {
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
          loading = payload !== null && Object.prototype.hasOwnProperty.call(payload, 'value') && (0, _nestedObjectHelpers.getNestedObject)(payload, isLoadingProperty);
        }
        if (shouldHideButtonProperty !== null) {
          shouldHideButton = payload !== null && Object.prototype.hasOwnProperty.call(payload, 'value') && (0, _nestedObjectHelpers.getNestedObject)(payload, shouldHideButtonProperty);
        }
        if (shouldHideButton) {
          return null;
        }
        return /*#__PURE__*/_react.default.createElement(_antd.Button, _extends({}, buttonProps, {
          onClick: crossBrowserEval(onClick),
          loading: loading
        }), buttonText);
      }));
    }
    return /*#__PURE__*/_react.default.createElement("div", null);
  }
  let footer = null;
  if (modalFooter !== null) {
    const {
      footerContainerClassName = 'modal-footer',
      beforeButtonsContainer = {},
      afterButtonsContainer = {},
      buttonsContainer = {}
    } = modalFooter;

    // The footer can accept an html template with options for before and after the buttons container.
    footer = [/*#__PURE__*/_react.default.createElement("div", {
      key: `${modalMachineName}footerContainer`,
      className: footerContainerClassName
    }, /*#__PURE__*/_react.default.createElement(FooterElement, {
      props: beforeButtonsContainer
    }), /*#__PURE__*/_react.default.createElement(ButtonsContainer, {
      buttonsContainer: buttonsContainer
    }), /*#__PURE__*/_react.default.createElement(FooterElement, {
      props: afterButtonsContainer
    }))];
  }
  const {
    children
  } = props;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "state-machine-modal"
  }, /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    title: finalTitle,
    open: modalVisible,
    onCancel: crossBrowserEval(modalCancelFunction),
    maskClosable: maskClosable,
    className: modalClassName,
    style: {
      ...modalStyles
    },
    bodyStyle: {
      ...bodyStyles
    },
    footer: footer,
    forceRender: true
  }, children));
}
module.exports = exports.default;