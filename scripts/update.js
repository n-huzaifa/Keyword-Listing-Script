const selectedWords = new Set();

const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get("link");
const data = JSON.parse(localStorage.getItem("Data"));
const customerData = data.clients.filter((customerData) =>
  customerData ? customerData.links == link : { error: "No link found" }
)[0];

console.log(customerData);
const {
  keywords,
  bestList,
  middleList,
  maybeList,
  brandsList,
  minusWordsList,
} = customerData;

splitString();

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
