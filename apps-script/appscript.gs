function generateCards() {
  const presentation = SlidesApp.openById(slidesId)

  const spreadsheet = SpreadsheetApp.openById(sheetsId);
  const sheet = spreadsheet.getSheets()[0];

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    const template = presentation.getSlides()[0];
    const newSlide = template.duplicate();

    for (let j = 1; j <= 24; j++) {
      const placeholder = "{{Square" + j + "}}";
      const movie = row[j];

      newSlide.replaceAllText(placeholder, movie);
    }
  }


}
