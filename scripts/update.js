const selectedWords = new Set();
const buttons = ["Best", "Middle", "Maybe", "Brands"];

const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get("link");
let data = JSON.parse(localStorage.getItem("Data"));
let customerData = data.clients.filter((customerData) =>
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

  buttons.forEach((button) => {
    const btn = document.createElement("button");
    btn.innerText = button;
    btn.addEventListener("click", () => buttonClick(keyword, button));
    listingAssortmentCell.appendChild(btn);
  });

  // add the row to the table
  table.appendChild(row);
});

function buttonClick(keyword, button) {
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
    localStorage.setItem("Data", JSON.stringify(data));
  }
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
