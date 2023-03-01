const createListButton = document.getElementById("create-list");
const nameInput = document.getElementById("name");
const phrasesInput = document.getElementById("phrases");
const prompt = document.querySelector(".prompt");
const listsDiv = document.getElementById("lists");

createListButton.addEventListener("click", createList);

function createList() {
  const name = nameInput.value;
  const phrases = phrasesInput.value
    .split("\n")
    .filter((phrase) => phrase.trim() !== "");
  const links = generateLink(30); // unique link

  const list = {
    customer: name,
    links,
    keywords: phrases,
    bestList: [],
    middleList: [],
    maybeList: [],
    brandsList: [],
    minusWordsList: [],
  };

  // Add the new list to the local storage data
  let data = JSON.parse(localStorage.getItem("Data"));
  if (!data) {
    data = { clients: [] };
  }

  if (name !== "" || phrases !== "") {
    data.clients.push(list);
    localStorage.setItem("Data", JSON.stringify(data));

    // Display message to user
    prompt.textContent = "List created successfully!";
    prompt.classList.remove("hidden");
    setTimeout(() => {
      prompt.classList.add("hidden");
    }, 5000); // hide after 2 seconds

    window.location.replace("./update.html?link=" + links);

    // Clear the input fields
    nameInput.value = "";
    phrasesInput.value = "";
  }
}

function generateLink(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let link = "";
  for (let i = 0; i < length; i++) {
    link += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return link;
}
