/**
 * @see election_campaign clear.gs
 * Create multiple Google Forms from one template
 * @author GncDev <@GncDev>
 */

/**
 * Remove files from places folders 
 * @param folder {Folder}
 */
function _removeFiles(folder) {
    const files = folder.getFiles();

    while (files.hasNext()) {
        let file = files.next();
        file.setTrashed(true);
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
        _removeFiles(folder);
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
 * Remove response data
 */
function clearData() {
    const zonas = DriveApp.getFolderById("114SpP_kIoKqWORIWrmm8er3VtnS9Jg0J");
    const folders = zonas.getFolders();

    while (folders.hasNext()) {
        let folder = folders.next();
        _mapZoneFolder(folder.getId());
    }
}