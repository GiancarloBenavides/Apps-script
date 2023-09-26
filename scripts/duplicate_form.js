/**
 * @see election_campaign drive.gs
 * Create multiple Google Forms from one template
 * @author GncDev <@GncDev>
 */

/**
 * get files and permissions
 * @param zone {number}
 * @param place {number}
 * 
 */
function duplicateForm(zone, place) {
    const name = "zona" + zone + "-puesto" + place;
    const folderZone = DriveApp.getFolderById("114SpP_kIoKqWORIWrmm8er3VtnS9Jg0J");
    const template = DriveApp.getFileById("1r4FM2T2oOrN2Pqyu4N312uBA24oB_7D_dNiW3hn744I");
    const copiedFile = template.makeCopy(name, folderZone);
    Logger.log(copiedFile.getName());
    Logger.log(copiedFile.getId());
}

/**
 * get files and permissions
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