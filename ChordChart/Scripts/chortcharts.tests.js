///<reference path="qunit.js"/>
///<reference path="chordcharts.js"/>
module("chord-charts tests");

test("Create isg.guitar.String", function() {
    var e = new isg.guitar.String('E');
    ok(e);
});

test("String.getNoteAt", function () {
    var e = new isg.guitar.String('E');

    var expectations = [
        {arg: 0, note: 'E'},
        {arg: 1, note: 'F'},
        {arg: 2, note: 'F#'},
        {arg: 3, note: 'G'},
        {arg: 12, note: 'E'}
    ];

    $.each(expectations, function (i, expect) {
        var note = e.getNoteAtFret(expect.arg);
        equal(note, expect.note);
    });

});

test("String.getNoteAtInterval", function() {
    var e = new isg.guitar.String('E');

    var expectations = [
        { arg: 1, note: 'E' },
        { arg: 2, note: 'F' },
        { arg: 3, note: 'F#' },
        { arg: 4, note: 'G' },
        { arg: 13, note: 'E' }
    ];

    $.each(expectations, function (i, expect) {
        var note = e.getNoteAtInterval(expect.arg);
        equal(note, expect.note);
    });
});

test("Chart: get notes", function() {
    var chart = new isg.guitar.Chart();
    var notes = chart.notes();
    deepEqual(notes, []);
});

test("Chart: set notes as array", function() {
    var chart = new isg.guitar.Chart();
    var value = ['A', 'C#', 'E'];
    
    chart.notes(value);
    var notes = chart.notes();

    deepEqual(notes, value);
});

test("Chart: set notes as comma delimited.", function() {
    var chart = new isg.guitar.Chart();
    var value = ['A', 'C#', 'E'];

    chart.notes('A,C#,E');
    var notes = chart.notes();

    deepEqual(notes, value);
});

test("Chart: set notes as compact string", function () {
    var chart = new isg.guitar.Chart();
    var value = ['A', 'C#', 'E'];

    chart.notes('AC#E');
    var notes = chart.notes();

    deepEqual(notes, value);
});

test("Chart: set notes using alternate names", function() {
    var chart = new isg.guitar.Chart();
    var value = ['A', 'C#', 'E'];

    chart.notes('ADbE');
    var notes = chart.notes();

    deepEqual(notes, value);
});