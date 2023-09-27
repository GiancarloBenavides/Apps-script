/**
 * @see template_file Código.gs
 * Customize a Google Form Response
 * @author GncDev <@GncDev>
 */

/**
 * Get name active form
 * @returns {string}
 */
function getNameActiveForm() {
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
function renameFile(fileId, prefix) {
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
 * Save response to google sheets <SHEET_ID>
 * @param sheetName {string}
 * @param data {Array<number, string>}
 */
function saveResponse(sheetName, data) {
    let date = new Date().toLocaleString();
    const book = SpreadsheetApp.openById("<SHEET_ID>");
    const sheet = book.getSheetByName(sheetName);
    let id = sheet.getRange(sheet.getLastRow(), 1).getValue() + 1;
    sheet.appendRow([id, ...data, date]);
}

/**
 * Automatic update of files and response data
 * @param e {Event}
 */
function updateResponse(e) {
    const name = getNameActiveForm();
    const zone = name.split("-")[0].substring(4);
    const place = name.split("-")[1].substring(6);
    const response = e.response;
    const items = response.getItemResponses();
    const station = items[1].getResponse().split(" ")[1];
    const fileId = items[2].getResponse()[0];

    // include data from form E-14
    const option = items[0].getResponse();
    if (option == "Un formulario E14") {
        let type = "e14";
        let prefix = type + "-" + name + "-" + "mesa" + station + "-";
        let [user, url] = renameFile(fileId, prefix);
        let votesN = items[3].getResponse();
        let votesM = items[4].getResponse();
        let votesT = items[5].getResponse();

        // save votes in sheet
        saveResponse("votes", [zone, place, station, votesN, votesM, votesT, url, user]);
    } else {
        let type = "reclamo";
        let prefix = type + "-" + name + "-" + "mesa" + station + "-";
        let [user, url] = renameFile(fileId, prefix);

        // save claims in sheet
        saveResponse("claim", [zone, place, station, url, user]);
    }

    // DEBUG //
    Logger.log(newName);
    items.forEach(item => {
        Logger.log(item.getResponse());
    })
}

/**
 * Get files and permissions <FILE_ID> <SHEET_ID>
 */
function getPermissions() {
    const file = DriveApp.getFileById("<FILE_ID>");
    const book = SpreadsheetApp.openById("<SHEET_ID>");
    const nameFile = file.getName();
    const nameBook = book.getName();

    // DEBUG //
    Logger.log(nameFile);
    Logger.log(nameBook);
}