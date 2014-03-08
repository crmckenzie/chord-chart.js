(function (jQuery) {
    "use strict";

    $.extend(true, window, {        
       isg: {
           guitar: {
               String: GuitarString,
               Chart: chordChart
           }
       }
    });

    var chromaticScale =
    [
        { name: 'E',  aka: ['E'] },
        { name: 'F',  aka: ['F'] },
        { name: 'F#', aka: ['F#', 'Gb'] },
        { name: 'G',  aka: ['G'] },
        { name: 'Ab', aka: ['G#', 'Ab'] },
        { name: 'A',  aka: ['A'] },
        { name: 'Bb', aka: ['A#', 'Bb'] },
        { name: 'B',  aka: ['B'] },
        { name: 'C',  aka: ['C'] },
        { name: 'C#', aka: ['C#', 'Db'] },
        { name: 'D',  aka: ['D'] },
        { name: 'Eb', aka: ['D#', 'Eb'] }
    ];

    function isANoteExpression(value) {
        var match = $.grep(chromaticScale, function (element) {
            return element.aka.indexOf(value) > -1;
        });
        
        if (match.length)
            return match[0];

        return false;
    }

    function indexOfNote(value) {
        var match = $.grep(chromaticScale, function (element) {
            return element.aka.indexOf(value) > -1;
        });

        if (match.length)
            return chromaticScale.indexOf(match[0]);

        return null;
    }

    function getNoteForIndex(value) {
        var index = value % chromaticScale.length;
        var note = chromaticScale[index];
        var name = note.name;
        return name;
    }

    function normalizeNoteName(value) {
        var match = $.grep(chromaticScale, function (element) {
            return element.aka.indexOf(value) > -1;
        });

        if (match.length)
            return match[0].name;

        return null;
    }

    function GuitarString(root) {
        this.root = root;
        return this;
    }

    GuitarString.prototype.getNoteAtFret = function (fret) {
        var rootIndex = indexOfNote(this.root);
        var name = getNoteForIndex(rootIndex + fret);
        return name;
    };

    GuitarString.prototype.getNoteAtInterval = function(interval) {
        return this.getNoteAtFret(interval -1);
    };

    var standardTuning = [
        new GuitarString('E'),
        new GuitarString('A'),
        new GuitarString('D'),
        new GuitarString('G'),
        new GuitarString('B'),
        new GuitarString('E')
    ];

    function standardRender(container, tuning, size, position, notes) {
        container = $(container);
        container.empty();

        var table = $("<table class='table table-striped table-bordered table-hover chord-chart'></table>");
        table.appendTo(container);

        var header = $("<thead />");
        var headerRow = $("<tr />");

        $.each(tuning, function (i, string) {
            var headerColumn = $("<th class='guitar-fret'>" + string.root + "</th>");
            headerColumn.appendTo(headerRow);
        });

        headerRow.appendTo(header);
        header.appendTo(table);

        var body = $("<tbody />");

        for (var fret = position;
                 fret < position + size;
                 fret++) {

            var tableRow = $("<tr />");
            tableRow.appendTo(body);

            $.each(tuning, function (j, string) {
                var cell = $("<td class='guitar-fret' />");
                cell.appendTo(tableRow);

                var note = string.getNoteAtFret(fret);

                if ($.inArray(note, notes) > -1) {
                    $("<strong>" + note + "</note>").appendTo(cell);
                }
                else {
                    cell.text(note);
                }
            });
        }

        body.appendTo(table);

    }


    function chordChart(options) {
        var self = this;

        var defaults = {
            size: 5,
            tuning: standardTuning,
            render: standardRender
        };

        var settings = $.extend({}, defaults, options);

        var notes = [];
        var position = 0;

        function isAccent(value) {
            return value == '#' || value == 'b';
        }

        function setNotes(value) {
            if ($.isArray(value)) {
                notes = value;
            } else if (typeof (value) == 'string') {
                notes = [];
                for (var i = 0; i < value.length; i++) {
                    var note = value[i];
                    
                    if (isANoteExpression(note)) {

                        if (i < value.length - 1) {
                            var accent = value[i + 1];
                            if (isAccent(accent)) {
                                note += accent;
                                i++;
                            }
                        }

                        var normalized = normalizeNoteName(note);
                        notes.push(normalized);
                    }
                }
            } else {
                throw "Cannot understand " + value + " as a notes expression";
            }
        }

        return {
            notes: function (value) {
                switch (arguments.length) {
                    case 0:
                        return notes;

                    default:
                        setNotes(value);
                        settings.render(settings.element, settings.tuning, settings.size, position, notes);
                        break;
                }
            },
            position: function (value) {
                switch (arguments.length) {
                    case 0:
                        return position;
                        break;
                    default:
                        position = value;
                        settings.render(settings.element, settings.tuning, settings.size, position, notes);
                        break;
                }
            }
        };

    }


})(jQuery);


