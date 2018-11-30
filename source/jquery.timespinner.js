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
    function init(target) {
        var opts = $.data(target, "timespinner").options;
        $(target).addClass("timespinner-f").spinner(opts);
        var formatValue = opts.formatter.call(target, opts.parser.call(target, opts.value));
        $(target).timespinner("initValue", formatValue);
    };

    function click(e) {
        var target = e.data.target;
        var opts = $.data(target, "timespinner").options;
        var selectStart = $(target).timespinner("getSelectionStart");
        for (var i = 0; i < opts.selections.length; i++) {
            var selection = opts.selections[i];
            if (selectStart >= selection[0] && selectStart <= selection[1]) {
                highlight(target, i);
                return;
            }
        }
    };

    function highlight(target, index) {
        var opts = $.data(target, "timespinner").options;
        if (index != undefined) {
            opts.highlight = index;
        }
        var selection = opts.selections[opts.highlight];
        if (selection) {
            var tb = $(target).timespinner("textbox");
            $(target).timespinner("setSelectionRange", {start: selection[0], end: selection[1]});
            tb.focus();
        }
    };

    function setValue(target, value) {
        var opts = $.data(target, "timespinner").options;
        var value = opts.parser.call(target, value);
        var formatValue = opts.formatter.call(target, value);
        $(target).spinner("setValue", formatValue);
    };

    function doSpin(target, down) {
        var opts = $.data(target, "timespinner").options;
        var s = $(target).timespinner("getValue");
        var selections = opts.selections[opts.highlight];
        var s1 = s.substring(0, selections[0]);
        var s2 = s.substring(selections[0], selections[1]);
        var s3 = s.substring(selections[1]);
        var v = s1 + ((parseInt(s2, 10) || 0) + opts.increment * (down ? -1 : 1)) + s3;
        $(target).timespinner("setValue", v);
        highlight(target);
    };
    $.fn.timespinner = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.timespinner.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.spinner(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var timeSpinner = $.data(this, "timespinner");
            if (timeSpinner) {
                $.extend(timeSpinner.options, options);
            } else {
                $.data(this, "timespinner", {options: $.extend({}, $.fn.timespinner.defaults, $.fn.timespinner.parseOptions(this), options)});
            }
            init(this);
        });
    };
    $.fn.timespinner.methods = {
        options: function (jq) {
            var spinner = jq.data("spinner") ? jq.spinner("options") : {};
            return $.extend($.data(jq[0], "timespinner").options, {
                width: spinner.width,
                value: spinner.value,
                originalValue: spinner.originalValue,
                disabled: spinner.disabled,
                readonly: spinner.readonly
            });
        }, setValue: function (jq, value) {
            return jq.each(function () {
                setValue(this, value);
            });
        }, getHours: function (jq) {
            var opts = $.data(jq[0], "timespinner").options;
            var value = opts.parser.call(jq[0], jq.timespinner("getValue"));
            return value ? value.getHours() : null;
        }, getMinutes: function (jq) {
            var opts = $.data(jq[0], "timespinner").options;
            var value = opts.parser.call(jq[0], jq.timespinner("getValue"));
            return value ? value.getMinutes() : null;
        }, getSeconds: function (jq) {
            var opts = $.data(jq[0], "timespinner").options;
            var value = opts.parser.call(jq[0], jq.timespinner("getValue"));
            return value ? value.getSeconds() : null;
        }
    };
    $.fn.timespinner.parseOptions = function (target) {
        return $.extend({}, $.fn.spinner.parseOptions(target), $.parser.parseOptions(target, ["separator", {
            showSeconds: "boolean",
            highlight: "number"
        }]));
    };
    $.fn.timespinner.defaults = $.extend({}, $.fn.spinner.defaults, {
        inputEvents: $.extend({}, $.fn.spinner.defaults.inputEvents, {
            click: function (e) {
                click.call(this, e);
            }, blur: function (e) {
                var t = $(e.data.target);
                t.timespinner("setValue", t.timespinner("getText"));
            }, keydown: function (e) {
                if (e.keyCode == 13) {
                    var t = $(e.data.target);
                    t.timespinner("setValue", t.timespinner("getText"));
                }
            }
        }),
        formatter: function (value) {
            if (!value) {
                return "";
            }
            var timeSpinner = $(this).timespinner("options");
            var tt = [padZero(value.getHours()), padZero(value.getMinutes())];
            if (timeSpinner.showSeconds) {
                tt.push(padZero(value.getSeconds()));
            }
            return tt.join(timeSpinner.separator);

            function padZero(num) {
                return (num < 10 ? "0" : "") + num;
            };
        },
        parser: function (s) {
            var timeSpinner = $(this).timespinner("options");
            var date = stringToDate(s);
            if (date) {
                var min = stringToDate(timeSpinner.min);
                var max = stringToDate(timeSpinner.max);
                if (min && min > date) {
                    date = min;
                }
                if (max && max < date) {
                    date = max;
                }
            }
            return date;
            
            function stringToDate(s) {
                if (!s) {
                    return null;
                }
                var tt = s.split(timeSpinner.separator);
                return new Date(1900, 0, 0, parseInt(tt[0], 10) || 0, parseInt(tt[1], 10) || 0, parseInt(tt[2], 10) || 0);
            };
        },
        selections: [[0, 2], [3, 5], [6, 8]],
        separator: ":",
        showSeconds: false,
        highlight: 0,
        spin: function (down) {
            doSpin(this, down);
        }
    });
})(jQuery);

