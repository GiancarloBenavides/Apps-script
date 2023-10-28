/**
 * @see template_file Código.gs
 * Customize a Google Form Response
 * @author GncDev <@GncDev>
 */

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
function _saveResponse(sheetName, data) {
    let date = new Date().toLocaleString();
    const book = SpreadsheetApp.openById("1rrrmW2csb1wgkspllUpRtCzebrEYxr3gv7ZATGv12rc");
    const sheet = book.getSheetByName(sheetName);
    let id = sheet.getRange(sheet.getLastRow(), 1).getValue() + 1;
    sheet.appendRow([id, ...data, date]);
}

/**
 * Automatic update of files and response data
 * @param e {Event}
 */
function updateResponse(e) {
    const response = e.response;
    const items = response.getItemResponses();
    const campaign = items[0].getResponse() === "Alcaldía" ? "a" : "g";
    const municipality = items[1].getResponse().toLowerCase();
    const zone = items[2].getResponse();
    const place = items[3].getResponse();
    const type = items[4].getResponse()=== "Un formulario E14" ? "e14" : "reclamo";
    const station = items[5].getResponse().split(" ")[1];
    const fileId = items[6].getResponse()[0];
    
    const name = municipality + "-zona" + zone + "-puesto" + place;
    const criteria = "z" + zone + "p" + place + "m" + station;
    const affix = name + "-" + "mesa" + station + "-" + criteria + "-"
    let prefix = type + "-" + affix;

    let [user, url] = _renameFile(fileId, prefix);
    
    if (type == "e14") {

      // save votes in sheet
        _saveResponse("votes", [municipality, zone, place, station, url, user]);

    } else {
        // save claims in sheet
        _saveResponse("claims", [municipality, zone, place, station, url, user]);
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