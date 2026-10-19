/**
 * @see wedd-invitation publicGet.gs
 * Create endpoint for sheet de Google Sheet
 * @author GncDev <@GncDev>
 */

/**
 * Create public get endpoint
 */
function doGet() {
  // 1. Apuntar específicamente a la pestaña llamada "get"
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("get");

  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ "error": "No se encontró la pestaña 'get'" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Obtener el rango específico de la columna A hasta la E
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) lastRow = 1; // Evita errores si la hoja está vacía

  var range = sheet.getRange("B1:I" + lastRow);
  var rows = range.getValues();
  var headers = rows[0]; // Las cabeceras: id, slug, formalName, adults, children
  var jsonArray = [];

  // Buscar el índice de la columna "id" de forma segura
  var idColIndex = headers.indexOf("id");
  if (idColIndex === -1) idColIndex = 0; // Por defecto asumimos la columna A (índice 0)


  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var idValue = row[idColIndex];

    // Si el id es nulo, indefinido, una cadena vacía o puros espacios, nos saltamos la fila
    if (idValue === null || idValue === undefined || idValue.toString().trim() === "") {
      continue;
    }

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    jsonArray.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify(jsonArray))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * Create public post endpoint
 * @param e {event}
 */
function doPost(e) {
  try {
    // 1. Apuntar específicamente a la pestaña llamada "post"
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("post");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ "success": false, "message": "No se encontró la pestaña 'post'" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Obtener y parsear el Payload enviado desde SvelteKit
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ "success": false, "message": "No se recibieron datos en la petición (Payload vacío)." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var payload = JSON.parse(e.postData.contents);

    // 3. Mapear de forma dinámica según las cabeceras de la hoja "post"
    // Esto te da la libertad de cambiar el orden de las columnas en tu Excel sin romper el script.
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var newRowValues = [];

    for (var i = 0; i < headers.length; i++) {
      var headerName = headers[i].toString().trim();
      
      // Si la propiedad existe en el objeto enviado, la ponemos en su columna correspondiente; si no, va vacía.
      if (payload.hasOwnProperty(headerName)) {
        newRowValues.push(payload[headerName]);
      } else {
        newRowValues.push(""); // Celda vacía por seguridad si no viene el dato
      }
    }

    // 4. Inyectar la nueva fila al final de la hoja
    sheet.appendRow(newRowValues);

    // 5. Retornar respuesta exitosa estructurada en formato JSON
    return ContentService.createTextOutput(JSON.stringify({ "success": true, "message": "Fila insertada correctamente en la hoja 'post'." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Manejo de excepciones en caso de JSON inválido o bloqueos internos de Google
    return ContentService.createTextOutput(JSON.stringify({ "success": false, "message": "Error interno en Apps Script: " + error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

