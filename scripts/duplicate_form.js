/**
 * @see election_campaign drive.gs
 * Create multiple Google Forms from one template
 * @author GncDev <@GncDev>
 */

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
 * Duplicate a form in a specific folder
 * @param zone {number}
 * @param place {number}
 */
function duplicatePlaceForm(zone, place) {
    const duplicateName = "zona" + zone + "-puesto" + place;
    const destinationFolder = DriveApp.getFolderById("114SpP_kIoKqWORIWrmm8er3VtnS9Jg0J");
    const template = DriveApp.getFileById("1r4FM2T2oOrN2Pqyu4N312uBA24oB_7D_dNiW3hn744I");
    const copy = template.makeCopy(duplicateName, destinationFolder);
    const copyId = copy.getId();

    // DEBUG //
    // Logger.log(copy.getName());
    // Logger.log(copyId);
    return copyId;
}

/**
 * Customize a form
 * @param formId {string}
 * @param zone {number}
 * @param place {number}
 */
function customPlaceForm(formId, zone, place, title, maxStations) {
    const form = FormApp.openById(formId);
    const prefix = "Registra reclamaciones y formularios E14";
    const sufix = "\nFormulario para la Zona " + zone + " Puesto " + place;
    let stations = createStationsValues(maxStations);
    let items = form.getItems(FormApp.ItemType.LIST)

    items.forEach((item) => {
        if (item.getType() == 'LIST') {
            var choices = []
            var listItem = item.asListItem();
            stations.forEach((station) => {
                choices.push(listItem.createChoice(station))
            })
            listItem.setChoices(choices);
        }
    })

    form.setTitle(title);
    form.setDescription(prefix + sufix);

    // DEBUG //
    Logger.log(form.getTitle());
}

/**
 * Duplicate form and config controls for places
 * @param startRow {number}
 * @param endRow {number}
 */
function duplicateRange(startRow, endRow) {
    // Config data column
    const rowInit = Math.max(2, startRow);
    const colZones = 2;
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName('options');
    const last = Math.min(sheet.getLastRow(), endRow - startRow);
    const zonePlaces = sheet.getRange(rowInit, colZones, last, 4).getValues();

    zonePlaces.forEach((zonePlace) => {
        let id = duplicatePlaceForm(zonePlace[0], zonePlace[1]);
        customPlaceForm(id, zonePlace[0], zonePlace[1], zonePlace[2], zonePlace[3]);
    })
}

/**
 * Duplicate form for places
 */
function duplicateForms() {
    duplicateRange(8, 9)
}

/**
 * Get files and permissions
 */
function getPermissions() {
    // Zonas Folder
    const folder = DriveApp.getFolderById("114SpP_kIoKqWORIWrmm8er3VtnS9Jg0J");
    const nameFolder = folder.getName();

    // DEBUG //
    Logger.log(nameFolder);
}