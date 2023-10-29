/**
 * @see template_file Código.gs
 * Customize a Google Form Response
 * @author GncDev <@GncDev>
 */

/**
 * Gets the index of the last row with data from a column
 * @param sheet {Sheet}
 * @param column {number}
 * @returns {number}
 */
function _getLastRowData(sheet, column) {
    const maxRow = sheet.getMaxRows() - 1;
    const rangeEval = sheet.getRange(1, column, maxRow).getValues();
    for (i = maxRow; i > 0; i--) {
        if (rangeEval[i - 1][0]) {
            return i - 1;
        }
    }
}

/**
 * Get name active form
 * @returns {string}
 */
function _getNameActiveForm() {
    let form = FormApp.getActiveForm();
    let name = DriveApp.getFileById(form.getId()).getName();
    return name;
}

/**
 * Rename file with prefix, conserve user
 * @param fileId {string}
 * @param prefix {string}
 * @returns {Array<string>}
 */
function _renameFile(fileId, prefix) {
    const file = DriveApp.getFileById(fileId);
    const name = file.getName();
    const sufix = name.split(" - ")[1].toLowerCase().replaceAll(" ", "-");
    const newName = prefix + sufix;
    const url = file.getUrl();
    const user = sufix.split(".")[0];

    // need permissions
    file.setName(newName);
    return [user, url];
}

/**
 * Save response to google sheets
 * @param sheetName {string}
 * @param data {Array<number, string>}
 */
function _saveResponse(campaign, sheetName, data) {
    const date = new Date().toLocaleString();
    const sheetIdA = "1IG_yyhJDYlotM0HxgOh4F5Gt1xIG6EN34jcThD_k4Zo";
    const sheetIdG = "1rrrmW2csb1wgkspllUpRtCzebrEYxr3gv7ZATGv12rc";
    const sheetId = campaign === "a" ? sheetIdA : sheetIdG;
    const book = SpreadsheetApp.openById(sheetId);
    const sheet = book.getSheetByName(sheetName);
    let id = sheet.getRange(sheet.getLastRow(), 1).getValue() + 1;
    sheet.appendRow([id, ...data, date]);
}

/**
 * get Folder ID for municipality
 * @param municipality {string}
 */
function _getFolderId(municipality, type) {
    const rowInit = 2;
    const colMunicipality = 2;
    const book = SpreadsheetApp.openById("1tr1jJOZhJmr610Uyvc2t2JCOoOY_YBy0nJ_I933Pdiw");
    const sheet = book.getSheetByName('municipality');
    const lastRowPlaces = _getLastRowData(sheet, colMunicipality);
    const codes = sheet.getRange(rowInit, 1, lastRowPlaces).getValues();
    const municipalities = sheet.getRange(rowInit, colMunicipality, lastRowPlaces).getValues();
    const e14ids = sheet.getRange(rowInit, colMunicipality + 2, lastRowPlaces).getValues();
    const reclamoids = sheet.getRange(rowInit, colMunicipality + 3, lastRowPlaces).getValues();
    const index = municipalities.map((item) => item[0]).indexOf(municipality);
    const code = codes[index][0];
    let id;

    if (type === "e14") {
        id = e14ids[index][0];
    } else {
        id = reclamoids[index][0];
    }

    // DEBUG //
    //Logger.log(id)

    return [code, id];
}


/**
 * Automatic update of files and response data
 * @param e {Event}
 */
function updateResponse(e) {
    const response = e.response;
    const items = response.getItemResponses();
    const campaign = items[0].getResponse() === "Alcaldía" ? "a" : "g";
    let municipality, zone, place, type, station, fileId;

    // DEBUG //
    items.forEach(item => {
        Logger.log(item.getResponse());
    })

    if (campaign === "a") {
        municipality = "Pasto";
        zone = items[1].getResponse();
        place = items[2].getResponse();
        type = items[3].getResponse() === "Un formulario E14" ? "e14" : "reclamo";
        station = items[4].getResponse();
        fileId = items[5].getResponse()[0];
    } else {
        municipality = items[1].getResponse();
        zone = items[2].getResponse();
        place = items[3].getResponse();
        type = items[4].getResponse() === "Un formulario E14" ? "e14" : "reclamo";
        station = items[5].getResponse();
        fileId = items[6].getResponse()[0];
    }

    let afixCode = 10000 * zone + 100 * place + 1 * station
    let name = municipality.toLowerCase() + "-zona" + zone + "-puesto" + place;
    let criteria = "z" + zone + "p" + place + "m" + station;
    let affix = name + "-" + "mesa" + station + "-" + criteria + "-"
    let prefix = type + "-" + affix;

    let [prefixCode, folderId] = _getFolderId(municipality, type);
    let folder = DriveApp.getFolderById(folderId);
    let file = DriveApp.getFileById(fileId);
    file.moveTo(folder);

    let [user, url] = _renameFile(fileId, prefix);
    const code = 1000000 * Number(prefixCode) + afixCode;

    if (type === "e14") {

        // save votes in sheet
        _saveResponse(campaign, "votes", [municipality, code, zone, place, station, url, user]);

    } else {
        // save claims in sheet
        _saveResponse(campaign, "claims", [municipality, code, zone, place, station, url, user]);
    }

    // DEBUG //
    items.forEach(item => {
        Logger.log(item.getResponse());
    })
}

/**
 * Get files and permissions
 */
function getPermissions() {
    const file = DriveApp.getFileById("1O9DlbWsQY-rlUEj3jkAKJsa_keHtJa7N");
    const book = SpreadsheetApp.openById("1rrrmW2csb1wgkspllUpRtCzebrEYxr3gv7ZATGv12rc");
    const nameFile = file.getName();
    const nameBook = book.getName();

    // DEBUG //
    Logger.log(nameFile);
    Logger.log(nameBook);
}