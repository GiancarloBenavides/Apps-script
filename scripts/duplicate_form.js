/**
 * @see election_campaign drive.gs
 * Create multiple Google Forms from one template
 * @author GncDev <@GncDev>
 */

/**
 * duplicate a form in a specific folder
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
    Logger.log(copy.getName());
    Logger.log(copyId);
    return copyId;
}

/**
 * Create form and config controls for places
 * @param startRow {number}
 * @param endRow {number}
 */
function duplicateRange(startRow, endRow) {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName('places');

}

/**
 * Update form for places
 */
function duplicateForms() {
    duplicateRange(8, 11)
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