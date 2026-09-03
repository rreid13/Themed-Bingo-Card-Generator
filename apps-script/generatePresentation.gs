/// ============================================
// CHOOSE CATEGORY
// ============================================

const category = "filmTv";

// ============================================
// CATEGORY SETTINGS
// ============================================

const categories = {

  filmTv: {
    imageFolderId: "YOUR_FILM_TV_FOLDER_ID",
    presentationId: "YOUR_FILM_TV_PRESENTATION_ID",
    optionsFileId: "YOUR_FILM_TV_TXT_ID"
  },

  celebrities: {
    imageFolderId: "YOUR_CELEBRITIES_FOLDER_ID",
    presentationId: "YOUR_CELEBRITIES_PRESENTATION_ID",
    optionsFileId: "YOUR_CELEBRITIES_TXT_ID"
  }

};


// ============================================
// SELECT THE SETTINGS FOR THE CATEGORY
// ============================================

const settings = categories[category];


// Check that the category exists
if (!settings) {
  throw new Error("Invalid category: " + category);
}


// Assign the IDs
const IMAGE_FOLDER_ID = settings.imageFolderId;
const PRES_ID = settings.presentationId;
const OPTIONS_FILE_ID = settings.optionsFileId;

function generateOptionSlides() {

  const presentation = SlidesApp.openById(PRES_ID);

  // List of options/shows
  const options = getOptionsFromTxt();

  if (options.length === 0) {
    throw new Error("No options were found in the TXT file.");
  }

  // Shuffle the options
  shuffle(options);

  // Get the folder containing the images
  const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);

  // The first slide is our template
  const templateSlide = presentation.getSlides()[1];


  // Create one slide for every option
  for (let i = 0; i < options.length; i++) {

    const option = options[i];

    // Convert option name into image filename
    const filename = option
      .toLowerCase()
      .replace(/\s/g, "") + ".png";

    console.log("Looking for: " + filename);


    // Find the image
    const imageFile = findImage(folder, filename);


    // If the image doesn't exist, skip this option
    if (!imageFile) {

      console.log("IMAGE NOT FOUND: " + filename);

      continue;
    }


    // Make a copy of the template slide
    const newSlide = templateSlide.duplicate();

    newSlide.setSkipped(false);


    // Replace the {{IMAGE}} placeholder
    replacePoster(newSlide, imageFile.getBlob());


    console.log("Created slide for: " + option);
  }

  templateSlide.setSkipped(true);
}

function shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

function replacePoster(slide, imageBlob) {

  const elements = slide.getPageElements();


  for (let i = 0; i < elements.length; i++) {

    const element = elements[i];


    // We're looking for a shape
    if (element.getPageElementType() !== SlidesApp.PageElementType.SHAPE) {
      continue;
    }


    const shape = element.asShape();

    const text = shape.getText().asString();


    // Is this the {{IMAGE}} placeholder?
    if (text.includes("{{IMAGE}}")) {

      // Remember where the placeholder is
      const left = shape.getLeft();
      const top = shape.getTop();
      const width = shape.getWidth();
      const height = shape.getHeight();


      // Remove the placeholder
      shape.remove();


      // Insert the option poster in its place
      const newImage = slide.insertImage(
        imageBlob,
        left,
        top,
        width,
        height
      );

      newImage.sendToBack();


      // We've found and replaced it, so stop looking
      return;
    }
  }


  console.log("Could not find {{IMAGE}} placeholder");
}

function findImage(folder, filename) {

  const files = folder.getFilesByName(filename);

  if (files.hasNext()) {
    return files.next();
  }

  return null;
}

function getOptionsFromTxt() {

  const file = DriveApp.getFileById(OPTIONS_FILE_ID);

  console.log("================================");
  console.log("READING OPTIONS FILE");
  console.log("================================");

  console.log("File name: " + file.getName());
  console.log("File type: " + file.getMimeType());

  const text = file.getBlob().getDataAsString();

  console.log("Raw text:");
  console.log(text);

  const options = text
    .split(/\r?\n/)
    .map(option => option.trim())
    .filter(option => option.length > 0);

  console.log("Number of options found: " + options.length);

  options.forEach((option, index) => {
    console.log(index + ": " + option);
  });

  console.log("================================");

  return options;
}

