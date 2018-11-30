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
        var options = $.data(target, "splitbutton").options;
        $(target).menubutton(options);
        $(target).addClass("s-btn");
    };
    $.fn.splitbutton = function (options, param) {
        if (typeof options == "string") {
            var func = $.fn.splitbutton.methods[options];
            if (func) {
                return func(this, param);
            } else {
                return this.menubutton(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var data = $.data(this, "splitbutton");
            if (data) {
                $.extend(data.options, options);
            } else {
                $.data(this, "splitbutton", {options: $.extend({}, $.fn.splitbutton.defaults, $.fn.splitbutton.parseOptions(this), options)});
                $(this)._propAttr("disabled", false);
            }
            init(this);
        });
    };
    $.fn.splitbutton.methods = {
        options: function (jq) {
            var mb = jq.menubutton("options");
            var opts = $.data(jq[0], "splitbutton").options;
            $.extend(opts, {disabled: mb.disabled, toggle: mb.toggle, selected: mb.selected});
            return opts;
        }
    };
    $.fn.splitbutton.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.linkbutton.parseOptions(target), $.parser.parseOptions(target, ["menu", {
            plain: "boolean",
            duration: "number"
        }]));
    };
    $.fn.splitbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
        plain: true,
        menu: null,
        duration: 100,
        cls: {
            btn1: "m-btn-active s-btn-active",
            btn2: "m-btn-plain-active s-btn-plain-active",
            arrow: "m-btn-downarrow",
            trigger: "m-btn-line"
        }
    });
})(jQuery);

