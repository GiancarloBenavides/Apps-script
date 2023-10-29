/**
 * @see election_campaign folders.gs
 * Create multiple folders google drive
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
 * Appends a col data in the sheet.
 * @param sheet {Sheet}
 * @param column {number}
 * @param data {Array<string>}
 */
function _setDataColumn(sheet, column, data) {
    let range = sheet.getRange(2, column, data.length);
    let dataMatriz = data.map(item => [item]);
    range.setValues(dataMatriz);
}

/**
 * Create folders for places
 */
function createFolders() {
    const rowInit = 2;
    const colMunicipality = 2;
    const colId = 3;
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName("municipality");
    const zones = DriveApp.getFolderById("1O9DlbWsQY-rlUEj3jkAKJsa_keHtJa7N");
    const lastRowPlaces = _getLastRowData(sheet, colMunicipality);
    const namesRange = sheet.getRange(rowInit, colMunicipality, lastRowPlaces).getValues();
    let foldersId = [];
    let e14Id = [];
    let claimId = [];

    namesRange.forEach((item, index) => {
        zones.createFolder(item[0]);
        let folders = zones.getFoldersByName(item[0]);

        if (folders.hasNext()) {
            let placeId = folders.next().getId();
            let place = DriveApp.getFolderById(placeId);
            foldersId.push(placeId);

            place.createFolder("E14");
            let folderE14S = place.getFoldersByName("E14");
            if (folderE14S.hasNext())
                e14Id.push(folderE14S.next().getId());

            place.createFolder("Reclamo");
            let folderClaims = place.getFoldersByName("Reclamo");
            if (folderClaims.hasNext())
                claimId.push(folderClaims.next().getId());

        }
        // DEBUG //
        Logger.log(item[0]);
    });

    _setDataColumn(sheet, colId, foldersId);
    _setDataColumn(sheet, colId + 1, e14Id);
    _setDataColumn(sheet, colId + 2, claimId);
}

/**
 * Create sub-folders for places
 */
function createSubFolders() {
    const rowInit = 2;
    const colMunicipality = 2;
    const colE14Id = 4;
    const colClaimId = 5;
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName("municipality");
    const zones = DriveApp.getFolderById("1O9DlbWsQY-rlUEj3jkAKJsa_keHtJa7N");
    const lastRowPlaces = _getLastRowData(sheet, colMunicipality);
    const namesRange = sheet.getRange(rowInit, colMunicipality, lastRowPlaces).getValues();
}

/**
 * Get files and permissions
 */
function getPermissions() {
    let folder;
    // Zonas Folder
    const zone = DriveApp.getFolderById("1O9DlbWsQY-rlUEj3jkAKJsa_keHtJa7N");
    const folders = zone.getFoldersByName("Pasto");

    if (folders.hasNext())
        folder = folders.next().getId();

    // DEBUG //
    Logger.log(folder);
}