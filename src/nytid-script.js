
var current = moment(Date.now());
var weekTime = 1000*60*60*24*7;

// Only run on WeekGrid page
if (document.location.pathname.indexOf('WeekGrid.asp') >= 0)
    setup();

function nextWeek () {
    var week = current.add(1, 'week').week();
    setWeek(week);
}

function prevWeek () {
    var week = current.subtract(1, 'week').week();
    setWeek(week);
}

function weekChanged() {
    var week = document.querySelector('#weeks').value;
    setWeek(week);
}

function setWeek(num) {
    current.week(num);
    setDate(getDateString());
}

function getDateString() {
    var dateStr = current.format('YYYY-M-D');
    return dateStr;
}

function setDate (dateStr) {
    if (!document.frmGrid)
        return;
    document.frmGrid.newdate.value = dateStr;
    ReloadPage(0);
}

function pad(str) {
    return str.length > 1 ? str : '0' + str;
}

function setup() {
    if (initCurrent()) {
        var cont = document.createElement('div');
        var prev = '<a href="#" onclick="prevWeek()">prev</a>';
        var next = '<a href="#" onclick="nextWeek()">next</a>';
        var options = '', val;
        for (var i = 0; i < current.weeksInYear(); i++) {
            val = i+1;
            options += '<option value="' + val + '">' + val + '</option>';
        }
        var select = '<select id="weeks" onchange="weekChanged()">' + options + '</select>';
        cont.innerHTML = prev + ' ' + select + ' ' + next;
        cont.style.position = 'fixed';
        cont.style.right = '20px';
        document.body.appendChild(cont);
        document.querySelector('#weeks').value = current.week();
    }
}

function initCurrent() {
    try {
        var tds = document.querySelectorAll('#TimeHeader>table>tbody>tr>td');
        if (tds.length > 1) {
            var y = tds[0].innerText.match(/\d+/)[0];
            var w = tds[1].innerText.match(/\d+/)[0];
            var isoString = y + '-W' + pad(w) + '-1';
            current = moment(isoString);
            return true;
        }
        return false;
    }
    catch (e) {
        return false;
    }
}