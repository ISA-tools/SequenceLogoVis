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

var positionProportions = {};

SequenceLogo.rendering = {

    createSequenceLogo: function (files, placement, width, height) {
        // data is an array...
        SequenceLogo.variables.placement = placement;
        SequenceLogo.variables.width = parseInt(width);
        SequenceLogo.variables.height = height;
        SequenceLogo.variables.canvas = new Raphael(placement, width, height);
        SequenceLogo.rendering.processSequenceFiles(files);
    },

    processSequenceFiles: function (files) {
        SequenceLogo.variables.plotHeight = SequenceLogo.variables.height / files.length;

        for (var fileIndex in files) {
            d3.csv(files[fileIndex], function (data) {
                var key = Object.keys(data[0])[0];
                positionProportions[key] = {"metadata": {"sequences": data.length}};
                for (var sequenceIndex in data) {
                    for (var positionIndex = 0; positionIndex < data[sequenceIndex][key].length; positionIndex++) {

                        if (!(positionIndex in positionProportions[key])) {
                            positionProportions[key][positionIndex] = {};
                        }

                        var letter = data[sequenceIndex][key][positionIndex];

                        if (!(letter in positionProportions[key][positionIndex])) {
                            positionProportions[key][positionIndex][letter] = 0;
                        }

                        positionProportions[key][positionIndex][letter]++;
                    }
                }
                SequenceLogo.statistics.processData(positionProportions[key]);
                SequenceLogo.rendering.drawSequenceLogo(positionProportions[key])

            });
        }
    },

    drawSequenceLogo: function (dataToDraw) {
        var widthPerPosition = SequenceLogo.variables.width / Object.keys(dataToDraw).length - 1;

        for (var positionIndex in dataToDraw) {
            if (positionIndex != "metadata") {
                var sorted = this.sortByValue(dataToDraw[positionIndex]);
                var maxBarHeight = (SequenceLogo.variables.plotHeight * .667);
                var scale = d3.scale.linear().domain([0, +dataToDraw.metadata.sequences]).range([0, maxBarHeight]);

                var yPos = 43 + SequenceLogo.variables.plotCount * SequenceLogo.variables.plotHeight;

                if (SequenceLogo.variables.plotCount == 0) {
                    // draw position number
                    SequenceLogo.variables.canvas.rect(+positionIndex * widthPerPosition, 50, widthPerPosition, SequenceLogo.variables.height).attr({"fill": positionIndex % 2 == 0 ? "#f1f2f1" : "#fff", "stroke": "#fff"}).toBack();
                    SequenceLogo.variables.canvas.text(positionIndex * widthPerPosition + 11, 8, +positionIndex + 1).attr(SequenceLogo.variables.positionTextStyle);
                }

                for (var barToDraw in sorted) {
                    var letter = sorted[barToDraw];

                    if (letter != ".") {
                        var value = dataToDraw[positionIndex][letter];
                        var barHeight = scale(value);
                        SequenceLogo.variables.canvas.rect(positionIndex * widthPerPosition + 2, yPos, widthPerPosition - 4, barHeight).attr({"fill": SequenceLogo.variables.amino_acids[letter].color, "stroke": "#fff"}).toFront();
                        if (barHeight / maxBarHeight > .35) {
                            SequenceLogo.variables.canvas.text(positionIndex * widthPerPosition + 9, yPos + 8, letter).attr(SequenceLogo.variables.barTextStyle);
                        }
                        yPos += barHeight;
                    }

                }
            }
        }
        SequenceLogo.variables.plotCount++;
    },

    sortByValue: function (dict) {
        var sortable = [];
        for (var letter in dict)
            sortable.push([letter, dict[letter]])
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

        for (var positionIndex in data) {
            var metrics = {"charge": 0, "hydrophobicity": 0, "deviation": 0}
            if (positionIndex != "metadata") {
                var values = [];
                for (var letter in data[positionIndex]) {
                    if (letter != ".") {
                        metrics.hydrophobicity += (data[positionIndex][letter]*SequenceLogo.variables.amino_acids[letter].hydropathy);
                        metrics.charge += SequenceLogo.variables.amino_acids[letter].charge;
                        values.push(data[positionIndex][letter]);
                    }
                }
                // TODO: Std deviation doesn't really work for this...
                var stddev = this.calculateStandardDeviation(values);
            }

            console.log("Metrics for "+ positionIndex + " is ");
            console.log(metrics);
        }
    },

    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    },

    getAverageFromNumArr: function (values) {
        if (!this.isArray(values)) {
            return false;
        }
        var i = values.length,
            sum = 0;
        while (i--) {
            sum += values[ i ];
        }
        return (sum / values.length);
    },

    getVariance: function (values, decPlaces) {
        if (!this.isArray(values)) {
            return false;
        }
        var avg = this.getAverageFromNumArr(values, decPlaces),
            i = values.length,
            v = 0;

        while (i--) {
            v += Math.pow((values[ i ] - avg), 2);
        }
        v /= values.length;
        return v;
    },

    calculateStandardDeviation: function (values, decPlaces) {
        if (!this.isArray(values)) {
            return false;
        }
        var stdDev = Math.sqrt(this.getVariance(values, decPlaces));
        return stdDev;
    }
}