/**
 * @see election_campaign places.gs
 * Create multiple Google Forms from one Google Sheet
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
    let range = sheet.getRange(2, column, data.length);
    let dataMatriz = data.map(item => [item]);
    range.setValues(dataMatriz);
}

/**
 * Filter data for criteria
 * @param sheet {Sheet}
 * @param column {number}
 * @param lastRow {number}
 * @returns {Array<string>}
 */
function getRowsForCriteria(data, criteriaRange, criteria) {
    let dataList = [];
    for (i = 0; i < criteriaRange.length; i++) {
        if (criteriaRange[i][0] == criteria) {
            dataList.push(data[i][0]);
        }
    }
    return dataList;
}

/**
 * Create template form and config controls
 * @param code {string} (ZxxPxx)
 * @returns {string}
 */
function createPlaceForm(code, name) {
    let place = code.split("P")[1];
    let zona = code.split("P")[0].substring(1);
    let form = FormApp.create(code);
    let id = form.getId();
    let description = "Registro de reclamaciones y formularios E14 para la Zona ";
    let nameUpper = "\n" + name.toUpperCase();

    // DEBUG //
    Logger.log(id);

    // create controls
    form.setDescription(description + zona + " y el puesto " + place + nameUpper);
    form.setCollectEmail(true);
    form.setConfirmationMessage("Gracias por tu aporte, ahora si!! Pasto tendrá Alcalde");

    let option = form.addMultipleChoiceItem();
    option.setTitle("¿Qué documento desea agregar ?");
    option.setRequired(true);

    let pageR = form.addPageBreakItem();
    pageR.setTitle("Reclamaciones");
    pageR.setHelpText("Agregue imagen de la reclamación escrita");

    let pageE14 = form.addPageBreakItem();
    pageE14.setTitle("Formulario E14");
    pageR.setHelpText("Agregue imagen del Formulario E14");

    // set navigationItem
    let choiceA = option.createChoice("Formulario E14", pageE14);
    let choiceB = option.createChoice("Reclamaciones", pageR);
    option.setChoices([choiceA, choiceB]);

    return id;
}

/**
 * Create form and config controls for places
 * @param startRow {number}
 * @param endRow {number}
 */
function createRangeForms(startRow, endRow) {
    const rowInit = 2;
    const colCodePlaces = 1;
    const colNamePlaces = 2;
    const colFormIds = 4;
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName('places');
    const lastRowPlaces = getLastRowData(sheet, colCodePlaces);
    const namesRange = sheet.getRange(rowInit, colNamePlaces, lastRowPlaces).getValues();
    const codesRange = sheet.getRange(rowInit, colCodePlaces, lastRowPlaces).getValues();
    let ids = [];

    // mapping voting place names by code
    let codePlaces = getDataColumn(sheet, colCodePlaces, lastRowPlaces);
    let namesForCode = new Map();
    codePlaces.forEach((code) => {
        namesForCode.set(code, getRowsForCriteria(namesRange, codesRange, code));
    });

    // filter codes by forms to be updated
    let updateCodes = codePlaces.slice(startRow - 1, endRow - 1);

    /*  create forms */
    updateCodes.forEach((code) => {

        // DEBUG //
        Logger.log(code);
        Logger.log(namesForCode.get(code));

        let id = createPlaceForm(code, namesForCode.get(code)[0]);
        ids.push(id);
    });

    // save forms ids 
    setDataColumn(sheet, colFormIds, ids)
}

/**
 * Create form for places
 */
function createForms() {
    createRangeForms(1, 2)
}

/**
 * Get files and permissions
 */
function getPermissions() {
    // Zonas Folder
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const bookId = book.getId();

    // DEBUG //
    Logger.log(bookId);
}