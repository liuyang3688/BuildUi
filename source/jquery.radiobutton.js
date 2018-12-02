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
    var RADIOBUTTON_INDEX = 1;

    function createRadioButton(target) {
        var container = $("<span class=\"radiobutton inputbox\">" + "<span class=\"radiobutton-inner\" style=\"display:none\"></span>" + "<input type=\"radio\" class=\"radiobutton-value\">" + "</span>").insertAfter(target);
        var t = $(target);
        t.addClass("radiobutton-f").hide();
        var name = t.attr("name");
        if (name) {
            t.removeAttr("name").attr("radiobuttonName", name);
            container.find(".radiobutton-value").attr("name", name);
        }
        return container;
    };

    function init(target) {
        var state = $.data(target, "radiobutton");
        var opts = state.options;
        var radiobutton = state.radiobutton;
        var id = "_easyui_radiobutton_" + (++RADIOBUTTON_INDEX);
        radiobutton.find(".radiobutton-value").attr("id", id);
        if (opts.label) {
            if (typeof opts.label == "object") {
                state.label = $(opts.label);
                state.label.attr("for", id);
            } else {
                $(state.label).remove();
                state.label = $("<label class=\"textbox-label\"></label>").html(opts.label);
                state.label.css("textAlign", opts.labelAlign).attr("for", id);
                if (opts.labelPosition == "after") {
                    state.label.insertAfter(radiobutton);
                } else {
                    state.label.insertBefore(target);
                }
                state.label.removeClass("textbox-label-left textbox-label-right textbox-label-top");
                state.label.addClass("textbox-label-" + opts.labelPosition);
            }
        } else {
            $(state.label).remove();
        }
        $(target).radiobutton("setValue", opts.value);
        setChecked(target, opts.checked);
        setDisabled(target, opts.disabled);
    };

    function bindEvent(target) {
        var state = $.data(target, "radiobutton");
        var opts = state.options;
        var radiobutton = state.radiobutton;
        radiobutton.unbind(".radiobutton").bind("click.radiobutton", function () {
            if (!opts.disabled) {
                setChecked(target, true);
            }
        });
    };

    function setSize(target) {
        var state = $.data(target, "radiobutton");
        var opts = state.options;
        var radiobutton = state.radiobutton;
        radiobutton._size(opts, radiobutton.parent());
        if (opts.label && opts.labelPosition) {
            if (opts.labelPosition == "top") {
                state.label._size({width: opts.labelWidth}, radiobutton);
            } else {
                state.label._size({width: opts.labelWidth, height: radiobutton.outerHeight()}, radiobutton);
                state.label.css("lineHeight", radiobutton.outerHeight() + "px");
            }
        }
    };

    function setChecked(target, checked) {
        if (checked) {
            var f = $(target).closest("form");
            var name = $(target).attr("radiobuttonName");
            f.find(".radiobutton-f[radiobuttonName=\"" + name + "\"]").each(function () {
                if (this != target) {
                    setCheck(this, false);
                }
            });
            setCheck(target, true);
        } else {
            setCheck(target, false);
        }

        function setCheck(b, c) {
            var opts = $(b).radiobutton("options");
            var radiobutton = $(b).data("radiobutton").radiobutton;
            radiobutton.find(".radiobutton-inner").css("display", c ? "" : "none");
            radiobutton.find(".radiobutton-value")._propAttr("checked", c);
            if (opts.checked != c) {
                opts.checked = c;
                opts.onChange.call($(b)[0], c);
            }
        };
    };

    function setDisabled(target, disabled) {
        var state = $.data(target, "radiobutton");
        var opts = state.options;
        var radiobutton = state.radiobutton;
        var rv = radiobutton.find(".radiobutton-value");
        opts.disabled = disabled;
        if (disabled) {
            $(target).add(rv)._propAttr("disabled", true);
            radiobutton.addClass("radiobutton-disabled");
        } else {
            $(target).add(rv)._propAttr("disabled", false);
            radiobutton.removeClass("radiobutton-disabled");
        }
    };
    $.fn.radiobutton = function (options, param) {
        if (typeof options == "string") {
            return $.fn.radiobutton.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "radiobutton");
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, "radiobutton", {
                    options: $.extend({}, $.fn.radiobutton.defaults, $.fn.radiobutton.parseOptions(this), options),
                    radiobutton: createRadioButton(this)
                });
            }
            state.options.originalChecked = state.options.checked;
            init(this);
            bindEvent(this);
            setSize(this);
        });
    };
    $.fn.radiobutton.methods = {
        options: function (jq) {
            var state = jq.data("radiobutton");
            return $.extend(state.options, {value: state.radiobutton.find(".radiobutton-value").val()});
        }, setValue: function (jq, value) {
            return jq.each(function () {
                $(this).val(value);
                $.data(this, "radiobutton").radiobutton.find(".radiobutton-value").val(value);
            });
        }, enable: function (jq) {
            return jq.each(function () {
                setDisabled(this, false);
            });
        }, disable: function (jq) {
            return jq.each(function () {
                setDisabled(this, true);
            });
        }, check: function (jq) {
            return jq.each(function () {
                setChecked(this, true);
            });
        }, uncheck: function (jq) {
            return jq.each(function () {
                setChecked(this, false);
            });
        }, clear: function (jq) {
            return jq.each(function () {
                setChecked(this, false);
            });
        }, reset: function (jq) {
            return jq.each(function () {
                var opts = $(this).radiobutton("options");
                setChecked(this, opts.originalChecked);
            });
        }
    };
    $.fn.radiobutton.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, ["label", "labelPosition", "labelAlign", {labelWidth: "number"}]), {
            value: (t.val() || undefined),
            checked: (t.attr("checked") ? true : undefined),
            disabled: (t.attr("disabled") ? true : undefined)
        });
    };
    $.fn.radiobutton.defaults = {
        width: 20,
        height: 20,
        value: null,
        disabled: false,
        checked: false,
        label: null,
        labelWidth: "auto",
        labelPosition: "before",
        labelAlign: "left",
        onChange: function (value) {
        }
    };
})(jQuery);

