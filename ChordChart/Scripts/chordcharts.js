///<reference path="underscore.js"/>
(function (jQuery) {
    "use strict";

    $.extend(true, window, {        
       isg: {
           guitar: {
               String: GuitarString,
               Chart: Chart,
               Mode: Mode,
               ChromaticScale : ChromaticScale
           }
       }
    });

    function ChromaticScale() {
        var self = this;
        self.scale = [
        { name: 'E', aka: ['E'] },
        { name: 'F', aka: ['F'] },
        { name: 'F#', aka: ['F#', 'Gb'] },
        { name: 'G', aka: ['G'] },
        { name: 'Ab', aka: ['G#', 'Ab'] },
        { name: 'A', aka: ['A'] },
        { name: 'Bb', aka: ['A#', 'Bb'] },
        { name: 'B', aka: ['B'] },
        { name: 'C', aka: ['C'] },
        { name: 'C#', aka: ['C#', 'Db'] },
        { name: 'D', aka: ['D'] },
        { name: 'Eb', aka: ['D#', 'Eb'] }
        ];
        ;
    }

    ChromaticScale.prototype.indexOf = function(value) {
        var match = $.grep(this.scale, function (element) {
            return element.aka.indexOf(value) > -1;
        });

        if (match.length)
            return this.scale.indexOf(match[0]);

        return null;
    };

    ChromaticScale.prototype.getNoteForStep = function (value) {
        var index = value % this.scale.length;
        var note = this.scale[index];
        var name = note.name;
        return name;
    };

    ChromaticScale.prototype.normalizeNoteName = function(value) {
        var match = $.grep(this.scale, function (element) {
            return element.aka.indexOf(value) > -1;
        });

        if (match.length)
            return match[0].name;

        return null;
    };

    ChromaticScale.prototype.isNoteExpression = function(value) {
        var match = $.grep(this.scale, function (element) {
            return element.aka.indexOf(value) > -1;
        });

        if (match.length)
            return true;

        return false;
    };

    ChromaticScale.prototype.intervalToNote = function(interval, key, mode) {
        var steps = mode.getStepsFromRoot(interval);
        var keyRootNoteIndex = this.indexOf(key);
        var intervalIndex = keyRootNoteIndex + steps;
        var note = this.getNoteForStep(intervalIndex);
        return note;
    };

    var chromaticScale = new ChromaticScale();

    function sum(array) {
        var result = 0;
        $.each(array, function(i, e) {
            result += e;
        });
        return result;
    }
    
    function Mode(options) {
        var self = this;
        
        var defaults = {
            intervals: [2, 2, 1, 2, 2, 2, 1] // root: whole whole half whole whole whole half
        };

        var settings = $.extend({}, defaults, options);

        function getStepsFromRoot(interval) {

            var i = 0;
            var result = 0;
            var intervalIndex = 0;
            while (i < interval - 1) {
                if (i == settings.intervals.length) {
                    intervalIndex = 0;
                }
                result += settings.intervals[intervalIndex];
                i++;
                intervalIndex++;
            }
            return result;
        }

        return {
            getStepsFromRoot: getStepsFromRoot
        };
    }

    var standardTuning = [
        new GuitarString('E'),
        new GuitarString('A'),
        new GuitarString('D'),
        new GuitarString('G'),
        new GuitarString('B'),
        new GuitarString('E')
    ];

    function defaultRender(options) {
        
        var container = $(options.container);
        var tuning = options.tuning;
        var size = options.size;
        var position = options.position;
        var notes = options.notes;
        
        container.empty();

        var table = $("<table></table>");
        if (options.formatting.container) {
            table.addClass(options.formatting.container);
        }
        
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
                var cell = $("<td />");
                if (options.formatting.cell)
                    cell.addClass(options.formatting.cell);
                
                cell.appendTo(tableRow);

                var note = string.getNoteAtFret(fret);
                var html= options.formatting.formatNote( note);
                $(html).appendTo(cell);
            });
        }

        body.appendTo(table);

    }

    function GuitarString(root) {
        this.root = root;
        return this;
    }

    GuitarString.prototype.getNoteAtFret = function (fret) {
        var rootIndex = chromaticScale.indexOf(this.root);
        var name = chromaticScale.getNoteForStep(rootIndex + fret);
        return name;
    };

    GuitarString.prototype.getNoteAtInterval = function (steps) {
        return this.getNoteAtFret(steps - 1);
    };
    
    function Chart(options) {
        var self = this;

        var defaults = {
            size: 5,
            tuning: standardTuning,
            render: defaultRender,
            mode: new Mode(options),
            formatting: {
                container: "table table-striped table-bordered table-hover chord-chart",
                cell: "chord-chart-cell",
                formatNote: formatNote

            }
        };

        var settings = $.extend({}, defaults, options);

        var key = 'C';
        var notes = [];
        var position = 0;
        var intervals = [];

        function formatNote( note) {
            
            function isRootNote() {
                return note == key;
            }

            function isSelectedNote() {
                return $.inArray(note, notes) > -1;
            }

            if (isRootNote()) {
                return "<div class='root'>" + note + "</div>";
            }

            if (isSelectedNote()) {
                return "<div class='highlight'>" + note + "</div>";
            }

            return "<small>" + note + "</small>";
        }

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
                    
                    if (chromaticScale.isNoteExpression(note)) {

                        if (i < value.length - 1) {
                            var accent = value[i + 1];
                            if (isAccent(accent)) {
                                note += accent;
                                i++;
                            }
                        }

                        var normalized = chromaticScale.normalizeNoteName(note);
                        notes.push(normalized);
                    }
                }
            } else {
                throw "Cannot understand " + value + " as a notes expression";
            }
        }

        function setIntervals(value) {
            var expression = /^[A-Za-z]:\d(,\d)*$/;
            
            if (expression.test(value)) {
                key = value[0];
                var keyIndex = chromaticScale.indexOf(key);
                var map = value.substring(2)
                    .split(',')
                    .map(function (e) {
                        var modeInterval = parseInt(e);
                        var index = settings.mode.getStepsFromRoot(modeInterval);
                        var note = chromaticScale.getNoteForStep(index + keyIndex);
                        return note;
                    });

                setNotes(map);

            } else {
                throw "Invalid interval expression";
            }
        }

        function render() {
            var renderOptions = {
                container: settings.element,
                tuning: settings.tuning,
                size: settings.size,
                position: position,
                notes: notes,
                formatting: settings.formatting
            };
            settings.render(renderOptions);
        }

        return {
            intervals: function(value) {
                switch (arguments.length) {
                    case 0:
                        return intervals;
                    default:
                        setIntervals(value);
                        render();
                        break;
                }
            },
            key: function (value) {
                switch (arguments.length) {
                    case 0:
                        return key;
                    default:
                        key = value;
                        render();
                        break;
                }
            },
            notes: function (value) {
                switch (arguments.length) {
                    case 0:
                        return notes;

                    default:
                        setNotes(value);
                        render();
                        break;
                }
            },
            position: function (value) {
                switch (arguments.length) {
                    case 0:
                        return position;
                    default:
                        position = value;
                        render();
                        break;
                }
            },          
            size: function(value){
                switch (arguments.length) {
                    case 0:
                        return settings.size;
                    default:
                        settings.size = value;
                        render();
                        break;
                }          
            }
        };

    }


})(jQuery);


