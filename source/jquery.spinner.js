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
        var spinner = $.data(target, "spinner");
        var opts = spinner.options;
        var iconArray = $.extend(true, [], opts.icons);
        if (opts.spinAlign == "left" || opts.spinAlign == "right") {
            opts.spinArrow = true;
            opts.iconAlign = opts.spinAlign;
            var config = {
                iconCls: "spinner-button-updown", 
                handler: function (e) {
                    var closest = $(e.target).closest(".spinner-arrow-up,.spinner-arrow-down");
                    doSpin(e.data.target, closest.hasClass("spinner-arrow-down"));
                }
            };
            if (opts.spinAlign == "left") {
                iconArray.unshift(config);
            } else {
                iconArray.push(config);
            }
        } else {
            opts.spinArrow = false;
            if (opts.spinAlign == "vertical") {
                if (opts.buttonAlign != "top") {
                    opts.buttonAlign = "bottom";
                }
                opts.clsLeft = "textbox-button-bottom";
                opts.clsRight = "textbox-button-top";
            } else {
                opts.clsLeft = "textbox-button-left";
                opts.clsRight = "textbox-button-right";
            }
        }
        $(target).addClass("spinner-f").textbox($.extend({}, opts, {
            icons: iconArray, 
            doSize: false, 
            onResize: function (param1, param2) {
                if (!opts.spinArrow) {
                    var next = $(this).next();
                    var tb = next.find(".textbox-button:not(.spinner-button)");
                    if (tb.length) {
                        var oWidth = tb.outerWidth();
                        var oHeight = tb.outerHeight();
                        var leftBtn = next.find(".spinner-button." + opts.clsLeft);
                        var rightBtn = next.find(".spinner-button." + opts.clsRight);
                        if (opts.buttonAlign == "right") {
                            rightBtn.css("marginRight", oWidth + "px");
                        } else {
                            if (opts.buttonAlign == "left") {
                                leftBtn.css("marginLeft", oWidth + "px");
                            } else {
                                if (opts.buttonAlign == "top") {
                                    rightBtn.css("marginTop", oHeight + "px");
                                } else {
                                    leftBtn.css("marginBottom", oHeight + "px");
                                }
                            }
                        }
                    }
                }
                opts.onResize.call(this, param1, param2);
            }
        }));
        $(target).attr("spinnerName", $(target).attr("textboxName"));
        spinner.spinner = $(target).next();
        spinner.spinner.addClass("spinner");
        if (opts.spinArrow) {
            var btn = spinner.spinner.find(".spinner-button-updown");
            btn.append("<span class=\"spinner-arrow spinner-button-top\">" + "<span class=\"spinner-arrow-up\"></span>" + "</span>" + "<span class=\"spinner-arrow spinner-button-bottom\">" + "<span class=\"spinner-arrow-down\"></span>" + "</span>");
        } else {
            var leftBtn = $("<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>").addClass(opts.clsLeft).appendTo(spinner.spinner);
            var rightBtn = $("<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>").addClass(opts.clsRight).appendTo(spinner.spinner);
            leftBtn.linkbutton({
                iconCls: opts.reversed ? "spinner-button-up" : "spinner-button-down", onClick: function () {
                    doSpin(target, !opts.reversed);
                }
            });
            rightBtn.linkbutton({
                iconCls: opts.reversed ? "spinner-button-down" : "spinner-button-up", onClick: function () {
                    doSpin(target, opts.reversed);
                }
            });
            if (opts.disabled) {
                $(target).spinner("disable");
            }
            if (opts.readonly) {
                $(target).spinner("readonly");
            }
        }
        $(target).spinner("resize");
    };

    function doSpin(target, down) {
        var spinner = $(target).spinner("options");
        spinner.spin.call(target, down);
        spinner[down ? "onSpinDown" : "onSpinUp"].call(target);
        $(target).spinner("validate");
    };
    $.fn.spinner = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.spinner.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.textbox(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var spinner = $.data(this, "spinner");
            if (spinner) {
                $.extend(spinner.options, options);
            } else {
                spinner = $.data(this, "spinner", {options: $.extend({}, $.fn.spinner.defaults, $.fn.spinner.parseOptions(this), options)});
            }
            init(this);
        });
    };
    $.fn.spinner.methods = {
        options: function (jq) {
            var tb = jq.textbox("options");
            return $.extend($.data(jq[0], "spinner").options, {
                width: tb.width,
                value: tb.value,
                originalValue: tb.originalValue,
                disabled: tb.disabled,
                readonly: tb.readonly
            });
        }
    };
    $.fn.spinner.parseOptions = function (target) {
        return $.extend({}, $.fn.textbox.parseOptions(target), $.parser.parseOptions(target, ["min", "max", "spinAlign", {
            increment: "number",
            reversed: "boolean"
        }]));
    };
    $.fn.spinner.defaults = $.extend({}, $.fn.textbox.defaults, {
        min: null, max: null, increment: 1, spinAlign: "right", reversed: false, spin: function (param) {
        }, onSpinUp: function () {
        }, onSpinDown: function () {
        }
    });
})(jQuery);

