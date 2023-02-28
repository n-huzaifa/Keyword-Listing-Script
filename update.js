// Define a set to store selected words
const selectedWords = new Set();

// Define an array of buttons
const buttons = ["Best", "Middle", "Maybe", "Brands"];

// Parse the URL search params to get the link parameter
const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get("link");

// Retrieve data from localStorage
let data = JSON.parse(localStorage.getItem("Data"));

//get minusList from DOM
let minusList = document.getElementById("minus-words-list");

// Filter the customerData object from the retrieved data based on the link parameter
let customerData = data.clients.filter((customerData) =>
  customerData ? customerData.links == link : { error: "No link found" }
)[0];

// Destructure the customerData object to get the necessary properties
const {
  keywords,
  bestList,
  middleList,
  maybeList,
  brandsList,
  minusWordsList,
} = customerData;

function showMinusWords() {
  minusList.innerHTML = "";
  minusWordsList.forEach((minusWord) => {
    const listItem = document.createElement("li");
    const listItemText = document.createTextNode(minusWord);
    listItem.appendChild(listItemText);
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      const index = minusWordsList.indexOf(minusWord);
      if (index > -1) {
        minusWordsList.splice(index, 1);
        minusList.removeChild(listItem);
        customerData["minusWordsList"] = minusWordsList;
        updateLocalStorage();
      }
      location.reload();
    });
    listItem.appendChild(removeButton);
    minusList.appendChild(listItem);
  });
}
showMinusWords();
// Function to handle click events on keyword spans
const keywordClick = (keyword) => {
  // Get all the keyword span tags in the table
  const keywordTd = document.querySelectorAll(".keywordTd");

  // Loop through each keyword span tag
  keywordTd.forEach((Td) => {
    // Get all the spans in the keyword span tag
    const spans = Td.childNodes;

    // Split the keyword string into an array of words
    const words = keyword.split(" ");

    // Loop through each word in the keyword string
    words.forEach((splitedWord) => {
      // Loop through each span tag in the keyword span tag
      spans.forEach((span) => {
        // If the text content of the span tag matches the current word in the keyword string
        if (span.textContent == splitedWord) {
          let clickData = {};
          clickData.keyword = splitedWord;
          clickData.listName = "minusWordsList";
          // Toggle the isClicked property of the span tag and set its background color accordingly

          span.style.backgroundColor = "green";

          // Copy word to minus words list on span click
          copyKeywordsToList(clickData);
          deleteSimilarWordsFromLists(splitedWord);

          // Get the parent row of the keyword span tag
          const row = Td.parentElement;

          // Get the last cell in the row (i.e., Listing Assortment cell)
          const listingAssortmentCell = row.querySelector("td:last-child");

          // Get all the sorting buttons in the Listing Assortment cell
          const buttons =
            listingAssortmentCell.querySelectorAll(".sortingButtons");

          // Loop through each sorting button
          buttons.forEach((button) => {
            // Get the keyword(s) associated with the button
            let buttonWords = button.getAttribute("data-keyword");
            let buttonWordArray = buttonWords.split(" ");

            // Loop through each word in the button keyword(s)
            buttonWordArray.forEach((buttonWord) => {
              // If the current word in the button keyword(s) matches the current word in the clicked keyword string
              if (buttonWord == keyword) {
                // Toggle the hidden-button class of the button
                button.classList.add("hidden-button");
              }
            });
          });

          return;
        }
      });
    });
  });
  updateLocalStorage();
  showMinusWords();
};

// Get a reference to the table element
const table = document.getElementById("myTable");
// Loop through each keyword in the customerData object
keywords.forEach((keyword) => {
  // Create a new table row
  const row = document.createElement("tr");

  // Create the "Keywords" cell and add it to the row
  const keywordsCell = document.createElement("td");
  keywordsCell.classList.add("keywordTd");

  // Split the keyword string into an array of words
  const words = keyword.split(" ");

  let inMinusWords = false;
  // Loop through each word in the keyword string
  words.forEach((word) => {
    // Create a new span tag for the current word
    const wordSpan = document.createElement("span");
    wordSpan.textContent = word;
    wordSpan.classList.add("keywordSpan");

    // Check if the current word is in the minusWordsList
    if (minusWordsList.includes(word)) {
      inMinusWords = true;
      wordSpan.isClicked = true;
      wordSpan.style.backgroundColor = "green";
      wordSpan.removeEventListener("click", keywordClick);
    } else {
      wordSpan.isClicked = false;
      wordSpan.addEventListener("click", () => keywordClick(word));
    }

    keywordsCell.appendChild(wordSpan);
  });

  row.appendChild(keywordsCell);

  // create the "Listing Assortment" cell and add it to the row
  const listingAssortmentCell = document.createElement("td");
  row.appendChild(listingAssortmentCell);

  tableButtons(keyword, words, listingAssortmentCell);

  // Check each span if its text matches the word in minusWordsList
  if (inMinusWords) {
    const buttonsRow = row.lastChild;
    buttonsRow.childNodes.forEach((btn) => {
      btn.classList.add("hidden-button");
    });
  }

  // add the row to the table
  table.appendChild(row);
});

function tableButtons(keyword, words, listingAssortmentCell) {
  listingAssortmentCell.innerHTML = "";
  buttons.forEach((button) => {
    const btn = document.createElement("button");
    btn.innerText = button;
    btn.classList.add("sortingButtons");

    // Check each list for the button's keyword
    if (button === "Best") {
      bestList.includes(keyword) && btn.classList.add("boldButton");
    }
    if (button === "Middle") {
      middleList.includes(keyword) && btn.classList.add("boldButton");
    }
    if (button === "Maybe") {
      maybeList.includes(keyword) && btn.classList.add("boldButton");
    }
    if (button === "Brands") {
      brandsList.includes(keyword) && btn.classList.add("boldButton");
    }

    btn.dataset.keyword = words.join(" ");
    btn.addEventListener("click", () =>
      assortmentButtons(keyword, button, listingAssortmentCell)
    );
    listingAssortmentCell.appendChild(btn);
  });
}

function assortmentButtons(keyword, button) {
  location.reload();
  data = JSON.parse(localStorage.getItem("Data"));
  customerData = data.clients.filter((customerData) =>
    customerData ? customerData.links == link : { error: "No link found" }
  )[0];

  const buttonData = {};
  buttonData.keyword = keyword;

  switch (button) {
    case "Best":
      buttonData.listName = "bestList";
      copyKeywordsToList(buttonData);
      break;
    case "Middle":
      buttonData.listName = "middleList";
      copyKeywordsToList(buttonData);
      break;
    case "Maybe":
      buttonData.listName = "maybeList";
      copyKeywordsToList(buttonData);
      break;
    case "Brands":
      buttonData.listName = "brandsList";
      copyKeywordsToList(buttonData);
      break;

    default:
      console.log("Button info not correct");
      break;
  }
  updateLocalStorage();
}
//updates the data to the local storage
function updateLocalStorage() {
  // update localStorage with the updated data
  const index = data.clients.findIndex(
    (clientData) => clientData.links === link
  );
  if (index > -1) {
    data.clients[index] = customerData;
    localStorage.setItem("Data", JSON.stringify(data));
  }
}

function copyKeywordsToList({ listName, keyword }) {
  let list = customerData[listName];
  if (!list.includes(keyword)) {
    // only copy if keyword doesn't exist in list
    list.push(keyword);
  }
  // clear the other list arrays
  Object.keys(customerData).forEach((key) => {
    if (
      key !== "keywords" &&
      key !== "minusWordsList" &&
      key !== listName &&
      Array.isArray(customerData[key])
    ) {
      const index = customerData[key].indexOf(keyword);
      if (index > -1) {
        // only splice array when item is found
        customerData[key].splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  });
}

function deleteSimilarWordsFromLists(keyword) {
  const dataLists = ["bestList", "maybeList", "middleList", "brandsList"];
  dataLists.forEach((dataList) => {
    customerData[dataList] = customerData[dataList].filter((words) => {
      const wordsArray = words?.split(" ");
      return !wordsArray.includes(keyword);
    });
  });
  updateLocalStorage();
  showMinusWords();
}
