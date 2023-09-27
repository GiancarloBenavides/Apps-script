
/*
newDropList.setChoiceValues(namesForZone.get(zone));
section.setGoToPage(FormApp.PageNavigationType.SUBMIT);
section.setTitle("Mesas ");
let choiceOfStation = [];
for (i = 0; i < zones.length - 1; i++) {
    let sectionForm = form.addPageBreakItem();
    sectionForm.setTitle("Zona ".concat(zones[i]));
    choice = form.createListItem()
    choice = form.addListItem();
    choice.setTitle("Puesto de votación (Elige una opción)");
    choice.setChoiceValues(stationForZone[i]);
}
*/

function setDropListForm() {
    let form = resetForm();
    const [zones, codes, namesForZone, stationsForPlace] = getSheetData();
    let listZone = form.addMultipleChoiceItem();
    listZone.setTitle("Zona de votación (Elige una opción)");
    codes.forEach((code) => {
        let title = "Puesto ".concat(code);
        let section = form.addPageBreakItem();
        section.setTitle(title);
        let newDropList = form.addListItem();
        newDropList.setTitle("Puesto de votación (Elige una opción)");
        newDropList.setChoiceValues(namesForZone.get(zone));
        Logger.log(listZone)
        listZone.createChoice(title, newSection);
    });
}

function setZoneForm() {
    const GOOGLE_SHEET_NAME = 'zonas';
    const GOOGLE_FORM_ID = '1NS5f9Kq4xmD4IVcoaAJHqIuhSKN8-pSete1EXm0nWCM';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const [header, ...data] = ss.getSheetByName(GOOGLE_SHEET_NAME).getDataRange().getDisplayValues();
    const choices = {};
    header.forEach((title, i) => {
        choices[title] = data.map((d) => d[i]).filter((e) => e);
    });
    FormApp.openById(GOOGLE_FORM_ID)
        .getItems()
        .map((item) => ({
            item,
            values: choices[item.getTitle()],
        }))
        .filter(({ values }) => values)
        .forEach(({ item, values }) => {
            switch (item.getType()) {
                case FormApp.ItemType.CHECKBOX:
                    item.asCheckboxItem().setChoiceValues(values);
                    break;
                case FormApp.ItemType.LIST:
                    item.asListItem().setChoiceValues(values);
                    break;
                case FormApp.ItemType.MULTIPLE_CHOICE:
                    item.asMultipleChoiceItem().setChoiceValues(values);
                    break;
                default:
                // ignore item
            }
        });
    ss.toast('Google Form Updated !!');
}