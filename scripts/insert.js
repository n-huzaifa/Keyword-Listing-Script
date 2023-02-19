const createListButton = document.getElementById("create-list");
const nameInput = document.getElementById("name");
const phrasesInput = document.getElementById("phrases");
const messageDiv = document.getElementById("message");
const listsDiv = document.getElementById("lists");

createListButton.addEventListener("click", createList);

function createList() {
  const name = nameInput.value;
  const phrases = phrasesInput.value
    .split("\n")
    .filter((phrase) => phrase.trim() !== "");
  const listId = generateId(30);
  const list = { name, phrases };

  // Store the list in local storage
  localStorage.setItem(listId, JSON.stringify(list));

  // Display message to user
  messageDiv.textContent = "List created successfully!";

  // Clear the input fields
  nameInput.value = "";
  phrasesInput.value = "";

  // Show the list on the page
  showLists();
}

function generateId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

function showLists() {
  listsDiv.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const list = JSON.parse(localStorage.getItem(key));
    const name = list.name;
    const phrases = list.phrases;
    const listDiv = document.createElement("div");
    listDiv.innerHTML = `<h3>${name}</h3><p>${phrases.join(", ")}</p>`;
    listsDiv.appendChild(listDiv);
  }
}

// Show the lists when the page loads
showLists();
