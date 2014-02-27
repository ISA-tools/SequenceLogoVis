/**
 * Created by eamonnmaguire on 26/02/2014.
 */

var SequenceLogo = {}

SequenceLogo.variables = {
    placement: "",
    width: 0,
    height: 0,
    plotHeight: 0,
    plotCount: 0,
    glyph_strategy: "all", // can also be only_differences
    canvas: undefined,
    stats: {},
    amino_acids: {
//        Positive side chains
        R: {"color": "#1FAABD", "name": "Arginine", "short": "Ala", "charge": 1, "hydropathy": -4.5},
        H: {"color": "#1FAABD", "name": "Histidine", "short": "His", "charge": 1, "hydropathy": -3.2},
        K: {"color": "#1FAABD", "name": "Lysine", "short": "Lys", "charge": 1, "hydropathy": -3.9},

//      Negative side chains
        D: {"color": "#D75032", "name": "Aspartic acid", "short": "Asp", "charge": -1, "hydropathy": -3.5},
        E: {"color": "#D75032", "name": "Glutamic acid", "short": "Glu", "charge": -1, "hydropathy": -3.5},


        C: {"color": "#64AD59", "name": "Cysteine", "short": "Cys", "charge": 0, "hydropathy": 2.5},
        S: {"color": "#64AD59", "name": "Serine", "short": "Ser", "charge": 0, "hydropathy": -0.8},
        G: {"color": "#64AD59", "name": "Glycine", "short": "Cys", "charge": 0, "hydropathy": -0.4},
        Y: {"color": "#64AD59", "name": "Tyrosine", "short": "Tyr", "charge": 0, "hydropathy": -0.8},
        T: {"color": "#64AD59", "name": "Threonine", "short": "Thr", "charge": 0, "hydropathy": -0.7},


        P: {"color": "#4B3E4D", "name": "Proline", "short": "Pro", "charge": 0, "hydropathy": -1.6},
        F: {"color": "#4B3E4D", "name": "Phenylalanine", "short": "Phe", "charge": 0, "hydropathy": 2.8},
        V: {"color": "#4B3E4D", "name": "Valine", "short": "Val", "charge": 0, "hydropathy": 4.2},
        L: {"color": "#4B3E4D", "name": "Leucine", "short": "Leu", "charge": 0, "hydropathy": 3.8},
        I: {"color": "#4B3E4D", "name": "Isoleucine", "short": "Ili", "charge": 0, "hydropathy": 4.5},
        A: {"color": "#4B3E4D", "name": "Alanine", "short": "Ala", "charge": 0, "hydropathy": 1.8},

        M: {"color": "#E57E25", "name": "Methionine", "short": "Met", "charge": 0, "hydropathy": 1.9},
        W: {"color": "#E57E25", "name": "Tryptophan", "short": "Trp", "charge": 0, "hydropathy": -0.9},


        N: {"color": "#92278F", "name": "Asparagine", "short": "Asn", "charge": 0, "hydropathy": -3.5},
        Q: {"color": "#92278F", "name": "Glutamine", "short": "Pro", "charge": 0, "hydropathy": -3.5},

        X: {"color": "#f1f2f1", "name": "Unknown", "short": "X", "charge": 0, "hydropathy": 0},
    },
    positionTextStyle: {font: '12px Helvetica, Verdana', fill: "#414241", "font-weight": "lighter"},
    barTextStyle: {font: '12px Helvetica, Verdana', fill: "#fff", "font-weight": "bolder"}
}

var data = {};

SequenceLogo.rendering = {

    createSequenceLogo: function (options) {
        // data is an array...

        SequenceLogo.variables.placement = options.placement;
        SequenceLogo.variables.width = options.width;
        SequenceLogo.variables.height = options.height;
        SequenceLogo.variables.canvas = new Raphael(options.placement, options.width, options.height);
        SequenceLogo.rendering.processSequenceFiles(options.files);
    },

    processSequenceFiles: function (files) {
        SequenceLogo.variables.plotHeight = SequenceLogo.variables.height / files.length;

        for (var fileIndex in files) {
            d3.csv(files[fileIndex], function (sequenceData) {
                var key = Object.keys(sequenceData[0])[0];
                data[key] = {"metadata": {"sequences": sequenceData.length}, "positions": {}};
                for (var sequenceIndex in sequenceData) {
                    for (var positionIndex = 0; positionIndex < sequenceData[sequenceIndex][key].length; positionIndex++) {

                        if (!(positionIndex in data[key]["positions"])) {
                            data[key]["positions"][positionIndex] = {};
                        }

                        var letter = sequenceData[sequenceIndex][key][positionIndex];

                        if (!(letter in data[key]["positions"][positionIndex])) {
                            data[key]["positions"][positionIndex][letter] = 0;
                        }

                        data[key]["positions"][positionIndex][letter]++;
                    }
                }
                SequenceLogo.statistics.processData(data[key]);
                SequenceLogo.rendering.drawSequenceLogo(data[key], key)

            });
        }
    },

    /**
     * @param charge - either -1, 0, or 1
     * @param xPosition
     * @param yPos
     */
    drawCharge: function (charge, xPosition, yPos) {

        var neutral_path = SequenceLogo.variables.canvas.path("M3.878,7.766C1.74,7.766,0,6.023,0,3.881C0,1.742,1.74,0,3.878,0C6.02,0,7.762,1.742,7.762,3.881 C7.762,6.023,6.02,7.766,3.878,7.766z M3.878,1.438c-1.346,0-2.441,1.096-2.441,2.443c0,1.35,1.096,2.447,2.441,2.447 c1.351,0,2.447-1.098,2.447-2.447C6.325,2.533,5.229,1.438,3.878,1.438z");
        neutral_path.attr({fill: '#D1D3D4', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_a').transform("t" + (xPosition + 4) + " " + (yPos - 23) + ")");

        if (charge < 0) {
            var negative_line_path = SequenceLogo.variables.canvas.path("M0,1.32V0h3.871v1.32H0z");
            negative_line_path.attr({fill: '#D75032', 'stroke-width': '0', 'stroke-opacity': '1'}).transform("t" + (xPosition + 6) + " " + (yPos - 20) + ")");
            neutral_path.attr({fill: '#D75032', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'neutral_path');
        } else if (charge > 0) {
            var positive_cross_path = SequenceLogo.variables.canvas.path("M 5.816,3.223 4.541,3.223 4.541,1.947 3.221,1.947 3.221,3.223 1.945,3.223 1.945,4.543 3.221,4.543 3.221,5.818 4.541,5.818 4.541,4.543 5.816,4.543 z");
            positive_cross_path.attr({fill: '#64AD59', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'path_a').transform("t" + (xPosition + 4) + " " + (yPos - 23) + ")");

            neutral_path.attr({fill: '#64AD59', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'neutral_path');
        }
    },

    /**
     * @param hydropathy either -1, 0 or 1
     * @param xPosition
     * @param yPos
     */
    drawHydropathy: function (hydropathy, xPosition, yPos) {
        var drop_path = SequenceLogo.variables.canvas.path("M5.275,5.277c0,1.456-1.18,2.639-2.637,2.639C1.18,7.916,0,6.733,0,5.277S1.18,0,2.639,0 C4.096,0,5.275,3.821,5.275,5.277z");


        if (hydropathy == 0) {
            var semidrop_path = SequenceLogo.variables.canvas.path("M0.05,4.695C0.021,4.91,0,5.113,0,5.276c0,1.455,1.181,2.638,2.639,2.638c1.456,0,2.637-1.183,2.637-2.638 c0-0.163-0.018-0.366-0.046-0.581H0.05z");
            semidrop_path.attr({fill: '#27AAE1', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'semidrop_path').transform("t" + xPosition + " " + (yPos - 23) + ")");
        }

        drop_path.attr({fill: (hydropathy == 1) ? '#27AAE1' : '#D1D3D4', 'stroke-width': '0', 'stroke-opacity': '1'}).data('id', 'drop_path').transform("t" + xPosition + " " + (yPos - 23) + ")");

    },

    /**
     *
     * @param deviation - a range between 0 and 4
     *                    0 - no deviation, 1 - small variation, 2 - medium variation, 3 - high variation
     * @param xPosition
     * @param yPos
     */
    drawDeviation: function (deviation, xPosition, yPos, maxXPosition) {
        if (deviation == 0) {
            this.Line(xPosition + 7, yPos - 6, maxXPosition - 7, yPos - 6, "#aaa", 2);
        } else if (deviation == 1) {
            this.Line(xPosition + 7, yPos - 6, maxXPosition - 7, yPos - 8, "#aaa", 2);
        } else if (deviation == 2) {
            this.Line(xPosition + 7, yPos - 6, maxXPosition - 7, yPos - 12, "#aaa", 1);
        } else if (deviation == 3) {
            var middleXPos = xPosition + ((maxXPosition - xPosition)/2);
            this.Line(middleXPos, yPos - 3, middleXPos, yPos - 12, "#aaa", 1);
        }
    },

    drawSequenceLogo: function (sequenceData, key) {
        var widthPerPosition = SequenceLogo.variables.width / Object.keys(sequenceData["positions"]).length - 1;

        for (var positionIndex in sequenceData["positions"]) {
            if (positionIndex != "statistics") {
                var sorted = this.sortByValue(sequenceData["positions"][positionIndex]);
                var maxBarHeight = (SequenceLogo.variables.plotHeight * .667);
                var scale = d3.scale.linear().domain([0, +sequenceData.metadata.sequences]).range([0, maxBarHeight]);

                // if
                var plotPosition =SequenceLogo.variables.plotCount;
                if(key.indexOf("|") != -1) {
                    plotPosition = parseInt(key.substring(0, key.indexOf("|")));
                }

                var yPos = 43 + plotPosition * SequenceLogo.variables.plotHeight;

                var xPosition = positionIndex * widthPerPosition;

                if (plotPosition == 0) {
                    // draw position number

                    SequenceLogo.variables.canvas.rect(xPosition, 50, widthPerPosition, SequenceLogo.variables.height).attr({"fill": positionIndex % 2 == 0 ? "#f1f2f1" : "#fff", "stroke": "#fff"}).toBack();
                    SequenceLogo.variables.canvas.text(xPosition + 11, 8, +positionIndex + 1).attr(SequenceLogo.variables.positionTextStyle);
                }

                var stats = sequenceData["positions"][positionIndex].metrics;
                console.log(stats);
                this.drawCharge(stats.charge_score, xPosition, yPos);
                this.drawHydropathy(stats.hydropathy, (xPosition + widthPerPosition - 10), yPos);
                this.drawDeviation(3, xPosition, yPos, xPosition + widthPerPosition);

                for (var barToDraw in sorted) {
                    var letter = sorted[barToDraw];

                    if (letter != "." && letter != "metrics") {
                        var value = sequenceData["positions"][positionIndex][letter];
                        var barHeight = scale(value);
                        SequenceLogo.variables.canvas.rect(xPosition + 2, yPos, widthPerPosition - 4, barHeight).attr({"fill": SequenceLogo.variables.amino_acids[letter].color, "stroke": "#fff"}).toFront();
                        if (barHeight / maxBarHeight > .35) {
                            SequenceLogo.variables.canvas.text(xPosition + 9, yPos + 8, letter).attr(SequenceLogo.variables.barTextStyle);
                        }
                        yPos += barHeight;
                    }

                }
            }
        }
        SequenceLogo.variables.plotCount++;
    },

    Line: function (startX, startY, endX, endY, color, strokeWidth) {
        var start = {
            x: startX,
            y: startY
        };
        var end = {
            x: endX,
            y: endY
        };
        var getPath = function () {
            return "M" + start.x + " " + start.y + " L" + end.x + " " + end.y;
        };

        var node = SequenceLogo.variables.canvas.path(getPath()).attr("stroke", color ? color : "#ccc").attr('stroke-linecap', "round").attr({'stroke-width': strokeWidth ? strokeWidth : '2'});
        node.toFront();
    },

    sortByValue: function (dict) {
        var sortable = [];
        for (var letter in dict) {
            if (letter != "metrics") {
                sortable.push([letter, dict[letter]])
            }
        }
        sortable.sort(function (a, b) {
            return b[1] - a[1]
        })

        var sortedLetters = [];
        for (var index = 0; index < sortable.length; index++) {
            sortedLetters.push(sortable[index][0]);
        }

        return sortedLetters;
    }
}

SequenceLogo.statistics = {
    processData: function (data) {
        // runs over the data and calculates diversity metrics, determining charge (+/-/n), hydrophobicity (%hphob, %hphil)
        // and variation measure (diversity at that position - probably Std Deviation).

        for (var positionIndex in data["positions"]) {
            var metrics = {"charge": 0, "hydrophobicity": 0, "deviation": 0}

            var values = [];
            for (var letter in data["positions"][positionIndex]) {
                if (letter != ".") {
                    metrics.hydrophobicity += (data["positions"][positionIndex][letter] * SequenceLogo.variables.amino_acids[letter].hydropathy);
                    metrics.charge += (data["positions"][positionIndex][letter] * SequenceLogo.variables.amino_acids[letter].charge);
                    values.push(data["positions"][positionIndex][letter]);
                }
            }

            metrics.hydropathy = metrics.hydrophobicity < 0 ? -1 : 1;
            metrics.charge_score = metrics.charge < 0 ? -1 : 1;

            data["positions"][positionIndex]["metrics"] = metrics;
            // TODO: Std deviation doesn't really work for this...

        }

        // TODO: find changes across positions
    }

}