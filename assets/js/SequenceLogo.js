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
    stats : {},
    colorMap: {
        R: "#1FAABD", H: "#1FAABD", K: "#1FAABD",
        D: "#D75032", C: "#64AD59", S: "#64AD59", G: "#64AD59", Y: "#64AD59", T: "#64AD59", E: "#64AD59",
        P: "#4B3E4D", F: "#4B3E4D", V: "#4B3E4D", L: "#4B3E4D", I: "#4B3E4D", A: "#4B3E4D",
        N: "#92278F", Q: "#92278F"
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
                    SequenceLogo.variables.canvas.rect(+positionIndex * widthPerPosition, 50, widthPerPosition, SequenceLogo.variables.height).attr({"fill": positionIndex %2 == 0 ? "#f1f2f1" : "#fff", "stroke": "#fff"}).toBack();
                    SequenceLogo.variables.canvas.text(positionIndex * widthPerPosition + 11, 8, +positionIndex+1).attr(SequenceLogo.variables.positionTextStyle);
                }

                for (var barToDraw in sorted) {
                    var letter = sorted[barToDraw];

                    if (letter != ".") {
                        var value = dataToDraw[positionIndex][letter];
                        var barHeight = scale(value);
                        SequenceLogo.variables.canvas.rect(positionIndex * widthPerPosition + 2, yPos, widthPerPosition - 4, barHeight).attr({"fill": SequenceLogo.variables.colorMap[letter], "stroke": "#fff"}).toFront();
                        if (barHeight / maxBarHeight > .4) {
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
    processData: function(data) {
       // runs over the data and calculates diversity metrics, determining charge (+/-/n), hydrophobicity (%hphob, %hphil)
       // and variation measure (diversity at that position - probably Std Deviation).

        for (var positionIndex in data) {
            var metrics = {"charge":{"+ve":0, "-ve":0}, "hydrophobicity":{"hydrophobic":0, "hydrophilic":0}, "deviation":0}
            if (positionIndex != "metadata") {
                for (var barToDraw in data[positionIndex]) {

                }
            }
        }
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
        return this.getNumWithSetDec(v, decPlaces);
    },

    calculateStandardDeviation: function (values, decPlaces) {
        if (!this.isArray(values)) {
            return false;
        }
        var stdDev = Math.sqrt(this.getVariance(values, decPlaces));
        return stdDev;
    }
}