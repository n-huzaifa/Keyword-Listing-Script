const tableBody = document.getElementById("table-body");
const buttons = ["Best", "Middle", "Maybe", "Brands", "Minus Words"];

function buttonClick(rowData, button) {
  const buttonData = {};
  buttonData.listName = button.toLowerCase();

  switch (button) {
    case "Best":
      buttonData.keywords = rowData["bestList"];
      buttonData.customerName = rowData["customer"];
      copyListToClipboard(buttonData);
      break;
    case "Middle":
      buttonData.keywords = rowData["middleList"];
      buttonData.customerName = rowData["customer"];
      copyListToClipboard(buttonData);
      break;
    case "Maybe":
      buttonData.keywords = rowData["maybeList"];
      buttonData.customerName = rowData["customer"];
      copyListToClipboard(buttonData);
      break;
    case "Brands":
      buttonData.keywords = rowData["brandsList"];
      buttonData.customerName = rowData["customer"];
      copyListToClipboard(buttonData);
      break;
    case "Minus Words":
      buttonData.keywords = rowData["minusWordsList"];
      buttonData.customerName = rowData["customer"];
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

fetch("data.json")
  .then((response) => response.json())
  .then((tableData) => {
    tableData.clients.forEach((rowData) => {
      const row = document.createElement("tr");
      const customerCell = document.createElement("td");
      const linksCell = document.createElement("td");
      const copyingKeywordsCell = document.createElement("td");

      customerCell.textContent = rowData.customer;
      linksCell.textContent = rowData.links;

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
  })
  .catch((error) => console.error(error));
