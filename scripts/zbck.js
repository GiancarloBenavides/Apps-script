function getNameForm() {
    let form = FormApp.getActiveForm();
    let name = DriveApp.getFileById(form.getId()).getName();
    return name;
}

function renameFile(fileId, prefix) {
    const file = DriveApp.getFileById(fileId);
    const name = file.getName();
    const user = name.split(" - ")[1].toLowerCase().replaceAll(" ", "-");
    const newName = prefix + user;

    file.setName(newName);

    return newName;
}

function renameFiles(e) {
    const zone = 1;
    const place = 1;
    const responseEnviado = e.response;
    const respuestas = responseEnviado.getItemResponses();
    let type = "reclamacion-";
    let votesN;
    let votesM;

    const option = respuestas[0].getResponse();
    if (option == "Un formulario E14") {
        type = "e14-";
        votesN = respuestas[3].getResponse();
        votesM = respuestas[4].getResponse();
    }

    const station = "mesa" + respuestas[1].getResponse().split(" ")[1];
    const fileId = respuestas[2].getResponse()[0];
    const prefix = getNameForm() + "-" + station + "-" + type;
    let newName = renameFile(fileId, prefix);

    respuestas.forEach(respuesta => {
        Logger.log(respuesta.getResponse());
    })

    Logger.log(newName);

}

function getFile() {
    const file = DriveApp.getFileById("1uBIOPllF5IBr8ato6zMuhZa2vu1-Rt4d");
    const name = file.getName();
    const user = name.split(" - ")[1].toLowerCase().replaceAll(" ", "-");
    Logger.log(user);
}
