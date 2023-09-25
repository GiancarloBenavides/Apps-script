/**
 * Customize the options of a google forms
 * @author GncDev <@GncDev>
 */

/**
 * Gets the index of the last row with data from a column
 * @param sheet {Sheet}
 * @param column {number}
 * @returns {number}
 */
function getLastRowData(sheet, column) {
    const maxRow = sheet.getMaxRows() - 1;
    const rangeEval = sheet.getRange(1, column, maxRow).getValues();
    for (i = maxRow; i > 0; i--) {
        if (rangeEval[i - 1][0]) {
            return i - 1;
        }
    }
}

/**
 * Gets the data stored in a column
 * @param sheet {Sheet}
 * @param column {number}
 * @param lastRow {number}
 * @returns {Array<string>}
 */
function getDataColumn(sheet, column, lastRow) {
    let dataMatriz = sheet.getRange(2, column, lastRow).getValues();
    return dataMatriz.map(item => item[0]);
}

/**
 * Appends a col data in the sheet.
 * @param sheet {Sheet}
 * @param column {number}
 * @param lastRow {number}
 * @returns {Array<string>}
 */
function setDataColumn(sheet, column, data) {
    let rangue = sheet.getRange(2, column, data.length);
    let dataMatriz = data.map(item => [item]);
    rangue.setValues(dataMatriz);
}

/**
 * Create y config form and controls
 */
function createForms() {
    const colUniquePlaces = 3;
    const colNamePlaces = 4;
    const colIds = 5;
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName('places');
    const lastRowPlaces = getLastRowData(sheet, colUniquePlaces);

    let codePlaces = getDataColumn(sheet, colUniquePlaces, lastRowPlaces);
    let namePlaces = getDataColumn(sheet, colNamePlaces, lastRowPlaces);
    let ids = [];

    /*  create form */
    codePlaces.forEach((code) => {
        let zona = code.split("P")[1];
        let place = code.split("P")[0].substring(1);
        let form = FormApp.create(code);

        // DEBUG //
        Logger.log(form.getId());
        
        // create controls
        form.setDescription('Registro de reclamaciones y formularios para la Zona ' + zona + "y el puesto " + place);
        form.setCollectEmail(true);
        form.setConfirmationMessage("Gracias por tu aporte, ahora si!! Pasto tendrá Alcalde")

        let option = form.addMultipleChoiceItem();
        option.setTitle("¿Qué documento desea agregar ?");
        option.setRequired(true);

        let pageR = form.addPageBreakItem();
        pageR.setTitle("Reclamaciones");
        pageR.setHelpText("Agregue copia de la reclamación escrita");

        let pageE14 = form.addPageBreakItem();
        pageE14.setTitle("Formulario E14");
        pageR.setHelpText("Agregue copia del Formulario E14");

        // set navigationItem
        let choiceA = option.createChoice("Formulario E14", pageE14);
        let choiceB = option.createChoice("Reclamaciones", pageR);
        option.setChoices([choiceA, choiceB]);
        ids.push(form.getId());
    });

    // save forms ids 
    setDataColumn(sheet, colIds, ids)
}