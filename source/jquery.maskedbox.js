/**
 * EasyUI for jQuery 1.6.10
 *
 * Copyright (c) 2009-2018 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function ($) {
    function _1(target) {
        var state = $(target).data("maskedbox");
        var opts = state.options;
        $(target).textbox(opts);
        $(target).maskedbox("initValue", opts.value);
    };

    function _5(target, _7) {
        var opts = $(target).maskedbox("options");
        var tt = (_7 || $(target).maskedbox("getText") || "").split("");
        var vv = [];
        for (var i = 0; i < opts.mask.length; i++) {
            if (opts.masks[opts.mask[i]]) {
                var t = tt[i];
                vv.push(t != opts.promptChar ? t : " ");
            }
        }
        return vv.join("");
    };

    function _9(target, _b) {
        var opts = $(target).maskedbox("options");
        var cc = _b.split("");
        var tt = [];
        for (var i = 0; i < opts.mask.length; i++) {
            var m = opts.mask[i];
            var r = opts.masks[m];
            if (r) {
                var c = cc.shift();
                if (c != undefined) {
                    var d = new RegExp(r, "i");
                    if (d.test(c)) {
                        tt.push(c);
                        continue;
                    }
                }
                tt.push(opts.promptChar);
            } else {
                tt.push(m);
            }
        }
        return tt.join("");
    };

    function _d(target, c) {
        var opts = $(target).maskedbox("options");
        var range = $(target).maskedbox("getSelectionRange");
        var start = _12(target, range.start);
        var end = _12(target, range.end);
        if (start != -1) {
            var r = new RegExp(opts.masks[opts.mask[start]], "i");
            if (r.test(c)) {
                var vv = _5(target).split("");
                var _13 = start - _14(target, start);
                var _15 = end - _14(target, end);
                vv.splice(_13, _15 - _13, c);
                $(target).maskedbox("setValue", _9(target, vv.join("")));
                start = _12(target, ++start);
                $(target).maskedbox("setSelectionRange", {start: start, end: start});
            }
        }
    };

    function del(target, isBack) {
        var opts = $(target).maskedbox("options");
        var vv = _5(target).split("");
        var range = $(target).maskedbox("getSelectionRange");
        if (range.start == range.end) {
            if (isBack) {
                var _1b = _1c(target, range.start);
            } else {
                var _1b = _12(target, range.start);
            }
            var _1d = _1b - _14(target, _1b);
            if (_1d >= 0) {
                vv.splice(_1d, 1);
            }
        } else {
            var _1b = _12(target, range.start);
            var end = _1c(target, range.end);
            var _1d = _1b - _14(target, _1b);
            var _1e = end - _14(target, end);
            vv.splice(_1d, _1e - _1d + 1);
        }
        $(target).maskedbox("setValue", _9(target, vv.join("")));
        $(target).maskedbox("setSelectionRange", {start: _1b, end: _1b});
    };

    function _14(target, pos) {
        var opts = $(target).maskedbox("options");
        var index = 0;
        if (pos >= opts.mask.length) {
            pos--;
        }
        for (var i = pos; i >= 0; i--) {
            if (opts.masks[opts.mask[i]] == undefined) {
                index++;
            }
        }
        return index;
    };

    function _12(target, pos) {
        var opts = $(target).maskedbox("options");
        var m = opts.mask[pos];
        var r = opts.masks[m];
        while (pos < opts.mask.length && !r) {
            pos++;
            m = opts.mask[pos];
            r = opts.masks[m];
        }
        return pos;
    };

    function _1c(target, pos) {
        var opts = $(target).maskedbox("options");
        var m = opts.mask[--pos];
        var r = opts.masks[m];
        while (pos >= 0 && !r) {
            pos--;
            m = opts.mask[pos];
            r = opts.masks[m];
        }
        return pos < 0 ? 0 : pos;
    };

    function doKeyDown(e) {
        if (e.metaKey || e.ctrlKey) {
            return;
        }
        var target = e.data.target;
        var opts = $(target).maskedbox("options");
        var keyCodes = [9, 13, 35, 36, 37, 39];
        if ($.inArray(e.keyCode, keyCodes) != -1) {
            return true;
        }
        if (e.keyCode >= 96 && e.keyCode <= 105) {
            e.keyCode -= 48;
        }
        var c = String.fromCharCode(e.keyCode);
        if (e.keyCode >= 65 && e.keyCode <= 90 && !e.shiftKey) {
            c = c.toLowerCase();
        } else {
            if (e.keyCode == 189) {
                c = "-";
            } else {
                if (e.keyCode == 187) {
                    c = "+";
                } else {
                    if (e.keyCode == 190) {
                        c = ".";
                    }
                }
            }
        }
        if (e.keyCode == 8) {
            del(target, true);
        } else {
            if (e.keyCode == 46) {
                del(target, false);
            } else {
                _d(target, c);
            }
        }
        return false;
    };
    $.extend($.fn.textbox.methods, {
        inputMask: function (jq, _2a) {
            return jq.each(function () {
                var target = this;
                var opts = $.extend({}, $.fn.maskedbox.defaults, _2a);
                $.data(target, "maskedbox", {options: opts});
                var state = $(target).textbox("textbox");
                state.unbind(".maskedbox");
                for (var event in opts.inputEvents) {
                    state.bind(event + ".maskedbox", {target: target}, opts.inputEvents[event]);
                }
            });
        }
    });
    $.fn.maskedbox = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.maskedbox.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.textbox(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "maskedbox");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "maskedbox", {options: $.extend({}, $.fn.maskedbox.defaults, $.fn.maskedbox.parseOptions(this), options)});
            }
            _1(this);
        });
    };
    $.fn.maskedbox.methods = {
        options: function (jq) {
            var opts = jq.textbox("options");
            return $.extend($.data(jq[0], "maskedbox").options, {
                width: opts.width,
                value: opts.value,
                originalValue: opts.originalValue,
                disabled: opts.disabled,
                readonly: opts.readonly
            });
        }, initValue: function (jq, value) {
            return jq.each(function () {
                value = _9(this, _5(this, value));
                $(this).textbox("initValue", value);
            });
        }, setValue: function (jq, value) {
            return jq.each(function () {
                value = _9(this, _5(this, value));
                $(this).textbox("setValue", value);
            });
        }
    };
    $.fn.maskedbox.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.textbox.parseOptions(target), $.parser.parseOptions(target, ["mask", "promptChar"]), {});
    };
    $.fn.maskedbox.defaults = $.extend({}, $.fn.textbox.defaults, {
        mask: "",
        promptChar: "_",
        masks: {"9": "[0-9]", "a": "[a-zA-Z]", "*": "[0-9a-zA-Z]"},
        inputEvents: {keydown: doKeyDown}
    });
})(jQuery);

