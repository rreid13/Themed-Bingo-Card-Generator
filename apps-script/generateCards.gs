// ============================================
// CHOOSE CATEGORY
// ============================================
const category = "filmTv";


// ============================================
// CATEGORY SETTINGS
// ============================================
const categories = {
  filmTv: {
    presentationId: "YOUR_FILM_TV_PRESENTATION_ID",
    spreadsheetId: "YOUR_FILM_TV_SPREADSHEET_ID"
  },

  humanBingo: {
    presentationId: "YOUR_HUMAN_BINGO_PRESENTATION_ID",
    spreadsheetId: "YOUR_HUMAN_BINGO_SPREADSHEET_ID"
  },

  celebrities: {
    presentationId: "YOUR_CELEBRITIES_PRESENTATION_ID",
    spreadsheetId: "YOUR_CELEBRITIES_SPREADSHEET_ID"
  }

};


// ============================================
// SELECT SETTINGS FOR CATEGORY
// ============================================

const settings = categories[category];


// Check that the category exists

if (!settings) {

  throw new Error("Invalid category: " + category);

}


// ============================================
// ASSIGN IDs
// ============================================

const PRES_ID = settings.presentationId;

const SHEETS_ID = settings.spreadsheetId;


// ============================================
// GENERATE BINGO CARDS
// ============================================

function generateCards() {

  const presentation = SlidesApp.openById(PRES_ID);

  const spreadsheet = SpreadsheetApp.openById(SHEETS_ID);

  const sheet = spreadsheet.getSheets()[0];

  const data = sheet.getDataRange().getValues();


  // First slide is the template

  const template = presentation.getSlides()[0];


  // Start at row 1 because row 0 contains the headers

  for (let i = 1; i < data.length; i++) {

    const row = data[i];


    // Duplicate the template

    const newSlide = template.duplicate();


    // Replace the 24 bingo squares

    for (let j = 1; j <= 24; j++) {

      const placeholder = "{{Square" + j + "}}";

      const movie = row[j];


      newSlide.replaceAllText(
        placeholder,
        movie.toString()
      );

    }

  }

}