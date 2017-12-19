
(function() {
    'use strict';

    function main () {

        window.showModalDialog = function(url, args) { return; };

    }

    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ main +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);

    var timetable = $("#TimeRows").find('table')[0];

    $("#timetabledetailesrow").remove();

    var timetabledetailesrow = document.createElement("tr");
    var timetabledetailesspacecell = document.createElement("td");
    var timetabledetailestextcell = document.createElement("td");
    $(timetabledetailesspacecell).attr("colspan", "4");
    $(timetabledetailestextcell).attr("colspan", "80");
    $(timetabledetailesrow).attr("id", "timetabledetailesrow");
    $(timetabledetailestextcell).attr("id", "timetabledetailestextcell");
    $(timetabledetailesrow).append($(timetabledetailesspacecell));
    $(timetabledetailesrow).append($(timetabledetailestextcell));
    $(timetable).append($(timetabledetailesrow));

    var focus = ko.observable("");

    function setFocus(focusName) {
        // debugger;
        var textareaname = "";
        var textarea2name = "";
        if (focus() !== "") {
            var chg = document.getElementById(focus().substr(4) + "_chg");
            ValueChanged(chg);

            textareaname = "#textarea_" + focus();
            textarea2name = "#textarea2_" + focus();

            $(textareaname).css("display", "none");
            $(textarea2name).css("display", "none");
        }

        focus(focusName);
        textareaname = "#textarea_" + focus();
        textarea2name = "#textarea2_" + focus();

        $(textareaname).css("display", "block");
        $(textarea2name).css("display", "block");
    }

    $.each($("input[ondblclick^='LocalShowEditor']"), function(arg, wat) {
        var edit = "#" + $(wat).attr("name").substr(4) + "_edit";
        var edittext = "#" + $(wat).attr("name").substr(4) + "_editext";
        var koedit = "ko_edit_" + $(wat).attr("name").substr(4);
        var koedittext = "ko_edittext_" + $(wat).attr("name").substr(4);
        window[koedit] = ko.observable($(edit).attr("value"));
        window[koedittext] = ko.observable($(edittext).attr("value"));
        var focusname = "focus_" + $(wat).attr("name");
        window[focusname] = ko.observable(false);
        var watfocus = $(wat).attr("name");
        $(wat).click(function() { setFocus(watfocus); });

        var textareaname = "textarea_" + $(wat).attr("name");
        var area = document.createElement("textarea");
        $(area).attr("id", textareaname);
        $(area).attr("style", "width: 360px; height: 180px; float: left; display: none");
        $(edit).attr("data-bind", "value: " + koedit);
        $(area).attr("data-bind", "value: " + koedit);
        $(timetabledetailestextcell).append($(area));

        var textarea2name = "textarea2_" + $(wat).attr("name");
        var area2 = document.createElement("textarea");
        $(area2).attr("id", textarea2name);
        $(area2).attr("style", "width: 360px; height: 180px; float: left; display: none");
        $(edittext).attr("data-bind", "value: " + koedittext);
        $(area2).attr("data-bind", "value: " + koedittext);
        $(timetabledetailestextcell).append($(area2));
    });

    ko.applyBindings();

})();
