const tableBody = document.getElementById("table-body");
const buttons = ["Best", "Middle", "Maybe", "Brands", "Minus Words"];

const tableData = JSON.parse(localStorage.getItem("Data"));
if (tableData) {
  populateTable(tableData);
} else {
  console.log("Table is Empty");
}

function buttonClick(rowData, button) {
  const buttonData = {};
  buttonData.listName = button.toLowerCase();
  buttonData.customerName = rowData["customer"];

  switch (button) {
    case "Best":
      buttonData.keywords = rowData["bestList"];
      copyListToClipboard(buttonData);
      break;
    case "Middle":
      buttonData.keywords = rowData["middleList"];
      copyListToClipboard(buttonData);
      break;
    case "Maybe":
      buttonData.keywords = rowData["maybeList"];
      copyListToClipboard(buttonData);
      break;
    case "Brands":
      buttonData.keywords = rowData["brandsList"];
      copyListToClipboard(buttonData);
      break;
    case "Minus Words":
      buttonData.keywords = rowData["minusWordsList"];
      copyListToClipboard(buttonData);
      break;

    default:
      console.log("Button info not correct");
      break;
  }
}

const copyListToClipboard = ({ keywords, customerName, listName }) => {
  const text = keywords.join("\n");
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const prompt = document.querySelector(".prompt");
      prompt.textContent = `${keywords.length} ${listName} words from ${customerName} copied to clipboard`;
      prompt.classList.remove("hidden");
      setTimeout(() => {
        prompt.classList.add("hidden");
      }, 5000); // hide after 2 seconds
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
};

function populateTable(tableData) {
  tableData.clients.forEach((rowData) => {
    const row = document.createElement("tr");
    const customerCell = document.createElement("td");
    const linksCell = document.createElement("td");
    const copyingKeywordsCell = document.createElement("td");
    const linksCellLink = document.createElement("a");
    customerCell.textContent = rowData.customer;
    linksCellLink.textContent = "Modify Keywords Lists";
    linksCellLink.href = "./update.html?link=" + rowData.links;
    linksCell.appendChild(linksCellLink);

    buttons.forEach((button) => {
      const btn = document.createElement("button");
      btn.innerText = button;
      btn.addEventListener("click", () => buttonClick(rowData, button));
      copyingKeywordsCell.appendChild(btn);
    });

    row.appendChild(customerCell);
    row.appendChild(linksCell);
    row.appendChild(copyingKeywordsCell);
    tableBody.appendChild(row);
  });
}
