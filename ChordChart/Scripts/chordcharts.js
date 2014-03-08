

var chromaticScale =
      ['E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb'];

function GuitarString(root) {
    this.root = root;
    return this;
}

GuitarString.prototype.getNoteAtFret = function(fret) {
    var rootIndex = chromaticScale.indexOf(this.root);
    var noteIndex = (rootIndex + fret) % 12;
    var note = chromaticScale[noteIndex];
    return note;
};

function Guitar() {
    var neck = {
        strings: [
          new GuitarString('E'),
          new GuitarString('A'),
          new GuitarString('D'),
          new GuitarString('G'),
          new GuitarString('B'),
          new GuitarString('E')
        ]
    };
    return neck;
}

function chordChart(options) {

    var defaults = {
        size: 5
    };

    var settings = $.extend({}, defaults, options);

    var chord = [];
    var position = 0;

    var guitar = new Guitar();

    function render() {
        var container = $(settings.element);
        container.empty();

        var table = $("<table class='table table-striped table-bordered table-hover chord-chart'></table>");
        table.appendTo(container);

        var header = $("<thead />");
        var headerRow = $("<tr />");

        $.each(guitar.strings, function(i, string) {
            var headerColumn = $("<th class='guitar-fret'>" + string.root + "</th>");
            headerColumn.appendTo(headerRow);
        });

        headerRow.appendTo(header);
        header.appendTo(table);

        var body = $("<tbody />");

        for (var fret = position;
                 fret < position + settings.size;
                 fret++) {

            var tableRow = $("<tr />");
            tableRow.appendTo(body);

            $.each(guitar.strings, function(j, string) {
                var cell = $("<td class='guitar-fret' />");
                cell.appendTo(tableRow);

                var note = string.getNoteAtFret(fret);

                if ($.inArray(note, chord) > -1) {
                    $("<strong>" + note + "</note>").appendTo(cell);
                }
                else {
                    cell.text(note);
                }
            });
        }

        body.appendTo(table);

    }

    return {
        chord: function (newChord) {
            switch (arguments.length) {
                case 0:
                    return chord;
                    break;

                default:
                    chord = newChord;
                    render();
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
                    console.log("setting position to " + value);
                    render();
                    break;
            }
        }
    };

}

