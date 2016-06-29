/**
 * Created by eamonnmaguire on 26/02/2014.
 */

var SequenceLogo = {}

SequenceLogo.variables = {
    placement: "",
    width: 0,
    height: 0,
    fileCount: 0,
    plotHeight: 0,
    plotCount: 0,
    positionCount: 0,
    position_info: {},
    marginLeft: 30,
    glyph_strategy: "only_differences", // can be "all" or "only_differences"
    canvas: undefined,
    highlight_conserved: false,
    draw_consensus: true,
    height_algorithm: "entropy", // can be "frequency" or "entropy", the classic way of creating sequence logos
    type: "amino_acids",
    amino_acids: {
        "count": 20,
        R: {"color": "#1FAABD", "name": "Arginine", "short": "Ala", "charge": 1, "hydropathy": -4.5},
        H: {"color": "#1FAABD", "name": "Histidine", "short": "His", "charge": 1, "hydropathy": -3.2},
        K: {"color": "#1FAABD", "name": "Lysine", "short": "Lys", "charge": 1, "hydropathy": -3.9},

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
        Q: {"color": "#92278F", "name": "Glutamine", "short": "Gln", "charge": 0, "hydropathy": -3.5},

        X: {"color": "#f1f2f1", "name": "Unknown", "short": "X", "charge": 0, "hydropathy": 0}
    },

    dna: {
        "count": 4,
        A: {"color": "#1FAABD", "name": "Adenine", "short": "A"},
        T: {"color": "#D75032", "name": "Thymine", "short": "T"},
        G: {"color": "#4B3E4D", "name": "Guanine", "short": "G"},
        C: {"color": "#64AD59", "name": "Cytosine", "short": "C"},
        X: {"color": "#f1f2f1", "name": "Unknown", "short": "X"}
    },

    rna: {
        "count": 4,
        A: {"color": "#1FAABD", "name": "Adenine", "short": "A"},
        U: {"color": "#D75032", "name": "Uracil", "short": "U"},
        G: {"color": "#4B3E4D", "name": "Guanine", "short": "G"},
        C: {"color": "#64AD59", "name": "Cytosine", "short": "C"},
        X: {"color": "#f1f2f1", "name": "Unknown", "short": "X"}
    },


    positionTextStyle: {font: '12px Helvetica, Verdana', fill: "#414241", "font-weight": "lighter"},
    barTextStyle: {font: '14px Helvetica, Verdana', fill: "#fff", "font-weight": "bolder"},
    consensusTextStyle: {font: '13px Helvetica, Verdana', "font-weight": "bolder"},
    axisTextStyle: {font: '7px Helvetica, Verdana', "font-weight": "normal"}
}


var data = {};

SequenceLogo.rendering = {

    createSequenceLogo: function (options) {
        // data is an array...

        SequenceLogo.variables.placement = options.placement;
        SequenceLogo.variables.width = options.width;
        SequenceLogo.variables.height = options.height;


        if (options.type)
            SequenceLogo.variables.type = options.type;

        if (options.glyph_strategy)
            SequenceLogo.variables.glyph_strategy = options.glyph_strategy;

        if (options.height_algorithm)
            SequenceLogo.variables.height_algorithm = options.height_algorithm;

        if("draw_consensus" in options)
            SequenceLogo.variables.draw_consensus = options.draw_consensus;

        if("highlight_conserved" in options)
            SequenceLogo.variables.highlight_conserved = options.highlight_conserved;


        SequenceLogo.variables.canvas = new Raphael(options.placement, options.width, options.height);
        SequenceLogo.rendering.processSequenceFiles(options.files);
    },

    processSequenceFiles: function (files) {
        SequenceLogo.variables.fileCount = files.length;
        SequenceLogo.variables.plotHeight = SequenceLogo.variables.height / files.length;

        for (var fileIndex in files) {
            d3.csv(files[fileIndex], function (sequenceData) {
                var key = Object.keys(sequenceData[0])[0];
                console.log(key);
                data[key] = {"metadata": {"sequences": sequenceData.length}, "positions": {}};
                for (var sequenceIndex in sequenceData) {
                    SequenceLogo.variables.positionCount = sequenceData[sequenceIndex][key].length;
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
    drawCharge: function (charge, xPosition, yPos, positionIndex) {


        if (charge == 0) {
            var neutral_path = SequenceLogo.variables.canvas.path("M3.878,7.766C1.74,7.766,0,6.023,0,3.881C0,1.742,1.74,0,3.878,0C6.02,0,7.762,1.742,7.762,3.881 C7.762,6.023,6.02,7.766,3.878,7.766z M3.878,1.438c-1.346,0-2.441,1.096-2.441,2.443c0,1.35,1.096,2.447,2.441,2.447 c1.351,0,2.447-1.098,2.447-2.447C6.325,2.533,5.229,1.438,3.878,1.438z");
            neutral_path.attr({fill: '#D1D3D4', 'stroke-width': '0', 'stroke-opacity': '1'}).transform("t" + (xPosition + 4) + " " + (yPos - 23) + ")");
            neutral_path.node.id = 'charge-' + positionIndex;
        } else if (charge < 0) {
            var negative_line_path = SequenceLogo.variables.canvas.path("M0,2.32V0h4.871v2.32H0z");
            negative_line_path.attr({fill: '#D75032', 'stroke-width': '0', 'stroke-opacity': '1'}).transform("t" + (xPosition + 6) + " " + (yPos - 20) + ")");
            negative_line_path.node.id = 'charge-' + positionIndex;
//            neutral_path.attr({fill: '#D75032', 'stroke-width': '0', 'stroke-opacity': '1'});
        } else if (charge > 0) {
            var positive_cross_path = SequenceLogo.variables.canvas.path("M 5.816,3.223 4.541,3.223 4.541,1.947 3.221,1.947 3.221,3.223 1.945,3.223 1.945,4.543 3.221,4.543 3.221,5.818 4.541,5.818 4.541,4.543 5.816,4.543 z");
            positive_cross_path.attr({fill: '#64AD59', 'stroke-width': '0', 'stroke-opacity': '1'}).transform("t" + (xPosition + 4) + " " + (yPos - 23) + ")");
            positive_cross_path.node.id = 'charge-' + positionIndex;
//            neutral_path.attr({fill: '#64AD59', 'stroke-width': '0', 'stroke-opacity': '1'});
        }
    },

    /**
     * @param hydropathy either -1, 0 or 1
     * @param xPosition
     * @param yPos
     */
    drawHydropathy: function (hydropathy, xPosition, yPos, positionIndex) {
        var drop_path = SequenceLogo.variables.canvas.path("M5.275,5.277c0,1.456-1.18,2.639-2.637,2.639C1.18,7.916,0,6.733,0,5.277S1.18,0,2.639,0 C4.096,0,5.275,3.821,5.275,5.277z");

        if (hydropathy == 0) {
            var semidrop_path = SequenceLogo.variables.canvas.path("M0.05,4.695C0.021,4.91,0,5.113,0,5.276c0,1.455,1.181,2.638,2.639,2.638c1.456,0,2.637-1.183,2.637-2.638 c0-0.163-0.018-0.366-0.046-0.581H0.05z");
            semidrop_path.attr({fill: '#27AAE1', 'stroke-width': '0', 'stroke-opacity': '1'}).transform("t" + xPosition + " " + (yPos - 23) + ")");
            semidrop_path.node.id = 'hydropathy-' + positionIndex;
        }

        drop_path.node.id = 'hydropathy-' + positionIndex;
        drop_path.attr({fill: (hydropathy == 1) ? '#27AAE1' : '#D1D3D4', 'stroke-width': '0', 'stroke-opacity': '1'}).transform("t" + xPosition + " " + (yPos - 23) + ")");

    },

    /**
     *
     * @param deviation - a range between 0 and 4
     *                    1 - no deviation, 2 - small variation, 3 - medium variation, 4+ - high variation
     * @param xPosition
     * @param yPos
     */
    drawDeviation: function (deviation, xPosition, yPos, maxXPosition) {
        if (deviation == 1) {
            this.Line(xPosition + 7, yPos - 6, maxXPosition - 7, yPos - 6, "#414241", 2);
        } else if (deviation == 2) {
            this.Line(xPosition + 7, yPos - 6, maxXPosition - 7, yPos - 8, "#aaa", 2);
        } else if (deviation == 3) {
            this.Line(xPosition + 7, yPos - 6, maxXPosition - 7, yPos - 12, "#f1f2f1", 1);
        } else {
            var middleXPos = xPosition + ((maxXPosition - xPosition) / 2);
            this.Line(middleXPos, yPos - 3, middleXPos, yPos - 12, "#f1f2f1", 1);
        }
    },

    findAndHideNonVaryingGlyphs: function () {

        for (var index = 0; index < SequenceLogo.variables.positionCount; index++) {
            var glyphs = {charge_score: {"previous": undefined, "same": true},
                hydropathy: {"previous": undefined, "same": true},
                variance: {"previous": undefined, "same": true}};

            for (var key in data) {
                for (var glyph_key in glyphs) {
                    var value = data[key]["positions"][index].metrics[glyph_key];
                    if (glyphs[glyph_key].previous == undefined) {
                        glyphs[glyph_key].previous = value;
                    } else {
                        if (glyphs[glyph_key].previous != value) {
                            glyphs[glyph_key].same = false;
                        }
                    }
                }
            }
            if (glyphs.charge_score.same) {
                d3.selectAll("#charge-" + index).each(function () {
                    this.remove()
                });
            }
            if (glyphs.hydropathy.same) {
                d3.selectAll("#hydropathy-" + index).each(function () {
                    this.remove()
                });
            }
        }
    },

    drawSequenceLogo: function (sequenceData, key) {
        var widthPerPosition = SequenceLogo.variables.width / Object.keys(sequenceData["positions"]).length - 1;

        var maxBarHeight = (SequenceLogo.variables.plotHeight * .667);
        var scale = d3.scale.linear().domain([0, +sequenceData.metadata.sequences]).range([0, maxBarHeight]);


        if (SequenceLogo.variables.height_algorithm == "entropy") {

            scale = d3.scale.linear()
                .domain([0, SequenceLogo.statistics.log2(SequenceLogo.variables[SequenceLogo.variables.type].count)])
                .range([0, maxBarHeight]);
        }
        var plotPosition = SequenceLogo.variables.plotCount;
        SequenceLogo.variables.position_info[plotPosition] = {};

        for (var positionIndex in sequenceData["positions"]) {
            if (positionIndex != "statistics") {
                var sorted = this.sortByValue(sequenceData["positions"][positionIndex]);

                if (key.indexOf("|") != -1) {
                    plotPosition = parseInt(key.substring(0, key.indexOf("|")));
                }

                var yPos = 43 + plotPosition * SequenceLogo.variables.plotHeight;

                var xPosition = SequenceLogo.variables.marginLeft + (positionIndex * widthPerPosition);

                if (plotPosition == 0) {
                    SequenceLogo.variables.canvas.rect(xPosition, 50, widthPerPosition, maxBarHeight * (SequenceLogo.variables.fileCount + 1) - 30).attr({"fill": positionIndex % 2 == 0 ? "#f1f2f1" : "#fff", "stroke": "#fff"}).toBack();
                    SequenceLogo.variables.canvas.text(xPosition + 13, 8, +positionIndex + 1).attr(SequenceLogo.variables.positionTextStyle);
                } else {
                    yPos -= 20;
                }

                if (positionIndex == 0) {
                    SequenceLogo.rendering.Line(SequenceLogo.variables.marginLeft - 4, yPos, SequenceLogo.variables.marginLeft - 4, yPos + maxBarHeight, "#aaa", 1);
                    var text = SequenceLogo.variables.canvas.text(SequenceLogo.variables.marginLeft - 26, (yPos + maxBarHeight / 2), SequenceLogo.variables.height_algorithm == "entropy" ? "bits" : "% Percent").attr(SequenceLogo.variables.axisTextStyle);
                    text.attr({transform: "r" + -90});
                    SequenceLogo.variables.canvas.text(SequenceLogo.variables.marginLeft - 14, yPos, "0").attr(SequenceLogo.variables.axisTextStyle);

                    SequenceLogo.variables.canvas.text(SequenceLogo.variables.marginLeft - 14, yPos + (maxBarHeight / 2),
                            SequenceLogo.variables.height_algorithm == "entropy" ? SequenceLogo.statistics.getNumWithSetDec(
                            SequenceLogo.statistics.log2(SequenceLogo.variables[SequenceLogo.variables.type].count), 2) / 2 : "50").attr(SequenceLogo.variables.axisTextStyle);

                    SequenceLogo.variables.canvas.text(SequenceLogo.variables.marginLeft - 14, yPos + maxBarHeight,
                            SequenceLogo.variables.height_algorithm == "entropy" ? SequenceLogo.statistics.getNumWithSetDec(
                            SequenceLogo.statistics.log2(SequenceLogo.variables[SequenceLogo.variables.type].count), 2) : "100%")
                        .attr(SequenceLogo.variables.axisTextStyle);
                    SequenceLogo.rendering.Line(xPosition, yPos + maxBarHeight, SequenceLogo.variables.width - 20, yPos + maxBarHeight, "#eee", 1);
                }

                var stats = sequenceData["positions"][positionIndex].metrics;

                if (SequenceLogo.variables.type == "amino_acids") {
                    this.drawCharge(stats.charge_score, xPosition, yPos, positionIndex);
                    this.drawHydropathy(stats.hydropathy, (xPosition + widthPerPosition - 10), yPos, positionIndex);
                }
                this.drawDeviation(stats.variance, xPosition, yPos, xPosition + widthPerPosition, positionIndex);


                if(!(plotPosition in SequenceLogo.variables.position_info)){
                    SequenceLogo.variables.position_info[plotPosition] = {};
                }

                SequenceLogo.variables.position_info[plotPosition][positionIndex] = {};

                for (var barToDraw in sorted) {
                    var letter = sorted[barToDraw];


                    if (letter != "." && letter != "metrics") {
                        var value = sequenceData["positions"][positionIndex][letter];
                        if (SequenceLogo.variables.height_algorithm == "entropy") {
                            value = SequenceLogo.statistics.calculateEntropy(letter, sequenceData["positions"][positionIndex], sequenceData.metadata.sequences);
                        }

                        SequenceLogo.variables.position_info[plotPosition][positionIndex][letter] = {"value": sequenceData["positions"][positionIndex][letter], "entropy": value};

                        var barHeight = scale(value);
                        console.log(plotPosition + "-" + positionIndex);
                        var bar = SequenceLogo.variables.canvas.rect(xPosition + 2, yPos, widthPerPosition - 4, barHeight).data("position", plotPosition + "-" + positionIndex).attr({"fill": SequenceLogo.variables[[SequenceLogo.variables.type]][letter].color, "stroke": "#fff",
                            opacity: stats.variance <= 2 || !SequenceLogo.variables.highlight_conserved ? 1 : .2})
                            .toFront()
                            .hover(function (event) {
                                var value = this.data().position.split("-");
                                d3.select("#position").html(parseInt(value[1]) + 1);
                                SequenceLogo.rendering.renderPopupSummary(value[0], value[1]);
                                d3.select(".popup").classed("hidden", false);
                                var x = event.pageX;
                                if(x+300 > window.innerWidth) {
                                    x = event.pageX-300;
                                }
                                d3.select(".popup").style({"top": event.pageY + "px", "left": x+ "px"});
                            }, function () {
                                d3.select(".popup").classed("hidden", true);
                            });


                        if (barHeight / maxBarHeight > .20) {
                            SequenceLogo.variables.canvas.text(xPosition + 9, yPos + 8, letter).attr(SequenceLogo.variables.barTextStyle);
                        }
                        yPos += barHeight;
                    }
                }

                if (SequenceLogo.variables.draw_consensus) {
                    var yPlotPosition = (plotPosition * SequenceLogo.variables.plotHeight) + SequenceLogo.variables.plotHeight;
                    SequenceLogo.variables.canvas.text((xPosition + 12), (yPlotPosition - 20), sorted[0]).attr(SequenceLogo.variables.consensusTextStyle).attr("fill", SequenceLogo.variables[[SequenceLogo.variables.type]][sorted[0]].color);
                }
            }
        }

        SequenceLogo.variables.plotCount++;

        // if we're at the last one to be drawn, we can then check to see if the charges are different
        if (SequenceLogo.variables.glyph_strategy == "only_differences"
            && SequenceLogo.variables.plotCount == SequenceLogo.variables.fileCount) {

            this.findAndHideNonVaryingGlyphs();
        }
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
        return node;
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
        });

        var sortedLetters = [];
        for (var index = 0; index < sortable.length; index++) {
            sortedLetters.push(sortable[index][0]);
        }

        return sortedLetters;
    },

    // Renders a summary of the information for a position
    renderPopupSummary: function (plot, position) {
        d3.select("#position_details").html("");

        var width = 300, height = 250;
        var popup_raph = new Raphael("position_details", width, height);

        // split pane horizontally to compare frequencies of residues

        var pane_width = width / Object.keys(SequenceLogo.variables.position_info).length;

        // draw the items at position 'position' first, then the rest
        var count = 0;
        for (var plot_key in SequenceLogo.variables.position_info) {
            var x = count * pane_width;
            popup_raph.text(x + 25, 8, "Group " + plot_key).attr(SequenceLogo.variables.positionTextStyle)


            var text_y = 21, y = 30;

            var total = 0;
            for (var letter in SequenceLogo.variables.position_info[plot][position]) {
                total += SequenceLogo.variables.position_info[plot][position][letter].value;
            }

            var scale = d3.scale.linear().domain([0, total]).range([0, 50]);

            for (var letter in SequenceLogo.variables.position_info[plot][position]) {
                popup_raph.text(x + 25, text_y, letter).attr(SequenceLogo.variables.consensusTextStyle).attr("fill", SequenceLogo.variables[SequenceLogo.variables.type][letter].color);
                // draw bar
                popup_raph.rect(x + 35, y, 50, 15).attr({"fill": "#f1f2f1", "stroke": "#ccc"});
                popup_raph.rect(x + 35, y, scale(SequenceLogo.variables.position_info[plot][position][letter].value), 15).attr({"fill": SequenceLogo.variables[SequenceLogo.variables.type][letter].color, "stroke": "none"});

                popup_raph.text(x + 98, text_y, SequenceLogo.variables.position_info[plot][position][letter].value).attr(SequenceLogo.variables.positionTextStyle).attr("fill", SequenceLogo.variables[SequenceLogo.variables.type][letter].color);
                y += 20;
                text_y += 10;
            }
            count++;
        }

    }
};

SequenceLogo.statistics = {
    processData: function (data) {
        // runs over the data and calculates diversity metrics, determining charge (+/-/n), hydrophobicity (%hphob, %hphil)
        // and variation measure (diversity at that position - probably Std Deviation).

        for (var positionIndex in data["positions"]) {
            var metrics = {"charge": 0, "hydrophobicity": 0, "deviation": 0}

            var values = [];

            var sorted = SequenceLogo.rendering.sortByValue(data["positions"][positionIndex]);

            // threshold to be reached before satisfied that most of the cases are covered by the current items (95%)
            var threshold = .80;

            var ofTotal = 0;
            var numberOfItemsBeforeThreshold = 0;

            for (var letterIndex in sorted) {
                var letter = sorted[letterIndex];
                if (letter != ".") {
                    metrics.hydrophobicity += (data["positions"][positionIndex][letter] * SequenceLogo.variables[[SequenceLogo.variables.type]][letter].hydropathy);
                    metrics.charge += (data["positions"][positionIndex][letter] * SequenceLogo.variables[[SequenceLogo.variables.type]][letter].charge);
                    values.push(data["positions"][positionIndex][letter]);
                }

                ofTotal += data["positions"][positionIndex][letter];
                numberOfItemsBeforeThreshold++;
                // leave if we've hit the threshold
                if (ofTotal / data.metadata.sequences >= threshold) break;
            }

            metrics.hydropathy = metrics.hydrophobicity < 0 ? -1 : 1;
            metrics.charge_score = metrics.charge < 0 ? -1 : 1;
            metrics.variance = numberOfItemsBeforeThreshold;

            data["positions"][positionIndex]["metrics"] = metrics;
        }
    },

    calculateEntropy: function (letter, all_letters, totalSequences) {
        var e_n = 1 / Math.log(2) * (SequenceLogo.variables[SequenceLogo.variables.type].count - 1) / (2 * totalSequences);

        // correct
        var prob_letter = all_letters[letter] / totalSequences;

        var h_i = 0;
        for (var letters in all_letters) {
            if (letters != "metrics") {
                var prob_a = all_letters[letters] / totalSequences;
                h_i -= (prob_a * this.log2(prob_a));
            }
        }

        var r_i = this.log2(SequenceLogo.variables[SequenceLogo.variables.type].count) - (h_i + e_n);

        return prob_letter * r_i;
    },

    log2: function (val) {
        return Math.log(val) / Math.LN2;
    },
    getNumWithSetDec: function (num, decPlaces) {
        var pow10s = Math.pow(10, decPlaces || 0);
        return ( decPlaces ) ? Math.round(pow10s * num) / pow10s : num;
    }

}
