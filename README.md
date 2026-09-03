# Themed Bingo Generator

A reusable bingo card generator built in Java for generating customised bingo cards for university events.

The project was originally created for a university Freshers' Week bingo night, where attendees are shown images of celebrities, films, TV shows, landmarks, flags, or other themed options and mark the corresponding item on their bingo card.

The generator is designed to be reusable for future events: changing the category and source file is enough to generate a completely new set of cards.

---

## Why I Built This

The original goal was to create bingo cards for a university event without manually creating and randomising hundreds of cards.

A simple random shuffle is easy to implement, but it creates two problems:

* Some options can appear significantly more often than others across the cards.
* Two cards can accidentally be identical.

I wanted to solve both problems while keeping the cards genuinely random.

The generator therefore prioritises options that have appeared less frequently, while still allowing more frequently used options to be selected. It also tracks previously generated card arrangements so that exact duplicate cards are rejected.

The project also gave me an opportunity to practise Java concepts from my first year of Computer Science, particularly classes and objects, `ArrayList`, `HashMap`, `HashSet`, file handling, loops, methods, and randomisation.

---

## Features

* Generate any number of bingo cards
* Supports different bingo categories using separate `.txt` files
* 24 items per card, leaving the centre square available for a FREE space
* Balanced item distribution across all generated cards
* Under-used items receive a higher probability of being selected
* Prevents the same item appearing twice on a single card
* Prevents exact duplicate card arrangements
* Allows cards to contain the same 24 items as another card as long as their positions are different
* Exports cards to CSV
* Designed to be reusable for future events

---

## How the Randomisation Works

Rather than selecting every item with an equal probability, the generator keeps track of how many times each option has appeared.

For example:

| Option  | Appearances | Selection Priority |
| ------- | ----------: | -----------------: |
| Barbie  |          10 |               High |
| Shrek   |          10 |               High |
| Frozen  |          11 |             Medium |
| Titanic |          12 |                Low |
| Jaws    |          13 |             Lowest |

Items with fewer appearances receive a higher selection weight.

However, an item with a higher number of appearances is **not excluded**. It simply has a lower probability of being selected.

This means the cards remain random while the overall distribution converges towards an even number of appearances.

### Why not always select the least-used item?

Always selecting the least-used item would produce a predictable selection pattern and reduce the randomness of the cards.

The weighted approach instead gives under-used items **priority rather than a guarantee**.

---

## Duplicate Prevention

The generator distinguishes between an **exact duplicate** and two cards containing the same items.

For example, these cards are considered duplicates:

```text
Barbie | Shrek | Frozen | Titanic
Barbie | Shrek | Frozen | Titanic
```

But these are considered different:

```text
Barbie | Shrek | Frozen | Titanic
Frozen | Titanic | Barbie | Shrek
```

This is important for bingo because the position of an item determines which square the player needs to mark.

To achieve this, each completed card is converted into a unique signature based on the order of its items:

```text
Barbie|Shrek|Frozen|Titanic|...
```

These signatures are stored in a `HashSet`.

If the same signature is generated again, the card is rejected and another one is generated.

---

## Project Structure

```text
Freshers Bingo/
│
├── src/
│   ├── Main.java
│   ├── BingoCard.java
│   ├── BingoGenerator.java
│   └── CSVExporter.java
│
├── categories/
│   ├── filmTv.txt
│   ├── celebrity.txt
│   ├── flag.txt
│   └── humanBingo.txt
│
├── apps-script/
│   ├── generateCards.gs
│   └── generatePresentation.gs
│
└── output/
    └── humanBingo.csv
```

### `Main.java`

Handles the overall program flow.

It:

1. Selects the category
2. Reads the relevant `.txt` file
3. Creates the `BingoGenerator`
4. Generates the requested number of cards
5. Sends the cards to the CSV exporter

### `BingoCard.java`

Represents an individual bingo card and stores its 24 items.

### `BingoGenerator.java`

Contains the main generation logic, including:

* Random selection
* Usage tracking
* Weighted item selection
* Duplicate prevention
* Card shuffling

### `CSVExporter.java`

Converts the generated cards into a CSV file that can be imported into other tools.

### `generateCards.gs`

Takes the data of each card from a CSV file and inserts that data on a template for each card in Google Slides.

### `generatePresentation.gs`

Shuffles the list of items into a random order and creates a slide for each with a corresponding image.

---

# How to Use

## 1. Add your category

Create a `.txt` file inside the `categories` folder.

For example:

```text
categories/celebrity.txt
```

Put one option on each line:

```text
Taylor Swift
Harry Styles
Zendaya
Tom Holland
Ariana Grande
Dua Lipa
...
```

The generator can work with any category as long as each option is on its own line.

---

## 2. Choose the category

In `Main.java`, change:

```java
public static String cardType = "humanBingo";
```

For example:

```java
public static String cardType = "celebrity";
```

The program will then read:

```text
categories/celebrity.txt
```

and generate:

```text
output/celebrity.csv
```

---

## 3. Choose how many cards to generate

Change:

```java
int numberOfCards = 100;
```

to whatever number you need.

For example:

```java
int numberOfCards = 70;
```

---

## 4. Run the program

Run `Main.java`.

The generated cards will be saved inside the `output` folder.

The CSV will contain:

```text
Card, Square 1, Square 2, Square 3, ... Square 24
Card 1, ...
Card 2, ...
Card 3, ...
```

The centre FREE square is not included in the CSV because it is fixed on the bingo card template.

---

# Using the Generated Cards

The Java program handles the logic behind the bingo cards, but Google Sheets, Google Slides and Apps Script are used to turn the generated data into the final materials for the event.

There are two separate Google Apps Script tools:

1. **Bingo Card Generator** — takes the CSV data produced by Java and automatically creates a slide for every bingo card.
2. **Caller Presentation Generator** — takes the master list of options and automatically creates a presentation containing one randomly ordered option per slide, along with its corresponding image.

This means that once the initial templates have been set up, an entire bingo event can be regenerated with very little manual work.

---

### Step 1 — Generate the cards in Java

First, choose the category and number of cards in `Main.java`:

```java
public static String cardType = "humanBingo";

int numberOfCards = 100;
```

Run the Main.java.

This creates a CSV in the `output` folder containing one row for each bingo card.

---

### Step 2 — Import the CSV into Google Sheets

Create a Google Sheet and import the generated CSV.

Each row represents one bingo card, while each column contains one square:

```text
Card | Square 1 | Square 2 | Square 3 | ... | Square 24
Card 1 | ... | ... | ... | ... | ...
Card 2 | ... | ... | ... | ... | ...
Card 3 | ... | ... | ... | ... | ...
```

The centre FREE square is not included because it is already part of the visual bingo card template.

---

### Step 3 — Set up the Google Slides template

Create a Google Slides presentation containing the design you want to use for the bingo cards.

The **first slide must be the template slide**.

The bingo grid should contain 24 editable text areas, one for each generated item.

Each area should contain the corresponding placeholder:

```text
{{Square 1}}
{{Square 2}}
{{Square 3}}
...
{{Square 24}}
```

The placeholders can be placed inside a Google Slides table, allowing the table itself to control the size and positioning of each bingo square.

For example:

| --------------: | --------------: | --------------: | --------------: | --------------: |
|{{Square1}}|{{Square2}}|{{Square3}}|{{Square4}}|{{Square5}}|
|{{Square6}}|{{Square7}}|{{Square8}}|{{Square9}}|{{Square10}}|
|{{Square11}}|{{Square12}}||{{Square13}}|{{Square14}}|
|{{Square15}}|{{Square16}}|{{Square17}}|{{Square18}}|{{Square19}}|
|{{Square20}}|{{Square21}}|{{Square22}}|{{Square23}}|{{Square24}}|

The exact visual design is completely customisable. The script only cares that the required placeholders exist.

---

### Step 4 — Add the Google IDs to the script

At the top of the Google Apps Script generateCards.gs, each category has its own configuration:

```javascript
const categories = {
  filmTv: {
    presentationId: "YOUR_PRESENTATION_ID",
    spreadsheetId: "YOUR_SPREADSHEET_ID"
  },

  celebrities: {
    presentationId: "YOUR_PRESENTATION_ID",
    spreadsheetId: "YOUR_SPREADSHEET_ID"
  }
};
```

You then choose the category:

```javascript
const category = "filmTv";
```

The script automatically uses the presentation and spreadsheet associated with that category.

#### Where do I find the IDs?

**Google Slides presentation ID**

Open the presentation and look at the URL:

```text
https://docs.google.com/presentation/d/1ABC123XYZ456/edit
```

The ID is the section between `/d/` and `/edit`:

```text
1ABC123XYZ456
```

**Google Sheets spreadsheet ID**

The same applies to Google Sheets:

```text
https://docs.google.com/spreadsheets/d/1ABC123XYZ456/edit
```

The ID is:

```text
1ABC123XYZ456
```

Copy these IDs into the category configuration in the Apps Script.

---

### Step 5 — Run the generator

Once the spreadsheet, template and script are configured, run the card generation function.

The script:

1. Opens the selected Google Sheet.
2. Reads each row of bingo data.
3. Uses the first slide as the template.
4. Duplicates the template for each row.
5. Replaces `{{Square 1}}` through `{{Square 24}}` with the corresponding values from the spreadsheet.
6. Produces one completed bingo card per slide.

For example:

```text
Google Sheet

Card 1 → Barbie, Shrek, Frozen, ...
Card 2 → Project Hail Mary, Jaws, Friends, ...
Card 3 → Titanic, Barbie, The Office, ...
       ↓
Google Apps Script
       ↓
Google Slides

Slide 1 → Template
Slide 2 → Card 1
Slide 3 → Card 2
Slide 4 → Card 3
...
```

This means that generating 100 cards requires **no manual copying and pasting**.

---

# 2. Generating the Caller Presentation

The second Google Apps Script, generatePresentation.gs creates the presentation used by the person running the bingo game.

Instead of showing the finished bingo cards, this presentation displays the options one at a time.

For example:

```text
Slide 1 → Template
Slide 2 → Barbie
Slide 3 → Shrek
Slide 4 → Frozen
Slide 5 → Titanic
...
```

The options are shuffled, so the order is different each time the presentation is generated.

The workflow is:

```text
Master list of options
        ↓
Google Apps Script
        ↓
Randomised option order
        ↓
Find corresponding image
        ↓
Google Slides
        ↓
Caller Presentation
```

---

## Step 1 — Create the master list

Go back to your `.txt` file containing all of the options, with one option per line.

For example:

```text
Barbie
Shrek
Frozen
The Office
Friends
Titanic
Jaws
Mamma Mia
```

The script reads this list and uses it as the source for the caller presentation.

---

## Step 2 — Prepare the image folder

Create a Google Drive folder containing an image for every option.

The filenames need to correspond to the option names according to the naming convention used by the script.

For example:

```text
Barbie      → barbie.png
The Office  → theoffice.png
Mamma Mia   → mammamia.png
```

The script uses the option name to find the corresponding image in the Drive folder.

Make sure every option has a matching image. If an image cannot be found, that option cannot be added correctly to the presentation. Image names should match the option exactly with no spaces or uppercase characters.

---

## Step 3 — Create the caller presentation template

Create a Google Slides presentation for the caller.

The **second slide should be the image template**.

This slide should contain a square box with the placeholder:

```text
{{Image}}
```

The placeholder tells the script where the image should be placed.

The rest of the slide can contain whatever visual design you want — backgrounds, borders, logos, titles, decorative elements, etc.

The script will preserve the template design while replacing the placeholder with the correct image.

---

## Step 4 — Keep the images the same aspect ratio

The images in the Drive folder should have the **same aspect ratio as the image area in the template**.

For example, if the template contains a square image area, use square images:

```text
Template: 1:1

Image:    1:1
```

This prevents images from being stretched or squashed when they are inserted into the presentation.

This is particularly important when using posters, photographs or other images with different original dimensions.

---

## Step 5 — Add the Google IDs

The caller presentation script uses three pieces of information for each category:

```javascript
const categories = {

  filmTv: {
    imageFolderId: "YOUR_IMAGE_FOLDER_ID",
    presentationId: "YOUR_PRESENTATION_ID",
    optionsFileId: "YOUR_OPTIONS_FILE_ID"
  },

  celebrities: {
    imageFolderId: "YOUR_IMAGE_FOLDER_ID",
    presentationId: "YOUR_PRESENTATION_ID",
    optionsFileId: "YOUR_OPTIONS_FILE_ID"
  }

};
```

### Image folder ID

Open the Google Drive folder containing the images.

The folder URL will look something like:

```text
https://drive.google.com/drive/folders/1ABC123XYZ456
```

The ID is:

```text
1ABC123XYZ456
```

### Presentation ID

The presentation ID is taken from the Google Slides URL in the same way as described above.

### Options file ID

Open the `.txt` file containing the list of options in Google Drive.

Its ID can be taken from the file URL.

These three IDs tell the script:

```text
Where are the images?
        ↓
Which presentation should I use?
        ↓
Where is the list of options?
```

---

## Step 6 — Run the generator

Once everything is configured, run the caller presentation generator.

The script:

1. Reads the master list of options.
2. Randomises their order.
3. Opens the selected Google Drive image folder.
4. Finds the corresponding image for each option.
5. Duplicates the template slide.
6. Replaces the `{{Image}}` placeholder with the correct image.
7. Creates a presentation containing every option in random order.

The result is a ready-to-use caller presentation. If an image cant be found, the execution log will tell you. Beware that this generator can take around 5-7 minutes to generate 100 slides.

---

# 🔄 Complete Event Workflow

Once everything has been set up, the complete process looks like this:

```text
                    ┌──────────────────┐
                    │ Category .txt    │
                    │ files             │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Java Generator   │
                    │                  │
                    │ • Balance items  │
                    │ • Randomise      │
                    │ • Prevent        │
                    │   duplicates     │
                    └────────┬─────────┘
                             │
                             ▼
                       CSV card data
                             │
                             ▼
                    ┌──────────────────┐
                    │ Google Sheets    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Apps Script      │
                    │ Card Generator   │
                    └────────┬─────────┘
                             │
                             ▼
                    Finished Bingo Cards


        ┌──────────────────┐
        │ Master option    │
        │ list             │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐       ┌──────────────────┐
        │ Google Drive     │       │ Image Folder     │
        │ Options file     │       │                  │
        └────────┬─────────┘       └────────┬─────────┘
                 │                          │
                 └──────────┬───────────────┘
                            ▼
                   ┌──────────────────┐
                   │ Apps Script      │
                   │ Caller Generator │
                   └────────┬─────────┘
                            │
                            ▼
                   Caller Presentation
```

The important separation is that **Java handles the logic**, while **Google handles the presentation and event-ready output**.

This makes the project reusable: a future event organiser can create a new category file, provide the relevant images and templates, change the category configuration, and regenerate the materials without having to manually build every bingo card or presentation.


---

# Design Decisions

### Why Java?

The project was deliberately built in Java to practise and reinforce concepts from my Computer Science degree.

It provides a useful practical application for concepts such as:

* Object-oriented programming
* Collections
* File I/O
* Hash maps
* Hash sets
* Encapsulation
* Methods and class responsibilities
* Randomisation

### Why separate the generator from the card?

`BingoCard` represents the data for a card, while `BingoGenerator` is responsible for creating cards.

This keeps the responsibilities of each class separate and makes the generator easier to modify or reuse.

### Why use `HashMap` for usage counts?

Each option needs to be associated with the number of times it has appeared.

For example:

```text
"Barbie" → 17
"Shrek" → 16
"Frozen" → 18
```

A `HashMap<String, Integer>` is well suited to this because it allows the program to quickly look up and update the usage count for each option.

### Why use `HashSet` for duplicate detection?

The generator only needs to know whether a particular card signature has already been generated.

A `HashSet` is designed for this type of membership check and prevents the same signature from being stored twice.

---

# Example

If 100 cards are generated using 100 possible options:

```text
100 cards × 24 spaces = 2,400 total appearances
```

The ideal average is:

```text
2,400 ÷ 100 = 24 appearances per option
```

The weighted selection system aims to keep the actual distribution close to this while maintaining randomness.

---

## Author

Built as a university society project and as a practical Java development project.

The generator was designed to solve a real event-planning problem while providing an opportunity to practise software design, data structures, randomisation, and file handling.
