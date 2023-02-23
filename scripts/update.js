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

const keywordClick = (word) => {
  const spans = document.querySelectorAll(".keywordSpan");

  spans.forEach((span) => {
    console.log(span.textContent.includes(word));
    if (span.textContent.includes(word)) {
      span.isClicked = !span.isClicked;
      span.style.backgroundColor = span.isClicked ? "green" : "";
      const row = span.parentElement.parentElement;
      const listingAssortmentCell = row.querySelector("td:last-child");
      const buttons = listingAssortmentCell.querySelectorAll(
        `button[data-keyword="${word}"]`
      );

      buttons.forEach((button) => {
        button.classList.toggle("hidden-button");
      });
    }
  });
};

// get a reference to the table
const table = document.getElementById("myTable");
keywords.forEach((keyword) => {
  // create a new table row
  const row = document.createElement("tr");

  // create the "Keywords" cell and add it to the row
  const keywordsCell = document.createElement("td");

  // split the keyword string into an array of words
  const words = keyword.split(" ");

  // create a span for each word in the keyword string
  words.forEach((word) => {
    const wordSpan = document.createElement("span");
    wordSpan.textContent = word;
    wordSpan.classList.add("keywordSpan");
    let isClicked = false;

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
    btn.dataset.keyword = keyword; // set the data-keyword attribute to the button element
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

function updateLocalStorage(data) {
  localStorage.setItem("Data", JSON.stringify(data));
}

function copyKeywordsToList({ listName, keyword }) {
  let list = customerData[listName];
  list.add(keyword);
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
