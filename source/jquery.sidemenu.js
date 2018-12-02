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
    var SIDEMENU_INDEX = 1;

    function setStyle(target) {
        $(target).addClass("sidemenu");
    };

    function resize(target, size) {
        var opts = $(target).sidemenu("options");
        if (size) {
            $.extend(opts, {width: size.width, height: size.height});
        }
        $(target)._size(opts);
        $(target).find(".accordion").accordion("resize");
    };

    function buildPanel(target, panel, data) {
        var opts = $(target).sidemenu("options");
        var tt = $("<ul class=\"sidemenu-tree\"></ul>").appendTo(panel);
        tt.tree({
            data: data, 
            animate: opts.animate, 
            onBeforeSelect: function (item) {
                if (item.children) {
                    return false;
                }
            }, onSelect: function (item) {
                select(target, item.id, true);
            }, onExpand: function (item) {
                setExpandable(target, item);
            }, onCollapse: function (item) {
                setExpandable(target, item);
            }, onClick: function (item) {
                if (item.children) {
                    if (item.state == "open") {
                        $(item.target).addClass("tree-node-nonleaf-collapsed");
                    } else {
                        $(item.target).removeClass("tree-node-nonleaf-collapsed");
                    }
                    $(this).tree("toggle", item.target);
                }
            }
        });
        tt.unbind(".sidemenu").bind("mouseleave.sidemenu", function () {
            $(panel).trigger("mouseleave");
        });
        select(target, opts.selectedItemId);
    };

    function buildHeader(target, header, data) {
        var opts = $(target).sidemenu("options");
        $(header).tooltip({
            content: $("<div></div>"),
            position: opts.floatMenuPosition,
            valign: "top",
            data: data,
            onUpdate: function (acc) {
                var opts = $(this).tooltip("options");
                var data = opts.data;
                acc.accordion({width: opts.floatMenuWidth, multiple: false}).accordion("add", {
                    title: data.text,
                    collapsed: false,
                    collapsible: false
                });
                buildPanel(target, acc.accordion("panels")[0], data.children);
            },
            onShow: function () {
                var t = $(this);
                var tip = t.tooltip("tip").addClass("sidemenu-tooltip");
                tip.children(".tooltip-content").addClass("sidemenu");
                tip.find(".accordion").accordion("resize");
                tip.add(tip.find("ul.tree")).unbind(".sidemenu").bind("mouseover.sidemenu", function () {
                    t.tooltip("show");
                }).bind("mouseleave.sidemenu", function () {
                    t.tooltip("hide");
                });
                t.tooltip("reposition");
            },
            onPosition: function (param, top) {
                var tip = $(this).tooltip("tip");
                if (!opts.collapsed) {
                    tip.css({left: -999999});
                } else {
                    if (top + tip.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
                        top = $(window)._outerHeight() + $(document).scrollTop() - tip.outerHeight();
                        tip.css("top", top);
                    }
                }
            }
        });
    };

    function setExpand(target, callback) {
        $(target).find(".sidemenu-tree").each(function () {
            callback($(this));
        });
        $(target).find(".tooltip-f").each(function () {
            var tip = $(this).tooltip("tip");
            if (tip) {
                tip.find(".sidemenu-tree").each(function () {
                    callback($(this));
                });
                $(this).tooltip("reposition");
            }
        });
    };

    function select(target, id, bParam) {
        var curItem = null;
        var opts = $(target).sidemenu("options");
        setExpand(target, function (t) {
            t.find("div.tree-node-selected").removeClass("tree-node-selected");
            var item = t.tree("find", id);
            if (item) {
                $(item.target).addClass("tree-node-selected");
                opts.selectedItemId = item.id;
                t.trigger("mouseleave.sidemenu");
                curItem = item;
            }
        });
        if (bParam && curItem) {
            opts.onSelect.call(target, curItem);
        }
    };

    function setExpandable(target, item) {
        setExpand(target, function (t) {
            var treeitem = t.tree("find", item.id);
            if (treeitem) {
                var topts = t.tree("options");
                var animated = topts.animate;
                topts.animate = false;
                t.tree(item.state == "open" ? "expand" : "collapse", treeitem.target);
                topts.animate = animated;
            }
        });
    };

    function buildSideMenu(target) {
        var opts = $(target).sidemenu("options");
        $(target).empty();
        if (opts.data) {
            $.easyui.forEach(opts.data, true, function (item) {
                if (!item.id) {
                    item.id = "_easyui_sidemenu_" + (SIDEMENU_INDEX++);
                }
                if (!item.iconCls) {
                    item.iconCls = "sidemenu-default-icon";
                }
                if (item.children) {
                    item.nodeCls = "tree-node-nonleaf";
                    if (!item.state) {
                        item.state = "closed";
                    }
                    if (item.state == "open") {
                        item.nodeCls = "tree-node-nonleaf";
                    } else {
                        item.nodeCls = "tree-node-nonleaf tree-node-nonleaf-collapsed";
                    }
                }
            });
            var acc = $("<div></div>").appendTo(target);
            acc.accordion({fit: opts.height == "auto" ? false : true, border: opts.border, multiple: opts.multiple});
            var data = opts.data;
            for (var i = 0; i < data.length; i++) {
                acc.accordion("add", {
                    title: data[i].text,
                    selected: data[i].state == "open",
                    iconCls: data[i].iconCls,
                    onBeforeExpand: function () {
                        return !opts.collapsed;
                    }
                });
                var ap = acc.accordion("panels")[i];
                buildPanel(target, ap, data[i].children);
                buildHeader(target, ap.panel("header"), data[i]);
            }
        }
    };

    function setCollapsed(target, collapsed) {
        var opts = $(target).sidemenu("options");
        opts.collapsed = collapsed;
        var acc = $(target).find(".accordion");
        var panels = acc.accordion("panels");
        acc.accordion("options").animate = false;
        if (opts.collapsed) {
            $(target).addClass("sidemenu-collapsed");
            for (var i = 0; i < panels.length; i++) {
                var panel = panels[i];
                if (panel.panel("options").collapsed) {
                    opts.data[i].state = "closed";
                } else {
                    opts.data[i].state = "open";
                    acc.accordion("unselect", i);
                }
                var header = panel.panel("header");
                header.find(".panel-title").html("");
                header.find(".panel-tool").hide();
            }
        } else {
            $(target).removeClass("sidemenu-collapsed");
            for (var i = 0; i < panels.length; i++) {
                var panel = panels[i];
                if (opts.data[i].state == "open") {
                    acc.accordion("select", i);
                }
                var header = panel.panel("header");
                header.find(".panel-title").html(panel.panel("options").title);
                header.find(".panel-tool").show();
            }
        }
        acc.accordion("options").animate = opts.animate;
    };

    function destroy(target) {
        $(target).find(".tooltip-f").each(function () {
            $(this).tooltip("destroy");
        });
        $(target).remove();
    };
    $.fn.sidemenu = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.sidemenu.methods[options];
            return method(this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "sidemenu");
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, "sidemenu", {options: $.extend({}, $.fn.sidemenu.defaults, $.fn.sidemenu.parseOptions(this), options)});
                setStyle(this);
            }
            resize(this);
            buildSideMenu(this);
            setCollapsed(this, state.options.collapsed);
        });
    };
    $.fn.sidemenu.methods = {
        options: function (jq) {
            return jq.data("sidemenu").options;
        }, resize: function (jq, size) {
            return jq.each(function () {
                resize(this, size);
            });
        }, collapse: function (jq) {
            return jq.each(function () {
                setCollapsed(this, true);
            });
        }, expand: function (jq) {
            return jq.each(function () {
                setCollapsed(this, false);
            });
        }, destroy: function (jq) {
            return jq.each(function () {
                destroy(this);
            });
        }
    };
    $.fn.sidemenu.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, ["width", "height"]));
    };
    $.fn.sidemenu.defaults = {
        width: 200,
        height: "auto",
        border: true,
        animate: true,
        multiple: true,
        collapsed: false,
        data: null,
        floatMenuWidth: 200,
        floatMenuPosition: "right",
        onSelect: function (value) {
        }
    };
})(jQuery);

