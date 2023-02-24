// Define a set to store selected words
const selectedWords = new Set();

// Define an array of buttons
const buttons = ["Best", "Middle", "Maybe", "Brands"];

// Parse the URL search params to get the link parameter
const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get("link");

// Retrieve data from localStorage
let data = JSON.parse(localStorage.getItem("Data"));

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
          // Toggle the isClicked property of the span tag and set its background color accordingly
          span.isClicked = !span.isClicked;
          span.style.backgroundColor = span.isClicked ? "green" : "";

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
                button.classList.toggle("hidden-button");
              }
            });
          });

          return;
        }
      });
    });
  });
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

  // Loop through each word in the keyword string
  words.forEach((word) => {
    // Create a new span tag for the current word
    const wordSpan = document.createElement("span");
    wordSpan.textContent = word;
    wordSpan.classList.add("keywordSpan");
    // let isClicked = false;

    // add event listener for click to highlight all the keyword span tags with the same keyword and remove buttons
    wordSpan.addEventListener("click", () => keywordClick(word));

    keywordsCell.appendChild(wordSpan);
  });

  row.appendChild(keywordsCell);
  // create the "Listing Assortment" cell and add it to the row
  const listingAssortmentCell = document.createElement("td");
  row.appendChild(listingAssortmentCell);

  buttons.forEach((button) => {
    const btn = document.createElement("button");
    btn.innerText = button;
    btn.classList.add("sortingButtons");
    btn.dataset.keyword = words.join(" "); // set the data-keyword attribute to the button element

    btn.addEventListener("click", () => assortmentButtons(keyword, button));
    listingAssortmentCell.appendChild(btn);
  });

  // add the row to the table
  table.appendChild(row);
});

function assortmentButtons(keyword, button) {
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

  // update localStorage with the updated data
  const index = data.clients.findIndex(
    (clientData) => clientData.links === link
  );
  if (index > -1) {
    data.clients[index] = customerData;
    updateLocalStorage(data);
  }
}
//updates the data to the local storage
function updateLocalStorage(data) {
  localStorage.setItem("Data", JSON.stringify(data));
}

function copyKeywordsToList({ listName, keyword }) {
  let list = customerData[listName];
  list.push(keyword);
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

// function addToSelectedList() {
//   // Add the word to the selected words set
//   const word = this.textContent;
//   selectedWords.add(word);

//   // Clear the selected list and rebuild it from the set
//   const selectedList = document.getElementById("selectedList");
//   selectedList.innerHTML = "";
//   for (const word of selectedWords) {
//     const newListItem = document.createElement("li");
//     newListItem.textContent = word;
//     newListItem.addEventListener("click", removeFromSelectedList);
//     selectedList.appendChild(newListItem);
//   }

//   // Remove the event listener from the clicked span tag
//   this.removeEventListener("click", addToSelectedList);

//   // Highlight all span tags with the same word
//   const spans = document.getElementsByTagName("span");
//   for (let i = 0; i < spans.length; i++) {
//     if (spans[i].textContent === word) {
//       spans[i].classList.add("highlight");
//     }
//   }
// }

// function removeFromSelectedList() {
//   // Remove the word from the selected words set
//   const word = this.textContent;
//   selectedWords.delete(word);

//   // Remove the list item from the selected list
//   this.parentNode.removeChild(this);

//   // Activate the event listener on all span tags matching the removed word
//   const spans = document.getElementsByTagName("span");
//   for (let i = 0; i < spans.length; i++) {
//     if (spans[i].textContent === word) {
//       spans[i].addEventListener("click", addToSelectedList);
//       spans[i].classList.remove("highlight");
//     }
//   }
// }
