/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/types.ts":
/*!*****************************!*\
  !*** ./src/common/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSAction": () => (/* binding */ CSAction)
/* harmony export */ });
// H1B Data
// Actions
var CSAction;
(function (CSAction) {
    CSAction["getH1BData"] = "getH1BData";
})(CSAction || (CSAction = {}));
;


/***/ }),

/***/ "./node_modules/wait-for-the-element/wait-for-the-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/wait-for-the-element/wait-for-the-element.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "waitForTheElement": () => (/* binding */ a),
/* harmony export */   "waitForTheElementToDisappear": () => (/* binding */ l)
/* harmony export */ });
function t(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,u){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==r)return;var e,n,o=[],F=!0,i=!1;try{for(r=r.call(t);!(F=(e=r.next()).done)&&(o.push(e.value),!u||o.length!==u);F=!0);}catch(t){i=!0,n=t}finally{try{F||null==r.return||r.return()}finally{if(i)throw n}}return o}(t,r)||u(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(t,u){if(t){if("string"==typeof t)return r(t,u);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?r(t,u):void 0}}function r(t,u){(null==u||u>t.length)&&(u=t.length);for(var r=0,e=new Array(u);r<u;r++)e[r]=t[r];return e}var e=/\.(?:(?:[\x2D0-9A-Z_a-z\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])|\\(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))+/,n=/#(?:(?:[\x2D0-9A-Z_a-z\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])|\\(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))+/,o=/\[[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*((?:(?:\*|[\x2D0-9A-Z_a-z]*)\|)?(?:(?:[\x2D0-9A-Z_a-z\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+))/g,F={};function i(r){var i=F[r];if(i)return i;i=F[r]={attributes:!0,subtree:!0,childList:!0};var a,l=[],c=function(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=u(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var F,i=!0,a=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){a=!0,F=t},f:function(){try{i||null==e.return||e.return()}finally{if(a)throw F}}}}(r.matchAll(o));try{for(c.s();!(a=c.n()).done;){var D=t(a.value,2)[1];if(D.startsWith("*")||D.startsWith("|"))return i;l.push(D.replace("|",":"))}}catch(t){c.e(t)}finally{c.f()}return e.test(r)&&l.push("class"),n.test(r)&&l.push("id"),0===l.length?i.attributes=!1:i.attributeFilter=l,i}function a(t){var u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=u.timeout,e=void 0===r?2500:r,n=u.scope,o=void 0===n?document:n;return new Promise((function(u){var r=o.querySelector(t);if(null===r){var n=null,F=new MutationObserver((function(){var r=o.querySelector(t);null!==r&&(clearTimeout(n),F.disconnect(),u(r))}));F.observe(o,i(t)),n=setTimeout((function(){F.disconnect(),u(null)}),e)}else u(r)}))}function l(t){var u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=u.timeout,e=void 0===r?2500:r,n=u.scope,o=void 0===n?document:n;return new Promise((function(u){var r=null;if(null!==o.querySelector(t)){var n=new MutationObserver((function(){null===o.querySelector(t)&&(clearTimeout(r),n.disconnect(),u(!0))}));n.observe(o,i(t)),r=setTimeout((function(){n.disconnect(),u(!1)}),e)}else u(!0)}))}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./src/content/linkedin.ts ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/types */ "./src/common/types.ts");
/* harmony import */ var wait_for_the_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wait-for-the-element */ "./node_modules/wait-for-the-element/wait-for-the-element.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var H1B_TAG = "h1buddy-tag";
var LinkedInSelectors;
(function (LinkedInSelectors) {
    LinkedInSelectors["List"] = ".jobs-search-results-list ul";
    LinkedInSelectors["CompanyLink"] = "a.job-card-container__company-name";
})(LinkedInSelectors || (LinkedInSelectors = {}));
var listElement = undefined;
var refreshListElement = function () { return __awaiter(void 0, void 0, void 0, function () {
    var list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0,wait_for_the_element__WEBPACK_IMPORTED_MODULE_1__.waitForTheElement)(LinkedInSelectors.List, {
                    timeout: 10000
                })];
            case 1:
                list = _a.sent();
                if (!list) {
                    throw new Error("No List");
                }
                listElement = list;
                return [2 /*return*/];
        }
    });
}); };
var getCompanyId = function (companyLink) {
    var href = companyLink.href;
    if (!href) {
        return null;
    }
    var url = new URL(href);
    var urlPieces = url.pathname.split("/");
    return urlPieces[2];
};
var constructH1BTag = function (entities) {
    var tag = document.createElement("span");
    tag.style.display = "inline-block";
    tag.style.backgroundColor = "cyan";
    tag.style.color = "black";
    tag.style.fontWeight = "bold";
    tag.style.padding = "4px 8px";
    tag.style.borderRadius = "3px";
    tag.className = H1B_TAG;
    tag.innerHTML = "H1B";
    return tag;
};
var getH1BData = function (linkedInCompanyIds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                chrome.runtime.sendMessage({
                    action: _common_types__WEBPACK_IMPORTED_MODULE_0__.CSAction.getH1BData,
                    payload: {
                        ids: linkedInCompanyIds
                    },
                }, function (response) {
                    if (!response) {
                        console.error(chrome.runtime.lastError);
                        return reject("No Response");
                    }
                    var payload = response.payload, error = response.error;
                    if (error) {
                        return reject(error);
                    }
                    else if (!payload) {
                        return reject("No Payload");
                    }
                    else {
                        return resolve(payload);
                    }
                });
            })];
    });
}); };
var subscribeToMutations = function (targetNode, callback) {
    var observer = new MutationObserver(function (mutationList, observer) {
        console.log("Mutation in List");
        callback();
    });
    observer.observe(targetNode, { childList: true });
};
var h1bData = new Map();
var refreshH1BData = function (companyIds) { return __awaiter(void 0, void 0, void 0, function () {
    var neededCompanyIds, newH1BData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                neededCompanyIds = companyIds.filter(function (companyId) { return !(companyId in h1bData); });
                if (!neededCompanyIds) return [3 /*break*/, 2];
                return [4 /*yield*/, getH1BData(companyIds)];
            case 1:
                newH1BData = _a.sent();
                if (!newH1BData) {
                    console.error("");
                }
                Object.entries(newH1BData).forEach(function (_a) {
                    var linkedInId = _a[0], entry = _a[1];
                    h1bData.set(linkedInId, entry);
                });
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var applyH1BTags = function () { return __awaiter(void 0, void 0, void 0, function () {
    var companyItems, companyIdItems_1, companyIds, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!listElement) return [3 /*break*/, 2];
                return [4 /*yield*/, refreshListElement()];
            case 1:
                _a.sent();
                subscribeToMutations(listElement, applyH1BTags);
                _a.label = 2;
            case 2:
                companyItems = listElement.querySelectorAll(LinkedInSelectors.CompanyLink);
                companyIdItems_1 = {};
                companyItems.forEach(function (child) {
                    var companyId = getCompanyId(child);
                    if (!companyId) {
                        console.warn("No Company Id for:", child);
                        return;
                    }
                    companyIdItems_1[companyId] = child;
                });
                companyIds = Object.keys(companyIdItems_1);
                return [4 /*yield*/, refreshH1BData(companyIds)];
            case 3:
                _a.sent();
                Object.entries(companyIdItems_1).forEach(function (_a) {
                    var _b;
                    var companyId = _a[0], child = _a[1];
                    var h1bEntities = h1bData.get(companyId);
                    if (!h1bEntities) {
                        console.log("No h1bData for:", companyId);
                        return;
                    }
                    var h1bTag = child.nextElementSibling;
                    if (h1bTag && h1bTag.className === H1B_TAG) {
                        return;
                    }
                    var h1bElement = constructH1BTag(h1bEntities);
                    (_b = child.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(h1bElement);
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
applyH1BTags();

})();

/******/ })()
;