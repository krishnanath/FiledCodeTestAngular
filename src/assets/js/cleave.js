/*!
 * cleave.js - 1.6.0
 * https://github.com/nosir/cleave.js
 * Apache License Version 2.0
 *
 * Copyright (C) 2012-2020 Max Huang https://github.com/nosir/
 */
!(function(root, factory) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = factory())
    : "function" == typeof define && define.amd
    ? define([], factory)
    : "object" == typeof exports
    ? (exports.Cleave = factory())
    : (root.Cleave = factory());
})(this, function() {
  return (function(modules) {
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) return installedModules[moduleId].exports;
      var module = (installedModules[moduleId] = {
        exports: {},
        id: moduleId,
        loaded: !1
      });
      return (
        modules[moduleId].call(
          module.exports,
          module,
          module.exports,
          __webpack_require__
        ),
        (module.loaded = !0),
        module.exports
      );
    }
    var installedModules = {};
    return (
      (__webpack_require__.m = modules),
      (__webpack_require__.c = installedModules),
      (__webpack_require__.p = ""),
      __webpack_require__(0)
    );
  })([
    function(module, exports, __webpack_require__) {
      (function(global) {
        "use strict";
        var Cleave = function(element, opts) {
          var owner = this,
            hasMultipleElements = !1;
          if (
            ("string" == typeof element
              ? ((owner.element = document.querySelector(element)),
                (hasMultipleElements =
                  document.querySelectorAll(element).length > 1))
              : "undefined" != typeof element.length && element.length > 0
              ? ((owner.element = element[0]),
                (hasMultipleElements = element.length > 1))
              : (owner.element = element),
            !owner.element)
          )
            throw new Error("[cleave.js] Please check the element");
          if (hasMultipleElements)
            try {
              console.warn(
                "[cleave.js] Multiple input fields matched, cleave.js will only take the first one."
              );
            } catch (e) {}
          (opts.initValue = owner.element.value),
            (owner.properties = Cleave.DefaultProperties.assign({}, opts)),
            owner.init();
        };
        (Cleave.prototype = {
          init: function() {
            var owner = this,
              pps = owner.properties;
            return pps.numeral ||
              pps.phone ||
              pps.creditCard ||
              pps.time ||
              pps.date ||
              0 !== pps.blocksLength ||
              pps.prefix
              ? ((pps.maxLength = Cleave.Util.getMaxLength(pps.blocks)),
                (owner.isAndroid = Cleave.Util.isAndroid()),
                (owner.lastInputValue = ""),
                (owner.isBackward = ""),
                (owner.onChangeListener = owner.onChange.bind(owner)),
                (owner.onKeyDownListener = owner.onKeyDown.bind(owner)),
                (owner.onFocusListener = owner.onFocus.bind(owner)),
                (owner.onCutListener = owner.onCut.bind(owner)),
                (owner.onCopyListener = owner.onCopy.bind(owner)),
                owner.initSwapHiddenInput(),
                owner.element.addEventListener("input", owner.onChangeListener),
                owner.element.addEventListener(
                  "keydown",
                  owner.onKeyDownListener
                ),
                owner.element.addEventListener("focus", owner.onFocusListener),
                owner.element.addEventListener("cut", owner.onCutListener),
                owner.element.addEventListener("copy", owner.onCopyListener),
                owner.initPhoneFormatter(),
                owner.initDateFormatter(),
                owner.initTimeFormatter(),
                owner.initNumeralFormatter(),
                void (
                  (pps.initValue || (pps.prefix && !pps.noImmediatePrefix)) &&
                  owner.onInput(pps.initValue)
                ))
              : void owner.onInput(pps.initValue);
          },
          initSwapHiddenInput: function() {
            var owner = this,
              pps = owner.properties;
            if (pps.swapHiddenInput) {
              var inputFormatter = owner.element.cloneNode(!0);
              owner.element.parentNode.insertBefore(
                inputFormatter,
                owner.element
              ),
                (owner.elementSwapHidden = owner.element),
                (owner.elementSwapHidden.type = "hidden"),
                (owner.element = inputFormatter),
                (owner.element.id = "");
            }
          },
          initNumeralFormatter: function() {
            var owner = this,
              pps = owner.properties;
            pps.numeral &&
              (pps.numeralFormatter = new Cleave.NumeralFormatter(
                pps.numeralDecimalMark,
                pps.numeralIntegerScale,
                pps.numeralDecimalScale,
                pps.numeralThousandsGroupStyle,
                pps.numeralPositiveOnly,
                pps.stripLeadingZeroes,
                pps.prefix,
                pps.signBeforePrefix,
                pps.tailPrefix,
                pps.delimiter
              ));
          },
          initTimeFormatter: function() {
            var owner = this,
              pps = owner.properties;
            pps.time &&
              ((pps.timeFormatter = new Cleave.TimeFormatter(
                pps.timePattern,
                pps.timeFormat
              )),
              (pps.blocks = pps.timeFormatter.getBlocks()),
              (pps.blocksLength = pps.blocks.length),
              (pps.maxLength = Cleave.Util.getMaxLength(pps.blocks)));
          },
          initDateFormatter: function() {
            var owner = this,
              pps = owner.properties;
            pps.date &&
              ((pps.dateFormatter = new Cleave.DateFormatter(
                pps.datePattern,
                pps.dateMin,
                pps.dateMax
              )),
              (pps.blocks = pps.dateFormatter.getBlocks()),
              (pps.blocksLength = pps.blocks.length),
              (pps.maxLength = Cleave.Util.getMaxLength(pps.blocks)));
          },
          initPhoneFormatter: function() {
            var owner = this,
              pps = owner.properties;
            if (pps.phone)
              try {
                pps.phoneFormatter = new Cleave.PhoneFormatter(
                  new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),
                  pps.delimiter
                );
              } catch (ex) {
                throw new Error(
                  "[cleave.js] Please include phone-type-formatter.{country}.js lib"
                );
              }
          },
          onKeyDown: function(event) {
            var owner = this,
              charCode = event.which || event.keyCode;
            (owner.lastInputValue = owner.element.value),
              (owner.isBackward = 8 === charCode);
          },
          onChange: function(event) {
            var owner = this,
              pps = owner.properties,
              Util = Cleave.Util;
            owner.isBackward =
              owner.isBackward || "deleteContentBackward" === event.inputType;
            var postDelimiter = Util.getPostDelimiter(
              owner.lastInputValue,
              pps.delimiter,
              pps.delimiters
            );
            owner.isBackward && postDelimiter
              ? (pps.postDelimiterBackspace = postDelimiter)
              : (pps.postDelimiterBackspace = !1),
              this.onInput(this.element.value);
          },
          onFocus: function() {
            var owner = this,
              pps = owner.properties;
            (owner.lastInputValue = owner.element.value),
              pps.prefix &&
                pps.noImmediatePrefix &&
                !owner.element.value &&
                this.onInput(pps.prefix),
              Cleave.Util.fixPrefixCursor(
                owner.element,
                pps.prefix,
                pps.delimiter,
                pps.delimiters
              );
          },
          onCut: function(e) {
            Cleave.Util.checkFullSelection(this.element.value) &&
              (this.copyClipboardData(e), this.onInput(""));
          },
          onCopy: function(e) {
            Cleave.Util.checkFullSelection(this.element.value) &&
              this.copyClipboardData(e);
          },
          copyClipboardData: function(e) {
            var owner = this,
              pps = owner.properties,
              Util = Cleave.Util,
              inputValue = owner.element.value,
              textToCopy = "";
            textToCopy = pps.copyDelimiter
              ? inputValue
              : Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
            try {
              e.clipboardData
                ? e.clipboardData.setData("Text", textToCopy)
                : window.clipboardData.setData("Text", textToCopy),
                e.preventDefault();
            } catch (ex) {}
          },
          onInput: function(value) {
            var owner = this,
              pps = owner.properties,
              Util = Cleave.Util,
              postDelimiterAfter = Util.getPostDelimiter(
                value,
                pps.delimiter,
                pps.delimiters
              );
            return (
              pps.numeral ||
                !pps.postDelimiterBackspace ||
                postDelimiterAfter ||
                (value = Util.headStr(
                  value,
                  value.length - pps.postDelimiterBackspace.length
                )),
              pps.phone
                ? (!pps.prefix || (pps.noImmediatePrefix && !value.length)
                    ? (pps.result = pps.phoneFormatter.format(value))
                    : (pps.result =
                        pps.prefix +
                        pps.phoneFormatter
                          .format(value)
                          .slice(pps.prefix.length)),
                  void owner.updateValueState())
                : pps.numeral
                ? (pps.prefix && pps.noImmediatePrefix && 0 === value.length
                    ? (pps.result = "")
                    : (pps.result = pps.numeralFormatter.format(value)),
                  void owner.updateValueState())
                : (pps.date &&
                    (value = pps.dateFormatter.getValidatedDate(value)),
                  pps.time &&
                    (value = pps.timeFormatter.getValidatedTime(value)),
                  (value = Util.stripDelimiters(
                    value,
                    pps.delimiter,
                    pps.delimiters
                  )),
                  (value = Util.getPrefixStrippedValue(
                    value,
                    pps.prefix,
                    pps.prefixLength,
                    pps.result,
                    pps.delimiter,
                    pps.delimiters,
                    pps.noImmediatePrefix,
                    pps.tailPrefix,
                    pps.signBeforePrefix
                  )),
                  (value = pps.numericOnly
                    ? Util.strip(value, /[^\d]/g)
                    : value),
                  (value = pps.uppercase ? value.toUpperCase() : value),
                  (value = pps.lowercase ? value.toLowerCase() : value),
                  pps.prefix &&
                  (pps.tailPrefix
                    ? (value += pps.prefix)
                    : (value = pps.prefix + value),
                  0 === pps.blocksLength)
                    ? ((pps.result = value), void owner.updateValueState())
                    : (pps.creditCard &&
                        owner.updateCreditCardPropsByValue(value),
                      (value = Util.headStr(value, pps.maxLength)),
                      (pps.result = Util.getFormattedValue(
                        value,
                        pps.blocks,
                        pps.blocksLength,
                        pps.delimiter,
                        pps.delimiters,
                        pps.delimiterLazyShow
                      )),
                      void owner.updateValueState()))
            );
          },
          updateCreditCardPropsByValue: function(value) {
            var creditCardInfo,
              owner = this,
              pps = owner.properties,
              Util = Cleave.Util;
            Util.headStr(pps.result, 4) !== Util.headStr(value, 4) &&
              ((creditCardInfo = Cleave.CreditCardDetector.getInfo(
                value,
                pps.creditCardStrictMode
              )),
              (pps.blocks = creditCardInfo.blocks),
              (pps.blocksLength = pps.blocks.length),
              (pps.maxLength = Util.getMaxLength(pps.blocks)),
              pps.creditCardType !== creditCardInfo.type &&
                ((pps.creditCardType = creditCardInfo.type),
                pps.onCreditCardTypeChanged.call(owner, pps.creditCardType)));
          },
          updateValueState: function() {
            var owner = this,
              Util = Cleave.Util,
              pps = owner.properties;
            if (owner.element) {
              var endPos = owner.element.selectionEnd,
                oldValue = owner.element.value,
                newValue = pps.result;
              if (
                ((endPos = Util.getNextCursorPosition(
                  endPos,
                  oldValue,
                  newValue,
                  pps.delimiter,
                  pps.delimiters
                )),
                owner.isAndroid)
              )
                return void window.setTimeout(function() {
                  (owner.element.value = newValue),
                    Util.setSelection(owner.element, endPos, pps.document, !1),
                    owner.callOnValueChanged();
                }, 1);
              (owner.element.value = newValue),
                pps.swapHiddenInput &&
                  (owner.elementSwapHidden.value = owner.getRawValue()),
                Util.setSelection(owner.element, endPos, pps.document, !1),
                owner.callOnValueChanged();
            }
          },
          callOnValueChanged: function() {
            var owner = this,
              pps = owner.properties;
            pps.onValueChanged.call(owner, {
              target: {
                name: owner.element.name,
                value: pps.result,
                rawValue: owner.getRawValue()
              }
            });
          },
          setPhoneRegionCode: function(phoneRegionCode) {
            var owner = this,
              pps = owner.properties;
            (pps.phoneRegionCode = phoneRegionCode),
              owner.initPhoneFormatter(),
              owner.onChange();
          },
          setRawValue: function(value) {
            var owner = this,
              pps = owner.properties;
            (value =
              void 0 !== value && null !== value ? value.toString() : ""),
              pps.numeral &&
                (value = value.replace(".", pps.numeralDecimalMark)),
              (pps.postDelimiterBackspace = !1),
              (owner.element.value = value),
              owner.onInput(value);
          },
          getRawValue: function() {
            var owner = this,
              pps = owner.properties,
              Util = Cleave.Util,
              rawValue = owner.element.value;
            return (
              pps.rawValueTrimPrefix &&
                (rawValue = Util.getPrefixStrippedValue(
                  rawValue,
                  pps.prefix,
                  pps.prefixLength,
                  pps.result,
                  pps.delimiter,
                  pps.delimiters,
                  pps.noImmediatePrefix,
                  pps.tailPrefix,
                  pps.signBeforePrefix
                )),
              (rawValue = pps.numeral
                ? pps.numeralFormatter.getRawValue(rawValue)
                : Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters))
            );
          },
          getISOFormatDate: function() {
            var owner = this,
              pps = owner.properties;
            return pps.date ? pps.dateFormatter.getISOFormatDate() : "";
          },
          getISOFormatTime: function() {
            var owner = this,
              pps = owner.properties;
            return pps.time ? pps.timeFormatter.getISOFormatTime() : "";
          },
          getFormattedValue: function() {
            return this.element.value;
          },
          destroy: function() {
            var owner = this;
            owner.element.removeEventListener("input", owner.onChangeListener),
              owner.element.removeEventListener(
                "keydown",
                owner.onKeyDownListener
              ),
              owner.element.removeEventListener("focus", owner.onFocusListener),
              owner.element.removeEventListener("cut", owner.onCutListener),
              owner.element.removeEventListener("copy", owner.onCopyListener);
          },
          toString: function() {
            return "[Cleave Object]";
          }
        }),
          (Cleave.NumeralFormatter = __webpack_require__(1)),
          (Cleave.DateFormatter = __webpack_require__(2)),
          (Cleave.TimeFormatter = __webpack_require__(3)),
          (Cleave.PhoneFormatter = __webpack_require__(4)),
          (Cleave.CreditCardDetector = __webpack_require__(5)),
          (Cleave.Util = __webpack_require__(6)),
          (Cleave.DefaultProperties = __webpack_require__(7)),
          (("object" == typeof global && global
            ? global
            : window
          ).Cleave = Cleave),
          (module.exports = Cleave),
          angular.module("cleave.js", []).directive("cleave", function() {
            return {
              restrict: "A",
              require: "ngModel",
              scope: { cleave: "&", onInit: "&?", onValueChange: "&?" },
              compile: function() {
                return {
                  pre: function($scope, $element, attrs, ngModelCtrl) {
                    ($scope.instance = new Cleave(
                      $element[0],
                      $scope.cleave()
                    )),
                      $scope.onInit && $scope.onInit()($scope.instance),
                      ngModelCtrl.$formatters.push(function(val) {
                        return (
                          $scope.instance.setRawValue(val),
                          $scope.instance.getFormattedValue()
                        );
                      }),
                      ngModelCtrl.$parsers.push(function(newFormattedValue) {
                        return (
                          $scope.onValueChange &&
                            $scope.onValueChange()(newFormattedValue),
                          $scope.instance.getRawValue()
                        );
                      }),
                      $scope.$watch(
                        function() {
                          return $scope.cleave();
                        },
                        function(newOptions, oldOptions) {
                          $scope.instance.destroy(),
                            ($scope.instance = new Cleave(
                              $element[0],
                              newOptions
                            ));
                        },
                        !0
                      ),
                      $scope.$on("$destroy", function() {
                        $scope.instance.destroy(), ($scope.instance = null);
                      });
                  }
                };
              }
            };
          });
      }.call(
        exports,
        (function() {
          return this;
        })()
      ));
    },
    function(module, exports) {
      "use strict";
      var NumeralFormatter = function(
        numeralDecimalMark,
        numeralIntegerScale,
        numeralDecimalScale,
        numeralThousandsGroupStyle,
        numeralPositiveOnly,
        stripLeadingZeroes,
        prefix,
        signBeforePrefix,
        tailPrefix,
        delimiter
      ) {
        var owner = this;
        (owner.numeralDecimalMark = numeralDecimalMark || "."),
          (owner.numeralIntegerScale =
            numeralIntegerScale > 0 ? numeralIntegerScale : 0),
          (owner.numeralDecimalScale =
            numeralDecimalScale >= 0 ? numeralDecimalScale : 2),
          (owner.numeralThousandsGroupStyle =
            numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand),
          (owner.numeralPositiveOnly = !!numeralPositiveOnly),
          (owner.stripLeadingZeroes = stripLeadingZeroes !== !1),
          (owner.prefix = prefix || "" === prefix ? prefix : ""),
          (owner.signBeforePrefix = !!signBeforePrefix),
          (owner.tailPrefix = !!tailPrefix),
          (owner.delimiter = delimiter || "" === delimiter ? delimiter : ","),
          (owner.delimiterRE = delimiter
            ? new RegExp("\\" + delimiter, "g")
            : "");
      };
      (NumeralFormatter.groupStyle = {
        thousand: "thousand",
        lakh: "lakh",
        wan: "wan",
        none: "none"
      }),
        (NumeralFormatter.prototype = {
          getRawValue: function(value) {
            return value
              .replace(this.delimiterRE, "")
              .replace(this.numeralDecimalMark, ".");
          },
          format: function(value) {
            var parts,
              partSign,
              partSignAndPrefix,
              partInteger,
              owner = this,
              partDecimal = "";
            switch (
              ((value = value
                .replace(/[A-Za-z]/g, "")
                .replace(owner.numeralDecimalMark, "M")
                .replace(/[^\dM-]/g, "")
                .replace(/^\-/, "N")
                .replace(/\-/g, "")
                .replace("N", owner.numeralPositiveOnly ? "" : "-")
                .replace("M", owner.numeralDecimalMark)),
              owner.stripLeadingZeroes &&
                (value = value.replace(/^(-)?0+(?=\d)/, "$1")),
              (partSign = "-" === value.slice(0, 1) ? "-" : ""),
              (partSignAndPrefix =
                "undefined" != typeof owner.prefix
                  ? owner.signBeforePrefix
                    ? partSign + owner.prefix
                    : owner.prefix + partSign
                  : partSign),
              (partInteger = value),
              value.indexOf(owner.numeralDecimalMark) >= 0 &&
                ((parts = value.split(owner.numeralDecimalMark)),
                (partInteger = parts[0]),
                (partDecimal =
                  owner.numeralDecimalMark +
                  parts[1].slice(0, owner.numeralDecimalScale))),
              "-" === partSign && (partInteger = partInteger.slice(1)),
              owner.numeralIntegerScale > 0 &&
                (partInteger = partInteger.slice(0, owner.numeralIntegerScale)),
              owner.numeralThousandsGroupStyle)
            ) {
              case NumeralFormatter.groupStyle.lakh:
                partInteger = partInteger.replace(
                  /(\d)(?=(\d\d)+\d$)/g,
                  "$1" + owner.delimiter
                );
                break;
              case NumeralFormatter.groupStyle.wan:
                partInteger = partInteger.replace(
                  /(\d)(?=(\d{4})+$)/g,
                  "$1" + owner.delimiter
                );
                break;
              case NumeralFormatter.groupStyle.thousand:
                partInteger = partInteger.replace(
                  /(\d)(?=(\d{3})+$)/g,
                  "$1" + owner.delimiter
                );
            }
            return owner.tailPrefix
              ? partSign +
                  partInteger.toString() +
                  (owner.numeralDecimalScale > 0
                    ? partDecimal.toString()
                    : "") +
                  owner.prefix
              : partSignAndPrefix +
                  partInteger.toString() +
                  (owner.numeralDecimalScale > 0 ? partDecimal.toString() : "");
          }
        }),
        (module.exports = NumeralFormatter);
    },
    function(module, exports) {
      "use strict";
      var DateFormatter = function(datePattern, dateMin, dateMax) {
        var owner = this;
        (owner.date = []),
          (owner.blocks = []),
          (owner.datePattern = datePattern),
          (owner.dateMin = dateMin
            .split("-")
            .reverse()
            .map(function(x) {
              return parseInt(x, 10);
            })),
          2 === owner.dateMin.length && owner.dateMin.unshift(0),
          (owner.dateMax = dateMax
            .split("-")
            .reverse()
            .map(function(x) {
              return parseInt(x, 10);
            })),
          2 === owner.dateMax.length && owner.dateMax.unshift(0),
          owner.initBlocks();
      };
      (DateFormatter.prototype = {
        initBlocks: function() {
          var owner = this;
          owner.datePattern.forEach(function(value) {
            "Y" === value ? owner.blocks.push(4) : owner.blocks.push(2);
          });
        },
        getISOFormatDate: function() {
          var owner = this,
            date = owner.date;
          return date[2]
            ? date[2] +
                "-" +
                owner.addLeadingZero(date[1]) +
                "-" +
                owner.addLeadingZero(date[0])
            : "";
        },
        getBlocks: function() {
          return this.blocks;
        },
        getValidatedDate: function(value) {
          var owner = this,
            result = "";
          return (
            (value = value.replace(/[^\d]/g, "")),
            owner.blocks.forEach(function(length, index) {
              if (value.length > 0) {
                var sub = value.slice(0, length),
                  sub0 = sub.slice(0, 1),
                  rest = value.slice(length);
                switch (owner.datePattern[index]) {
                  case "d":
                    "00" === sub
                      ? (sub = "01")
                      : parseInt(sub0, 10) > 3
                      ? (sub = "0" + sub0)
                      : parseInt(sub, 10) > 31 && (sub = "31");
                    break;
                  case "m":
                    "00" === sub
                      ? (sub = "01")
                      : parseInt(sub0, 10) > 1
                      ? (sub = "0" + sub0)
                      : parseInt(sub, 10) > 12 && (sub = "12");
                }
                (result += sub), (value = rest);
              }
            }),
            this.getFixedDateString(result)
          );
        },
        getFixedDateString: function(value) {
          var day,
            month,
            year,
            owner = this,
            datePattern = owner.datePattern,
            date = [],
            dayIndex = 0,
            monthIndex = 0,
            yearIndex = 0,
            dayStartIndex = 0,
            monthStartIndex = 0,
            yearStartIndex = 0,
            fullYearDone = !1;
          4 === value.length &&
            "y" !== datePattern[0].toLowerCase() &&
            "y" !== datePattern[1].toLowerCase() &&
            ((dayStartIndex = "d" === datePattern[0] ? 0 : 2),
            (monthStartIndex = 2 - dayStartIndex),
            (day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10)),
            (month = parseInt(
              value.slice(monthStartIndex, monthStartIndex + 2),
              10
            )),
            (date = this.getFixedDate(day, month, 0))),
            8 === value.length &&
              (datePattern.forEach(function(type, index) {
                switch (type) {
                  case "d":
                    dayIndex = index;
                    break;
                  case "m":
                    monthIndex = index;
                    break;
                  default:
                    yearIndex = index;
                }
              }),
              (yearStartIndex = 2 * yearIndex),
              (dayStartIndex =
                dayIndex <= yearIndex ? 2 * dayIndex : 2 * dayIndex + 2),
              (monthStartIndex =
                monthIndex <= yearIndex ? 2 * monthIndex : 2 * monthIndex + 2),
              (day = parseInt(
                value.slice(dayStartIndex, dayStartIndex + 2),
                10
              )),
              (month = parseInt(
                value.slice(monthStartIndex, monthStartIndex + 2),
                10
              )),
              (year = parseInt(
                value.slice(yearStartIndex, yearStartIndex + 4),
                10
              )),
              (fullYearDone =
                4 === value.slice(yearStartIndex, yearStartIndex + 4).length),
              (date = this.getFixedDate(day, month, year))),
            4 !== value.length ||
              ("y" !== datePattern[0] && "y" !== datePattern[1]) ||
              ((monthStartIndex = "m" === datePattern[0] ? 0 : 2),
              (yearStartIndex = 2 - monthStartIndex),
              (month = parseInt(
                value.slice(monthStartIndex, monthStartIndex + 2),
                10
              )),
              (year = parseInt(
                value.slice(yearStartIndex, yearStartIndex + 2),
                10
              )),
              (fullYearDone =
                2 === value.slice(yearStartIndex, yearStartIndex + 2).length),
              (date = [0, month, year])),
            6 !== value.length ||
              ("Y" !== datePattern[0] && "Y" !== datePattern[1]) ||
              ((monthStartIndex = "m" === datePattern[0] ? 0 : 4),
              (yearStartIndex = 2 - 0.5 * monthStartIndex),
              (month = parseInt(
                value.slice(monthStartIndex, monthStartIndex + 2),
                10
              )),
              (year = parseInt(
                value.slice(yearStartIndex, yearStartIndex + 4),
                10
              )),
              (fullYearDone =
                4 === value.slice(yearStartIndex, yearStartIndex + 4).length),
              (date = [0, month, year])),
            (date = owner.getRangeFixedDate(date)),
            (owner.date = date);
          var result =
            0 === date.length
              ? value
              : datePattern.reduce(function(previous, current) {
                  switch (current) {
                    case "d":
                      return (
                        previous +
                        (0 === date[0] ? "" : owner.addLeadingZero(date[0]))
                      );
                    case "m":
                      return (
                        previous +
                        (0 === date[1] ? "" : owner.addLeadingZero(date[1]))
                      );
                    case "y":
                      return (
                        previous +
                        (fullYearDone
                          ? owner.addLeadingZeroForYear(date[2], !1)
                          : "")
                      );
                    case "Y":
                      return (
                        previous +
                        (fullYearDone
                          ? owner.addLeadingZeroForYear(date[2], !0)
                          : "")
                      );
                  }
                }, "");
          return result;
        },
        getRangeFixedDate: function(date) {
          var owner = this,
            datePattern = owner.datePattern,
            dateMin = owner.dateMin || [],
            dateMax = owner.dateMax || [];
          return !date.length || (dateMin.length < 3 && dateMax.length < 3)
            ? date
            : datePattern.find(function(x) {
                return "y" === x.toLowerCase();
              }) && 0 === date[2]
            ? date
            : dateMax.length &&
              (dateMax[2] < date[2] ||
                (dateMax[2] === date[2] &&
                  (dateMax[1] < date[1] ||
                    (dateMax[1] === date[1] && dateMax[0] < date[0]))))
            ? dateMax
            : dateMin.length &&
              (dateMin[2] > date[2] ||
                (dateMin[2] === date[2] &&
                  (dateMin[1] > date[1] ||
                    (dateMin[1] === date[1] && dateMin[0] > date[0]))))
            ? dateMin
            : date;
        },
        getFixedDate: function(day, month, year) {
          return (
            (day = Math.min(day, 31)),
            (month = Math.min(month, 12)),
            (year = parseInt(year || 0, 10)),
            ((month < 7 && month % 2 === 0) ||
              (month > 8 && month % 2 === 1)) &&
              (day = Math.min(
                day,
                2 === month ? (this.isLeapYear(year) ? 29 : 28) : 30
              )),
            [day, month, year]
          );
        },
        isLeapYear: function(year) {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },
        addLeadingZero: function(number) {
          return (number < 10 ? "0" : "") + number;
        },
        addLeadingZeroForYear: function(number, fullYearMode) {
          return fullYearMode
            ? (number < 10
                ? "000"
                : number < 100
                ? "00"
                : number < 1e3
                ? "0"
                : "") + number
            : (number < 10 ? "0" : "") + number;
        }
      }),
        (module.exports = DateFormatter);
    },
    function(module, exports) {
      "use strict";
      var TimeFormatter = function(timePattern, timeFormat) {
        var owner = this;
        (owner.time = []),
          (owner.blocks = []),
          (owner.timePattern = timePattern),
          (owner.timeFormat = timeFormat),
          owner.initBlocks();
      };
      (TimeFormatter.prototype = {
        initBlocks: function() {
          var owner = this;
          owner.timePattern.forEach(function() {
            owner.blocks.push(2);
          });
        },
        getISOFormatTime: function() {
          var owner = this,
            time = owner.time;
          return time[2]
            ? owner.addLeadingZero(time[0]) +
                ":" +
                owner.addLeadingZero(time[1]) +
                ":" +
                owner.addLeadingZero(time[2])
            : "";
        },
        getBlocks: function() {
          return this.blocks;
        },
        getTimeFormatOptions: function() {
          var owner = this;
          return "12" === String(owner.timeFormat)
            ? {
                maxHourFirstDigit: 1,
                maxHours: 12,
                maxMinutesFirstDigit: 5,
                maxMinutes: 60
              }
            : {
                maxHourFirstDigit: 2,
                maxHours: 23,
                maxMinutesFirstDigit: 5,
                maxMinutes: 60
              };
        },
        getValidatedTime: function(value) {
          var owner = this,
            result = "";
          value = value.replace(/[^\d]/g, "");
          var timeFormatOptions = owner.getTimeFormatOptions();
          return (
            owner.blocks.forEach(function(length, index) {
              if (value.length > 0) {
                var sub = value.slice(0, length),
                  sub0 = sub.slice(0, 1),
                  rest = value.slice(length);
                switch (owner.timePattern[index]) {
                  case "h":
                    parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit
                      ? (sub = "0" + sub0)
                      : parseInt(sub, 10) > timeFormatOptions.maxHours &&
                        (sub = timeFormatOptions.maxHours + "");
                    break;
                  case "m":
                  case "s":
                    parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit
                      ? (sub = "0" + sub0)
                      : parseInt(sub, 10) > timeFormatOptions.maxMinutes &&
                        (sub = timeFormatOptions.maxMinutes + "");
                }
                (result += sub), (value = rest);
              }
            }),
            this.getFixedTimeString(result)
          );
        },
        getFixedTimeString: function(value) {
          var second,
            minute,
            hour,
            owner = this,
            timePattern = owner.timePattern,
            time = [],
            secondIndex = 0,
            minuteIndex = 0,
            hourIndex = 0,
            secondStartIndex = 0,
            minuteStartIndex = 0,
            hourStartIndex = 0;
          return (
            6 === value.length &&
              (timePattern.forEach(function(type, index) {
                switch (type) {
                  case "s":
                    secondIndex = 2 * index;
                    break;
                  case "m":
                    minuteIndex = 2 * index;
                    break;
                  case "h":
                    hourIndex = 2 * index;
                }
              }),
              (hourStartIndex = hourIndex),
              (minuteStartIndex = minuteIndex),
              (secondStartIndex = secondIndex),
              (second = parseInt(
                value.slice(secondStartIndex, secondStartIndex + 2),
                10
              )),
              (minute = parseInt(
                value.slice(minuteStartIndex, minuteStartIndex + 2),
                10
              )),
              (hour = parseInt(
                value.slice(hourStartIndex, hourStartIndex + 2),
                10
              )),
              (time = this.getFixedTime(hour, minute, second))),
            4 === value.length &&
              owner.timePattern.indexOf("s") < 0 &&
              (timePattern.forEach(function(type, index) {
                switch (type) {
                  case "m":
                    minuteIndex = 2 * index;
                    break;
                  case "h":
                    hourIndex = 2 * index;
                }
              }),
              (hourStartIndex = hourIndex),
              (minuteStartIndex = minuteIndex),
              (second = 0),
              (minute = parseInt(
                value.slice(minuteStartIndex, minuteStartIndex + 2),
                10
              )),
              (hour = parseInt(
                value.slice(hourStartIndex, hourStartIndex + 2),
                10
              )),
              (time = this.getFixedTime(hour, minute, second))),
            (owner.time = time),
            0 === time.length
              ? value
              : timePattern.reduce(function(previous, current) {
                  switch (current) {
                    case "s":
                      return previous + owner.addLeadingZero(time[2]);
                    case "m":
                      return previous + owner.addLeadingZero(time[1]);
                    case "h":
                      return previous + owner.addLeadingZero(time[0]);
                  }
                }, "")
          );
        },
        getFixedTime: function(hour, minute, second) {
          return (
            (second = Math.min(parseInt(second || 0, 10), 60)),
            (minute = Math.min(minute, 60)),
            (hour = Math.min(hour, 60)),
            [hour, minute, second]
          );
        },
        addLeadingZero: function(number) {
          return (number < 10 ? "0" : "") + number;
        }
      }),
        (module.exports = TimeFormatter);
    },
    function(module, exports) {
      "use strict";
      var PhoneFormatter = function(formatter, delimiter) {
        var owner = this;
        (owner.delimiter = delimiter || "" === delimiter ? delimiter : " "),
          (owner.delimiterRE = delimiter
            ? new RegExp("\\" + delimiter, "g")
            : ""),
          (owner.formatter = formatter);
      };
      (PhoneFormatter.prototype = {
        setFormatter: function(formatter) {
          this.formatter = formatter;
        },
        format: function(phoneNumber) {
          var owner = this;
          owner.formatter.clear(),
            (phoneNumber = phoneNumber.replace(/[^\d+]/g, "")),
            (phoneNumber = phoneNumber
              .replace(/^\+/, "B")
              .replace(/\+/g, "")
              .replace("B", "+")),
            (phoneNumber = phoneNumber.replace(owner.delimiterRE, ""));
          for (
            var current,
              result = "",
              validated = !1,
              i = 0,
              iMax = phoneNumber.length;
            i < iMax;
            i++
          )
            (current = owner.formatter.inputDigit(phoneNumber.charAt(i))),
              /[\s()-]/g.test(current)
                ? ((result = current), (validated = !0))
                : validated || (result = current);
          return (
            (result = result.replace(/[()]/g, "")),
            (result = result.replace(/[\s-]/g, owner.delimiter))
          );
        }
      }),
        (module.exports = PhoneFormatter);
    },
    function(module, exports) {
      "use strict";
      var CreditCardDetector = {
        blocks: {
          uatp: [4, 5, 6],
          amex: [4, 6, 5],
          diners: [4, 6, 4],
          discover: [4, 4, 4, 4],
          mastercard: [4, 4, 4, 4],
          dankort: [4, 4, 4, 4],
          instapayment: [4, 4, 4, 4],
          jcb15: [4, 6, 5],
          jcb: [4, 4, 4, 4],
          maestro: [4, 4, 4, 4],
          visa: [4, 4, 4, 4],
          mir: [4, 4, 4, 4],
          unionPay: [4, 4, 4, 4],
          general: [4, 4, 4, 4]
        },
        re: {
          uatp: /^(?!1800)1\d{0,14}/,
          amex: /^3[47]\d{0,13}/,
          discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
          diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
          mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
          dankort: /^(5019|4175|4571)\d{0,12}/,
          instapayment: /^63[7-9]\d{0,13}/,
          jcb15: /^(?:2131|1800)\d{0,11}/,
          jcb: /^(?:35\d{0,2})\d{0,12}/,
          maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
          mir: /^220[0-4]\d{0,12}/,
          visa: /^4\d{0,15}/,
          unionPay: /^(62|81)\d{0,14}/
        },
        getStrictBlocks: function(block) {
          var total = block.reduce(function(prev, current) {
            return prev + current;
          }, 0);
          return block.concat(19 - total);
        },
        getInfo: function(value, strictMode) {
          var blocks = CreditCardDetector.blocks,
            re = CreditCardDetector.re;
          strictMode = !!strictMode;
          for (var key in re)
            if (re[key].test(value)) {
              var matchedBlocks = blocks[key];
              return {
                type: key,
                blocks: strictMode
                  ? this.getStrictBlocks(matchedBlocks)
                  : matchedBlocks
              };
            }
          return {
            type: "unknown",
            blocks: strictMode
              ? this.getStrictBlocks(blocks.general)
              : blocks.general
          };
        }
      };
      module.exports = CreditCardDetector;
    },
    function(module, exports) {
      "use strict";
      var Util = {
        noop: function() {},
        strip: function(value, re) {
          return value.replace(re, "");
        },
        getPostDelimiter: function(value, delimiter, delimiters) {
          if (0 === delimiters.length)
            return value.slice(-delimiter.length) === delimiter
              ? delimiter
              : "";
          var matchedDelimiter = "";
          return (
            delimiters.forEach(function(current) {
              value.slice(-current.length) === current &&
                (matchedDelimiter = current);
            }),
            matchedDelimiter
          );
        },
        getDelimiterREByDelimiter: function(delimiter) {
          return new RegExp(
            delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"),
            "g"
          );
        },
        getNextCursorPosition: function(
          prevPos,
          oldValue,
          newValue,
          delimiter,
          delimiters
        ) {
          return oldValue.length === prevPos
            ? newValue.length
            : prevPos +
                this.getPositionOffset(
                  prevPos,
                  oldValue,
                  newValue,
                  delimiter,
                  delimiters
                );
        },
        getPositionOffset: function(
          prevPos,
          oldValue,
          newValue,
          delimiter,
          delimiters
        ) {
          var oldRawValue, newRawValue, lengthOffset;
          return (
            (oldRawValue = this.stripDelimiters(
              oldValue.slice(0, prevPos),
              delimiter,
              delimiters
            )),
            (newRawValue = this.stripDelimiters(
              newValue.slice(0, prevPos),
              delimiter,
              delimiters
            )),
            (lengthOffset = oldRawValue.length - newRawValue.length),
            0 !== lengthOffset ? lengthOffset / Math.abs(lengthOffset) : 0
          );
        },
        stripDelimiters: function(value, delimiter, delimiters) {
          var owner = this;
          if (0 === delimiters.length) {
            var delimiterRE = delimiter
              ? owner.getDelimiterREByDelimiter(delimiter)
              : "";
            return value.replace(delimiterRE, "");
          }
          return (
            delimiters.forEach(function(current) {
              current.split("").forEach(function(letter) {
                value = value.replace(
                  owner.getDelimiterREByDelimiter(letter),
                  ""
                );
              });
            }),
            value
          );
        },
        headStr: function(str, length) {
          return str.slice(0, length);
        },
        getMaxLength: function(blocks) {
          return blocks.reduce(function(previous, current) {
            return previous + current;
          }, 0);
        },
        getPrefixStrippedValue: function(
          value,
          prefix,
          prefixLength,
          prevResult,
          delimiter,
          delimiters,
          noImmediatePrefix,
          tailPrefix,
          signBeforePrefix
        ) {
          if (0 === prefixLength) return value;
          if (value === prefix && "" !== value) return "";
          if (signBeforePrefix && "-" == value.slice(0, 1)) {
            var prev =
              "-" == prevResult.slice(0, 1) ? prevResult.slice(1) : prevResult;
            return (
              "-" +
              this.getPrefixStrippedValue(
                value.slice(1),
                prefix,
                prefixLength,
                prev,
                delimiter,
                delimiters,
                noImmediatePrefix,
                tailPrefix,
                signBeforePrefix
              )
            );
          }
          if (prevResult.slice(0, prefixLength) !== prefix && !tailPrefix)
            return noImmediatePrefix && !prevResult && value ? value : "";
          if (prevResult.slice(-prefixLength) !== prefix && tailPrefix)
            return noImmediatePrefix && !prevResult && value ? value : "";
          var prevValue = this.stripDelimiters(
            prevResult,
            delimiter,
            delimiters
          );
          return value.slice(0, prefixLength) === prefix || tailPrefix
            ? value.slice(-prefixLength) !== prefix && tailPrefix
              ? prevValue.slice(0, -prefixLength - 1)
              : tailPrefix
              ? value.slice(0, -prefixLength)
              : value.slice(prefixLength)
            : prevValue.slice(prefixLength);
        },
        getFirstDiffIndex: function(prev, current) {
          for (var index = 0; prev.charAt(index) === current.charAt(index); )
            if ("" === prev.charAt(index++)) return -1;
          return index;
        },
        getFormattedValue: function(
          value,
          blocks,
          blocksLength,
          delimiter,
          delimiters,
          delimiterLazyShow
        ) {
          var result = "",
            multipleDelimiters = delimiters.length > 0,
            currentDelimiter = "";
          return 0 === blocksLength
            ? value
            : (blocks.forEach(function(length, index) {
                if (value.length > 0) {
                  var sub = value.slice(0, length),
                    rest = value.slice(length);
                  (currentDelimiter = multipleDelimiters
                    ? delimiters[delimiterLazyShow ? index - 1 : index] ||
                      currentDelimiter
                    : delimiter),
                    delimiterLazyShow
                      ? (index > 0 && (result += currentDelimiter),
                        (result += sub))
                      : ((result += sub),
                        sub.length === length &&
                          index < blocksLength - 1 &&
                          (result += currentDelimiter)),
                    (value = rest);
                }
              }),
              result);
        },
        fixPrefixCursor: function(el, prefix, delimiter, delimiters) {
          if (el) {
            var val = el.value,
              appendix = delimiter || delimiters[0] || " ";
            if (
              el.setSelectionRange &&
              prefix &&
              !(prefix.length + appendix.length <= val.length)
            ) {
              var len = 2 * val.length;
              setTimeout(function() {
                el.setSelectionRange(len, len);
              }, 1);
            }
          }
        },
        checkFullSelection: function(value) {
          try {
            var selection =
              window.getSelection() || document.getSelection() || {};
            return selection.toString().length === value.length;
          } catch (ex) {}
          return !1;
        },
        setSelection: function(element, position, doc) {
          if (
            element === this.getActiveElement(doc) &&
            !(element && element.value.length <= position)
          )
            if (element.createTextRange) {
              var range = element.createTextRange();
              range.move("character", position), range.select();
            } else
              try {
                element.setSelectionRange(position, position);
              } catch (e) {
                console.warn(
                  "The input element type does not support selection"
                );
              }
        },
        getActiveElement: function(parent) {
          var activeElement = parent.activeElement;
          return activeElement && activeElement.shadowRoot
            ? this.getActiveElement(activeElement.shadowRoot)
            : activeElement;
        },
        isAndroid: function() {
          return navigator && /android/i.test(navigator.userAgent);
        },
        isAndroidBackspaceKeydown: function(lastInputValue, currentInputValue) {
          return (
            !!(this.isAndroid() && lastInputValue && currentInputValue) &&
            currentInputValue === lastInputValue.slice(0, -1)
          );
        }
      };
      module.exports = Util;
    },
    function(module, exports) {
      (function(global) {
        "use strict";
        var DefaultProperties = {
          assign: function(target, opts) {
            return (
              (target = target || {}),
              (opts = opts || {}),
              (target.creditCard = !!opts.creditCard),
              (target.creditCardStrictMode = !!opts.creditCardStrictMode),
              (target.creditCardType = ""),
              (target.onCreditCardTypeChanged =
                opts.onCreditCardTypeChanged || function() {}),
              (target.phone = !!opts.phone),
              (target.phoneRegionCode = opts.phoneRegionCode || "AU"),
              (target.phoneFormatter = {}),
              (target.time = !!opts.time),
              (target.timePattern = opts.timePattern || ["h", "m", "s"]),
              (target.timeFormat = opts.timeFormat || "24"),
              (target.timeFormatter = {}),
              (target.date = !!opts.date),
              (target.datePattern = opts.datePattern || ["d", "m", "Y"]),
              (target.dateMin = opts.dateMin || ""),
              (target.dateMax = opts.dateMax || ""),
              (target.dateFormatter = {}),
              (target.numeral = !!opts.numeral),
              (target.numeralIntegerScale =
                opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0),
              (target.numeralDecimalScale =
                opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2),
              (target.numeralDecimalMark = opts.numeralDecimalMark || "."),
              (target.numeralThousandsGroupStyle =
                opts.numeralThousandsGroupStyle || "thousand"),
              (target.numeralPositiveOnly = !!opts.numeralPositiveOnly),
              (target.stripLeadingZeroes = opts.stripLeadingZeroes !== !1),
              (target.signBeforePrefix = !!opts.signBeforePrefix),
              (target.tailPrefix = !!opts.tailPrefix),
              (target.swapHiddenInput = !!opts.swapHiddenInput),
              (target.numericOnly =
                target.creditCard || target.date || !!opts.numericOnly),
              (target.uppercase = !!opts.uppercase),
              (target.lowercase = !!opts.lowercase),
              (target.prefix =
                target.creditCard || target.date ? "" : opts.prefix || ""),
              (target.noImmediatePrefix = !!opts.noImmediatePrefix),
              (target.prefixLength = target.prefix.length),
              (target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix),
              (target.copyDelimiter = !!opts.copyDelimiter),
              (target.initValue =
                void 0 !== opts.initValue && null !== opts.initValue
                  ? opts.initValue.toString()
                  : ""),
              (target.delimiter =
                opts.delimiter || "" === opts.delimiter
                  ? opts.delimiter
                  : opts.date
                  ? "/"
                  : opts.time
                  ? ":"
                  : opts.numeral
                  ? ","
                  : (opts.phone, " ")),
              (target.delimiterLength = target.delimiter.length),
              (target.delimiterLazyShow = !!opts.delimiterLazyShow),
              (target.delimiters = opts.delimiters || []),
              (target.blocks = opts.blocks || []),
              (target.blocksLength = target.blocks.length),
              (target.root =
                "object" == typeof global && global ? global : window),
              (target.document = opts.document || target.root.document),
              (target.maxLength = 0),
              (target.backspace = !1),
              (target.result = ""),
              (target.onValueChanged = opts.onValueChanged || function() {}),
              target
            );
          }
        };
        module.exports = DefaultProperties;
      }.call(
        exports,
        (function() {
          return this;
        })()
      ));
    }
  ]);
});
