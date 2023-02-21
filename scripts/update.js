const selectedWords = new Set();

const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get("link");
const data = JSON.parse(localStorage.getItem("Data"));
const customerData = data.clients.filter((customerData) =>
  customerData ? customerData.links == link : { error: "No link found" }
)[0];

const {
  keywords,
  bestList,
  middleList,
  maybeList,
  brandsList,
  minusWordsList,
} = customerData;

// get a reference to the table
const table = document.getElementById("myTable");

// iterate through the keywords list and create a row for each keyword
keywords.forEach((keyword) => {
  // create a new table row
  const row = document.createElement("tr");

  // create the "Keywords" cell and add it to the row
  const keywordsCell = document.createElement("td");
  keywordsCell.textContent = keyword;
  row.appendChild(keywordsCell);

  // create the "Listing Assortment" cell and add it to the row
  const listingAssortmentCell = document.createElement("td");
  row.appendChild(listingAssortmentCell);

  // create the four buttons and add them to the "Listing Assortment" cell
  const bestButton = document.createElement("button");
  bestButton.textContent = "Best";
  listingAssortmentCell.appendChild(bestButton);

  const middleButton = document.createElement("button");
  middleButton.textContent = "Middle";
  listingAssortmentCell.appendChild(middleButton);

  const maybeButton = document.createElement("button");
  maybeButton.textContent = "Maybe";
  listingAssortmentCell.appendChild(maybeButton);

  const brandsButton = document.createElement("button");
  brandsButton.textContent = "Brands";
  listingAssortmentCell.appendChild(brandsButton);

  // add the row to the table
  table.appendChild(row);
});

function splitString() {
  // Create a new string with each word wrapped in a <span> tag
  const newString = keywords.map((word) => `<span>${word}</span>`).join(" ");

  // Populate the viewport with the new string
  document.getElementById("output").innerHTML = newString;

  // Add event listeners to each span tag
  const spans = document.getElementsByTagName("span");
  for (let i = 0; i < spans.length; i++) {
    spans[i].addEventListener("click", addToSelectedList);
  }
}

function addToSelectedList() {
  // Add the word to the selected words set
  const word = this.textContent;
  selectedWords.add(word);

  // Clear the selected list and rebuild it from the set
  const selectedList = document.getElementById("selectedList");
  selectedList.innerHTML = "";
  for (const word of selectedWords) {
    const newListItem = document.createElement("li");
    newListItem.textContent = word;
    newListItem.addEventListener("click", removeFromSelectedList);
    selectedList.appendChild(newListItem);
  }

  // Remove the event listener from the clicked span tag
  this.removeEventListener("click", addToSelectedList);

  // Highlight all span tags with the same word
  const spans = document.getElementsByTagName("span");
  for (let i = 0; i < spans.length; i++) {
    if (spans[i].textContent === word) {
      spans[i].classList.add("highlight");
    }
  }
}

function removeFromSelectedList() {
  // Remove the word from the selected words set
  const word = this.textContent;
  selectedWords.delete(word);

  // Remove the list item from the selected list
  this.parentNode.removeChild(this);

  // Activate the event listener on all span tags matching the removed word
  const spans = document.getElementsByTagName("span");
  for (let i = 0; i < spans.length; i++) {
    if (spans[i].textContent === word) {
      spans[i].addEventListener("click", addToSelectedList);
      spans[i].classList.remove("highlight");
    }
  }
}
