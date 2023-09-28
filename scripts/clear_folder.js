/**
 * @see election_campaign drive.gs
 * Create multiple Google Forms from one template
 * @author GncDev <@GncDev>
 */

/**
 * Remove files from places folders 
 * @param folderId {string}
 */
function removeFiles(folderId) {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles()
    while (files.hasNext()) {
        let file = files.next();
        file.setTrashed(true)
    }
}

/**
 * Get places folders
 * @param folderId {string}
 */
function mapPlacesFolder(folderId) {
    const place = DriveApp.getFolderById(folderId);
    const folders = place.getFolders()
    while (folders.hasNext()) {
        let folder = folders.next();
        removeFiles(folder)
    }
}

/**
 * Get Zone folders
 * @param folderId {string}
 */
function mapZoneFolder(folderId) {
    const zona = DriveApp.getFolderById(folderId);
    const folders = zona.getFolders();

    while (folders.hasNext()) {
        let folder = folders.next();
        mapPlacesFolder(folder.getId());
    }
}

/**
 * Remove response data
 */
function clearData() {
    const zonas = DriveApp.getFolderById("114SpP_kIoKqWORIWrmm8er3VtnS9Jg0J");
    const folders = zonas.getFolders()

    while (folders.hasNext()) {
        let folder = folders.next();
        mapZoneFolder(folder.getId());
    }
}