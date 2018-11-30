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
    function create(jq) {
        $(jq).addClass("numberspinner-f");
        var options = $.data(jq, "numberspinner").options;
        $(jq).numberbox($.extend({}, options, {doSize: false})).spinner(options);
        $(jq).numberbox("setValue", options.value);
    };

    function doSpin(target, down) {
        var opts = $.data(target, "numberspinner").options;
        var v = parseFloat($(target).numberbox("getValue") || opts.value) || 0;
        if (down) {
            v -= opts.increment;
        } else {
            v += opts.increment;
        }
        $(target).numberbox("setValue", v);
    };
    $.fn.numberspinner = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.numberspinner.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.numberbox(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var ns = $.data(this, "numberspinner");
            if (ns) {
                $.extend(ns.options, options);
            } else {
                $.data(this, "numberspinner", {options: $.extend({}, $.fn.numberspinner.defaults, $.fn.numberspinner.parseOptions(this), options)});
            }
            create(this);
        });
    };
    $.fn.numberspinner.methods = {
        options: function (jq) {
            var nb = jq.numberbox("options");
            return $.extend($.data(jq[0], "numberspinner").options, {
                width: nb.width,
                value: nb.value,
                originalValue: nb.originalValue,
                disabled: nb.disabled,
                readonly: nb.readonly
            });
        }
    };
    $.fn.numberspinner.parseOptions = function (target) {
        return $.extend({}, $.fn.spinner.parseOptions(target), $.fn.numberbox.parseOptions(target), {});
    };
    $.fn.numberspinner.defaults = $.extend({}, $.fn.spinner.defaults, $.fn.numberbox.defaults, {
        spin: function (down) {
            doSpin(this, down);
        }
    });
})(jQuery);

