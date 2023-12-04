looker.plugins.visualizations.add({
    options: {
        html_template: {
            type: "string",
            label: "HTML Template",
            default: `<div style="text-align: center; background-color: red; color: #5A2FC2; font-size: 5rem; font-weight: 700;">{{ value }}</div>`
        },
        conditionTxt: {
            type: "string",
            label: "Alert when below",
            placeholder: "x"
        }
    },

    create: function(element, config) {},

    updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
        this.clearErrors();

        const firstRow = data[0];
        const qFields = queryResponse.fields;

        if (qFields.dimension_like.length === 0 &&
            qFields.measure_like.length === 0) {
            this.addError({
                title: `No visible fields`,
                message: `At least one dimension, measure or table calculation needs to be visible.`
            })
        }

        const firstCell = firstRow[qFields.dimension_like.length > 0 ? qFields.dimension_like[0].name : qFields.measure_like[0].name];

        let htmlForCell = LookerCharts.Utils.filterableValueForCell(firstCell);
        const htmlTemplate = config && config.html_template || this.options.html_template.default;

        if (!isNaN(htmlForCell)) {
            htmlForCell = parseInt(htmlForCell);

        }

        const htmlFormatted = htmlTemplate.replace(/{{.*}}/g, htmlForCell);

        element.innerHTML = htmlFormatted;

        if (parseInt(config.conditionTxt) < htmlForCell) {
            htmlFormatted.style.backgroundColor = "red";
        } else {
            htmlFormatted.style.backgroundColor = "green";
        }


        doneRendering();
    }
});