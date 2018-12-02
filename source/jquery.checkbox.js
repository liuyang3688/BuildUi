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
    var CHECKBOX_INDEX = 1;

    function buildCheckbox(target) {
        var checkbox = $("<span class=\"checkbox inputbox\">" + "<span class=\"checkbox-inner\">" + "<svg xml:space=\"preserve\" focusable=\"false\" version=\"1.1\" viewBox=\"0 0 24 24\"><path d=\"M4.1,12.7 9,17.6 20.3,6.3\" fill=\"none\" stroke=\"white\"></path></svg>" + "</span>" + "<input type=\"checkbox\" class=\"checkbox-value\">" + "</span>").insertAfter(target);
        var t = $(target);
        t.addClass("checkbox-f").hide();
        var name = t.attr("name");
        if (name) {
            t.removeAttr("name").attr("checkboxName", name);
            checkbox.find(".checkbox-value").attr("name", name);
        }
        return checkbox;
    };

    function init(target) {
        var state = $.data(target, "checkbox");
        var opts = state.options;
        var checkbox = state.checkbox;
        var id = "_easyui_checkbox_" + (++CHECKBOX_INDEX);
        checkbox.find(".checkbox-value").attr("id", id);
        if (opts.label) {
            if (typeof opts.label == "object") {
                state.label = $(opts.label);
                state.label.attr("for", id);
            } else {
                $(state.label).remove();
                state.label = $("<label class=\"textbox-label\"></label>").html(opts.label);
                state.label.css("textAlign", opts.labelAlign).attr("for", id);
                if (opts.labelPosition == "after") {
                    state.label.insertAfter(checkbox);
                } else {
                    state.label.insertBefore(target);
                }
                state.label.removeClass("textbox-label-left textbox-label-right textbox-label-top");
                state.label.addClass("textbox-label-" + opts.labelPosition);
            }
        } else {
            $(state.label).remove();
        }
        $(target).checkbox("setValue", opts.value);
        setCheck(target, opts.checked);
        setDisable(target, opts.disabled);
    };

    function bindClick(target) {
        var state = $.data(target, "checkbox");
        var opts = state.options;
        var checkbox = state.checkbox;
        checkbox.unbind(".checkbox").bind("click.checkbox", function () {
            if (!opts.disabled) {
                setCheck(target, !opts.checked);
            }
        });
    };

    function setSize(target) {
        var state = $.data(target, "checkbox");
        var opts = state.options;
        var checkbox = state.checkbox;
        checkbox._size(opts, checkbox.parent());
        if (opts.label && opts.labelPosition) {
            if (opts.labelPosition == "top") {
                state.label._size({width: opts.labelWidth}, checkbox);
            } else {
                state.label._size({width: opts.labelWidth, height: checkbox.outerHeight()}, checkbox);
                state.label.css("lineHeight", checkbox.outerHeight() + "px");
            }
        }
    };

    function setCheck(target, checked) {
        var state = $.data(target, "checkbox");
        var opts = state.options;
        var checkbox = state.checkbox;
        checkbox.find(".checkbox-value")._propAttr("checked", checked);
        var ctrl = checkbox.find(".checkbox-inner").css("display", checked ? "" : "none");
        if (checked) {
            ctrl.addClass("checkbox-checked");
        } else {
            ctrl.removeClass("checkbox-checked");
        }
        if (opts.checked != checked) {
            opts.checked = checked;
            opts.onChange.call(target, checked);
        }
    };

    function setDisable(target, disabled) {
        var state = $.data(target, "checkbox");
        var opts = state.options;
        var checkbox = state.checkbox;
        var rv = checkbox.find(".checkbox-value");
        opts.disabled = disabled;
        if (disabled) {
            $(target).add(rv)._propAttr("disabled", true);
            checkbox.addClass("checkbox-disabled");
        } else {
            $(target).add(rv)._propAttr("disabled", false);
            checkbox.removeClass("checkbox-disabled");
        }
    };
    $.fn.checkbox = function (options, param) {
        if (typeof options == "string") {
            return $.fn.checkbox.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "checkbox");
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, "checkbox", {
                    options: $.extend({}, $.fn.checkbox.defaults, $.fn.checkbox.parseOptions(this), options),
                    checkbox: buildCheckbox(this)
                });
            }
            state.options.originalChecked = state.options.checked;
            init(this);
            bindClick(this);
            setSize(this);
        });
    };
    $.fn.checkbox.methods = {
        options: function (jq) {
            var state = jq.data("checkbox");
            return $.extend(state.options, {value: state.checkbox.find(".checkbox-value").val()});
        }, setValue: function (jq, value) {
            return jq.each(function () {
                $(this).val(value);
                $.data(this, "checkbox").checkbox.find(".checkbox-value").val(value);
            });
        }, enable: function (jq) {
            return jq.each(function () {
                setDisable(this, false);
            });
        }, disable: function (jq) {
            return jq.each(function () {
                setDisable(this, true);
            });
        }, check: function (jq) {
            return jq.each(function () {
                setCheck(this, true);
            });
        }, uncheck: function (jq) {
            return jq.each(function () {
                setCheck(this, false);
            });
        }, clear: function (jq) {
            return jq.each(function () {
                setCheck(this, false);
            });
        }, reset: function (jq) {
            return jq.each(function () {
                var opts = $(this).checkbox("options");
                setCheck(this, opts.originalChecked);
            });
        }
    };
    $.fn.checkbox.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, ["label", "labelPosition", "labelAlign", {labelWidth: "number"}]), {
            value: (t.val() || undefined),
            checked: (t.attr("checked") ? true : undefined),
            disabled: (t.attr("disabled") ? true : undefined)
        });
    };
    $.fn.checkbox.defaults = {
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

