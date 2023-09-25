/**
 * Customize the options of a google forms
 * @author GncDev <@GncDev>
 */

/**
 * Gets Forms
 * @returns {Form}
 */
function getForm() {
    const formID = '<FORM_ID>';
    let form = FormApp.openById(formID);
    return form;
}

/**
 * Gets Empty Forms
 * @returns {Form}
 */
function resetForm() {
    form = getForm();
    let questions = form.getItems();
    questions.forEach((question) => {
        form.deleteItem(question)
    });
    return form;
}

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
 * Gets data stored in a sheet 
 * @returns {Array<Array<number>, Array<number>, Map<string, Array<number>>, Map<number, Array<string>>, Map<number, number>>} (options)
 */
function getSheetData() {
    // Config data column
    const rowInit = 2;
    const colZones = 2;
    const colStations = 5;
    const colCodePlaces = 6;
    const colNamePlaces = 7;
    const colUniqueZones = 8;

    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName('options');
    const lastRowZones = getLastRowData(sheet, colUniqueZones);
    const lastRowStations = getLastRowData(sheet, colNamePlaces);

    const zonesRange = sheet.getRange(rowInit, colZones, lastRowStations).getValues();
    const stationsRange = sheet.getRange(rowInit, colStations, lastRowStations).getValues();
    const codesRange = sheet.getRange(rowInit, colCodePlaces, lastRowStations).getValues();
    const namesRange = sheet.getRange(rowInit, colNamePlaces, lastRowStations).getValues();

    let zones = getDataColumn(sheet, colUniqueZones, lastRowZones);
    let codes = getDataColumn(sheet, colCodePlaces, lastRowStations);

    //let names = getRowsForCriteria(namesRange, zonesRange, 1);
    //let stations = getRowsForCriteria(stationsRange, codesRange, 101);

    // Mapping of voting places name by zone
    /*let namesForZone = new Map();
    zones.forEach((zone) => {
        namesForZone.set(zone, getRowsForCriteria(namesRange, zonesRange, zone));
    });*/

    // Mapping of voting places code by zone
    let codesForZone = new Map();
    zones.forEach((zone) => {
        codesForZone.set(zone, getRowsForCriteria(codesRange, zonesRange, zone));
    });

    // mapping of number  of stations by voting places
    // mapping of place codes by zone
    let stationsForCode = new Map();
    let namesForCode = new Map();
    codes.forEach((code) => {
        stationsForCode.set(code, getRowsForCriteria(stationsRange, codesRange, code));
        namesForCode.set(code, getRowsForCriteria(namesRange, codesRange, code));
    });

    return [zones, codes, codesForZone, namesForCode, stationsForCode];
}

/**
 * Create options (station number) for place
 * @param maxStation {number}
 * @returns {Array<string>}
 */
function createStationsValues(maxStation) {
    let values = [];
    for (i = 0; i < maxStation; i++) {
        values.push("Mesa ".concat(i + 1));
    }
    return values;
}


/**
 * Create y config form controls
 */
function setDropList() {
    const form = resetForm();
    const [zones, codes, codesForZone, namesForCode, stationsForCode] = getSheetData();

    // ZONE  - SECTION
    let listZone = form.addListItem();
    listZone.setTitle("Zona de votación (Elige una opción)");
    let pagesZone = new Map();
    let pagesPlace = new Map();
    let zonesChoices = [];

    zones.forEach((zone) => {
        let placesChoices = [];
        let titleZona = "Zona ".concat(zone);

        // PLACE  - SECTION
        pagesZone.set(zone, form.addPageBreakItem());
        pagesZone.get(zone).setTitle(titleZona);

        let newDropList = form.addListItem();
        newDropList.setTitle("Puesto de votación (Elige una opción)");

        codesForZone.get(zone).forEach((codePlace) => {
            let namePlace = namesForCode.get(codePlace);
            let optionPlace = "[" + codePlace + "] - ".concat(namePlace);
            let titlePlace = "Puesto ".concat(codePlace);
            let stations = createStationsValues(stationsForCode.get(codePlace));

            // DEBUG //
            Logger.log(codePlace);
            Logger.log(namePlace);
            Logger.log(stations);

            // STATION  - SECTION
            pagesPlace.set(codePlace, form.addPageBreakItem());
            pagesPlace.get(codePlace).setTitle(titlePlace);
            pagesPlace.get(codePlace).setHelpText(namePlace)

            let newCheckbox = form.addCheckboxItem();
            newCheckbox.setTitle("Mesa de votación (Elige una opción)");
            newCheckbox.setChoiceValues(stations);

            // set navigationItem for stations
            pagesPlace.get(codePlace).setGoToPage(FormApp.PageNavigationType.SUBMIT);

            // set options and navigationItem for places
            placesChoices.push(newDropList.createChoice(optionPlace, pagesPlace.get(codePlace)));

        });

        // set options and navigationItem for zones
        newDropList.setChoices(placesChoices);
        zonesChoices.push(listZone.createChoice(titleZona, pagesZone.get(zone)));
    });

    // set options for zones
    listZone.setChoices(zonesChoices);
}
