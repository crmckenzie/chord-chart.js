///<reference path="qunit.js"/>
///<reference path="underscore.js"/>
///<reference path="chordcharts.js"/>
module("chord-charts tests");

test("Mode.getStepsFromRoot", function () {
    var mode = new isg.guitar.Mode();

    var expectations = [
        { arg: 1, result: 0 },
        { arg: 2, result: 2 },
        { arg: 3, result: 4 },
        { arg: 4, result: 5 },
        { arg: 5, result: 7 },
        { arg: 6, result: 9 },
        { arg: 7, result: 11 },
        { arg: 8, result: 12 }, // octave        
        { arg: 9, result: 14 }
    ];

    $.each(expectations, function (i, expectation) {
        var result = mode.getStepsFromRoot(expectation.arg);
        equal(result, expectation.result);
    });
});

test("ChromaticScale.indexOf", function() {
    var scale = new isg.guitar.ChromaticScale();

    var expectations = [
        { arg: 'E', result: 0 },
        { arg: 'F', result: 1 },
        { arg: 'F#', result: 2 },
        { arg: 'Gb', result: 2 },
        { arg: 'G', result: 3 },
        { arg: 'Eb', result: 11 } // octave        
    ];

    $.each(expectations, function (i, expectation) {
        var result = scale.indexOf(expectation.arg);
        equal(result, expectation.result);
    });
});

test("ChromaticScale.isNoteExpression", function() {
    var scale = new isg.guitar.ChromaticScale();

    var expectations = [
        { arg: 'E', result: true },
        { arg: 'F', result: true },
        { arg: 'F#', result: true },
        { arg: 'Gb', result: true },
        { arg: 'G', result: true },
        { arg: 'Eb', result: true },
        { arg: 'H', result: false },
        { arg: 'bG', result: false },
        { arg: '#C', result: false },
        { arg: 'Fred', result: false }
    ];

    $.each(expectations, function (i, expectation) {
        var result = scale.isNoteExpression(expectation.arg);
        equal(result, expectation.result, expectation.arg);
    });

});

test("ChromaticScale.intervalToNote", function () {
    var scale = new isg.guitar.ChromaticScale();

    var expectations = [
        //{ arg: 1, result: 'C' },
        //{ arg: 2, result: 'D' },
        //{ arg: 3, result: 'E' },
        //{ arg: 4, result: 'F' },
        //{ arg: 5, result: 'G' },
        //{ arg: 6, result: 'A' },
        //{ arg: 7, result: 'B' },
        //{ arg: 8, result: 'C' },
        { arg: 9 , result: 'D' },
        { arg: 10, result: 'E' },
        { arg: 11, result: 'F' }
    ];

    $.each(expectations, function (i, expectation) {
        var mode = new isg.guitar.Mode();
        var key = 'C';
        var result = scale.intervalToNote(expectation.arg, key, mode);
        equal(result, expectation.result, expectation.arg);
    });

});

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

test("Chart: set intervals", function() {
    var chart = new isg.guitar.Chart();
    chart.intervals("C:1,3,5,7");

    var expectedNotes = ["C","E","G", "B"];
    var notes = chart.notes();

    deepEqual(notes, expectedNotes);
});

test("Chart: set intervals with flats", function() {
    var chart = new isg.guitar.Chart();
    chart.intervals("C:1,3,5,b7");

    var expectedNotes = ["C", "E", "G", "Bb"];
    var notes = chart.notes();

    deepEqual(notes, expectedNotes);
});
