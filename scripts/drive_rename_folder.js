/**
 * @see election_campaign rename.gs
 * Rename multiple Google drive folder 
 * @author GncDev <@GncDev>
 */

/**
 * Rename folder from places folders response
 * @param folder {Folder}
 */
function _renameFolderResponses(folder) {
    let name = folder.getName();

    if (name.indexOf("E14") >= 0) {
        if (name !== "E14") {
            folder.setName("E14");
        }
    } else {
        if (name !== "Reclamos") {
            folder.setName("Reclamos");
        }
    }
}

/**
 * Get places folders
 * @param folderId {string}
 */
function _mapPlacesFolder(folderId) {
    const place = DriveApp.getFolderById(folderId);
    const folders = place.getFolders();

    while (folders.hasNext()) {
        let folder = folders.next();
        _renameFolderResponses(folder);
    }
}

/**
 * Get Zone folders
 * @param folderId {string}
 */
function _mapZoneFolder(folderId) {
    const zona = DriveApp.getFolderById(folderId);
    const folders = zona.getFolders();

    while (folders.hasNext()) {
        let folder = folders.next();

        // DEBUG //
        Logger.log(folder.getName());

        _mapPlacesFolder(folder.getId());
    }
}

/**
 * Rename Folder
 */
function renameFolder() {
    const zonas = DriveApp.getFolderById("114SpP_kIoKqWORIWrmm8er3VtnS9Jg0J");
    const folders = zonas.getFolders();

    while (folders.hasNext()) {
        let folder = folders.next();
        _mapZoneFolder(folder.getId());
    }
}