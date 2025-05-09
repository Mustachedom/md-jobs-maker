let formattedItems = "";
let oxItems = "";
let uploadedFiles = [];
let uploadedFilenames = [];
let itemsList = [];
let generatedLuaContent = "";
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('cateringCheckbox').addEventListener('change', function() {
    toggleSection('cateringOptions', this.checked);
  });
  
  document.getElementById('closedCheckbox').addEventListener('change', function() {
    toggleSection('closedShopsOptions', this.checked);
  });
  
  document.getElementById('craftingCheckbox').addEventListener('change', function() {
    toggleSection('craftingOptions', this.checked);
  });
  
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
  
  document.getElementById('addRecipeBtn').addEventListener('click', addNewRecipe);
  document.getElementById('storeCheckbox').addEventListener('change', function() {
    toggleSection('storeOptions', this.checked);
  });

  document.getElementById('addStoreBtn').addEventListener('click', addNewStore);
  document.getElementById('locationCheckbox').addEventListener('change', function() {
    toggleSection('locationOptions', this.checked);
  });
  document.getElementById('jobRanksCheckbox').addEventListener('change', function() {
    toggleSection('jobRanksOptions', this.checked);
  });

  document.getElementById('addGradeBtn').addEventListener('click', function() {
    addGradeInput();
  });
  document.getElementById('locationTypeSelect').addEventListener('change', function() {
const selectedType = this.value;

// Hide all location type forms
document.querySelectorAll('.location-type-form').forEach(form => {
form.style.display = 'none';
});

// Show the selected type form
if (selectedType) {
const formElement = document.getElementById(`${selectedType.toLowerCase()}Form`);
if (formElement) {
  formElement.style.display = 'block';
  document.getElementById('addLocationBtn').style.display = 'block';
} else {
  console.error(`Form with ID '${selectedType.toLowerCase()}Form' not found`);
}
} else {
document.getElementById('addLocationBtn').style.display = 'none';
}
});
document.getElementById('consumableCheckbox').addEventListener('change', function() {
toggleSection('consumableOptions', this.checked);
});

document.getElementById('addConsumableBtn').addEventListener('click', function() {
addNewConsumable();
});
  // Add location button click handler
  document.getElementById('addLocationBtn').addEventListener('click', function() {
    const selectedType = document.getElementById('locationTypeSelect').value;
    if (selectedType) {
      addLocation(selectedType);
    }
  });
});

function toggleSection(id, isVisible) {
  const section = document.getElementById(id);
  if (isVisible) {
    section.classList.add('open');
  } else {
    section.classList.remove('open');
  }
}

function formatFilename(filename) {
  let baseName = filename.replace(/\.[^/.]+$/, "");
  let formattedLabel = baseName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let formattedText = `${baseName} = { name = '${baseName}', label = '${formattedLabel}', weight = 100, type = 'item', image = '${filename}', unique = false, useable = true, shouldClose = true, description = "" },`;
  formattedItems += formattedText + "\n";
  let oxText = `["${baseName}"] = { \n    label = '${formattedLabel}', \n    description = \"\", \n    weight = 100, \n    stack = true, \n    close = true, \n    client = { image = '${filename}' } \n},`;
  oxItems += oxText + "\n";
  
  // Add to itemsList for crafting table
  itemsList.push(baseName);
  
  return baseName;
}

function handleFileUpload(event) {
  let files = event.target.files;
  if (!files || files.length === 0) return;
  
  uploadedFiles = [];
  formattedItems = "";
  oxItems = "";
  uploadedFilenames = [];
  itemsList = [];
  
  for (let file of files) {
    if (file.type === "image/png") {
      uploadedFiles.push(file);
      formatFilename(file.name);
      uploadedFilenames.push(file.name);
    }
  }

  if (uploadedFiles.length > 0) {
    generateCateringItemInputs(uploadedFilenames);
    generateClosedShopInputs(uploadedFilenames);
    showNotification(`Successfully loaded ${uploadedFiles.length} image files`, 'success');
  } else {
    showNotification("No PNG images found in the selected folder", 'error');
  }
}

function generateCateringItemInputs(filenames) {
  const container = document.getElementById("cateringItemsContainer");
  container.innerHTML = "";
  const headerRow = document.createElement("div");
  headerRow.classList.add("grid-row", "header-row");
  ["Item", "Min Price", "Max Price", "Max Amount", "Actions"].forEach(text => {
    const headerCell = document.createElement("div");
    headerCell.classList.add("spreadsheet-cell");
    headerCell.textContent = text;
    headerRow.appendChild(headerCell);
  });
  container.appendChild(headerRow);
  filenames.forEach(name => {
    const row = document.createElement("div");
    row.classList.add("grid-row", "fade-in");
    const nameCell = document.createElement("div");
    nameCell.classList.add("spreadsheet-cell");
    nameCell.textContent = name.replace(/\.[^/.]+$/, "");
    row.appendChild(nameCell);
    const minCell = document.createElement("div");
    minCell.classList.add("spreadsheet-cell");
    const minInput = document.createElement("input");
    minInput.type = "number";
    minInput.placeholder = "Min Price";
    minInput.min = "0";
    minInput.value = "10";
    minCell.appendChild(minInput);
    row.appendChild(minCell);
    const maxCell = document.createElement("div");
    maxCell.classList.add("spreadsheet-cell");
    const maxInput = document.createElement("input");
    maxInput.type = "number";
    maxInput.placeholder = "Max Price";
    maxInput.min = "0";
    maxInput.value = "50";
    maxCell.appendChild(maxInput);
    row.appendChild(maxCell);
    const amountCell = document.createElement("div");
    amountCell.classList.add("spreadsheet-cell");
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.placeholder = "Max Amount";
    amountInput.min = "1";
    amountInput.value = "5";
    amountCell.appendChild(amountInput);
    row.appendChild(amountCell);
    const deleteCell = document.createElement("div");
    deleteCell.classList.add("spreadsheet-cell");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "×";
    deleteBtn.onclick = () => row.remove();
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);

    container.appendChild(row);
  });
}

function generateClosedShopInputs(filenames) {
  const container = document.getElementById("closedShopsContainer");
  container.innerHTML = "";
  const headerRow = document.createElement("div");
  headerRow.classList.add("grid-row", "header-row", "closed-shop");
  ["Item Name", "Price", "Actions"].forEach(text => {
    const headerCell = document.createElement("div");
    headerCell.classList.add("spreadsheet-cell");
    headerCell.textContent = text;
    headerRow.appendChild(headerCell);
  });
  container.appendChild(headerRow);
  filenames.forEach(name => {
    const row = document.createElement("div");
    row.classList.add("grid-row", "closed-shop", "fade-in");
    const nameCell = document.createElement("div");
    nameCell.classList.add("spreadsheet-cell");
    nameCell.textContent = name.replace(/\.[^/.]+$/, "");
    row.appendChild(nameCell);
    const priceCell = document.createElement("div");
    priceCell.classList.add("spreadsheet-cell");
    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.placeholder = "Price";
    priceInput.min = "0";
    priceInput.value = "25";
    priceCell.appendChild(priceInput);
    row.appendChild(priceCell);
    const deleteCell = document.createElement("div");
    deleteCell.classList.add("spreadsheet-cell");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "×";
    deleteBtn.onclick = () => row.remove();
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);

    container.appendChild(row);
  });
}

function addNewRecipe() {
const container = document.getElementById("craftingRecipesContainer");

const recipeDiv = document.createElement("div");
recipeDiv.classList.add("crafting-recipe", "fade-in");

const recipeId = "recipe_" + Date.now();
recipeDiv.id = recipeId;

const recipeHeader = document.createElement("div");
recipeHeader.classList.add("recipe-header");

// Make table name prominent as it's the main grouping key
const tableDiv = document.createElement("div");
tableDiv.classList.add("table-field");

const tableLabel = document.createElement("label");
tableLabel.textContent = "Crafting Table Name";

const tableInput = document.createElement("input");
tableInput.type = "text";
tableInput.placeholder = "e.g. joints, oil, whitewidow";
tableInput.classList.add("recipe-table");
tableInput.required = true;

tableDiv.appendChild(tableLabel);
tableDiv.appendChild(tableInput);

const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete-recipe-btn");
deleteBtn.textContent = "×";
deleteBtn.onclick = () => recipeDiv.remove();

const recipeTitle = document.createElement("h4");
recipeTitle.textContent = "New Recipe";
recipeHeader.appendChild(recipeTitle);
recipeDiv.appendChild(deleteBtn);
recipeDiv.appendChild(recipeHeader);
recipeDiv.appendChild(tableDiv);

// Animation and progress text fields
const animDiv = document.createElement("div");
animDiv.classList.add("anim-field");

const animLabel = document.createElement("label");
animLabel.textContent = "Animation";

const animInput = document.createElement("input");
animInput.type = "text";
animInput.placeholder = "e.g. uncuff";
animInput.classList.add("recipe-anim");
animInput.value = "uncuff";

animDiv.appendChild(animLabel);
animDiv.appendChild(animInput);

const progressDiv = document.createElement("div");
progressDiv.classList.add("anim-field");

const progressLabel = document.createElement("label");
progressLabel.textContent = "Progress Text";

const progressInput = document.createElement("input");
progressInput.type = "text";
progressInput.placeholder = "e.g. Rolling";
progressInput.classList.add("recipe-progress");
progressInput.value = "Crafting";

progressDiv.appendChild(progressLabel);
progressDiv.appendChild(progressInput);

recipeDiv.appendChild(animDiv);
recipeDiv.appendChild(progressDiv);

// Recipe body (take/give)
const recipeBody = document.createElement("div");
recipeBody.classList.add("recipe-body");

// Take section (ingredients needed)
const takeSection = document.createElement("div");
takeSection.classList.add("recipe-section", "take-section");

const takeHeader = document.createElement("h4");
takeHeader.textContent = "Result Items (take)";

const takeItemsDiv = document.createElement("div");
takeItemsDiv.classList.add("take-items");
takeItemsDiv.id = `${recipeId}_take_items`;

const addTakeBtn = document.createElement("button");
addTakeBtn.classList.add("add-item-btn");
addTakeBtn.textContent = "Add Result";
addTakeBtn.onclick = () => addItemSelector(takeItemsDiv, true);

takeSection.appendChild(takeHeader);
takeSection.appendChild(takeItemsDiv);
takeSection.appendChild(addTakeBtn);

// Give section (result items)
const giveSection = document.createElement("div");
giveSection.classList.add("recipe-section", "give-section");

const giveHeader = document.createElement("h4");
giveHeader.textContent = "Ingredients Needed (give)";

const giveItemsDiv = document.createElement("div");
giveItemsDiv.classList.add("give-items");
giveItemsDiv.id = `${recipeId}_give_items`;

const addGiveBtn = document.createElement("button");
addGiveBtn.classList.add("add-item-btn");
addGiveBtn.textContent = "Add Ingredient";
addGiveBtn.onclick = () => addItemSelector(giveItemsDiv, false);

giveSection.appendChild(giveHeader);
giveSection.appendChild(giveItemsDiv);
giveSection.appendChild(addGiveBtn);

recipeBody.appendChild(giveSection);
recipeBody.appendChild(takeSection);

recipeDiv.appendChild(recipeBody);
container.appendChild(recipeDiv);

// Add initial selectors
addItemSelector(takeItemsDiv, true);
addItemSelector(giveItemsDiv, false);
}

function addItemSelector(container, isTake) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item-selector");
  
  const itemSelect = document.createElement("select");
  itemSelect.classList.add("item-name");
  
  // Add default empty option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Item";
  itemSelect.appendChild(defaultOption);
  
  // Add all available items
  itemsList.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    itemSelect.appendChild(option);
  });
  
  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.value = "1";
  quantityInput.placeholder = "Qty";
  quantityInput.classList.add("item-quantity");
  
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-item-btn");
  removeBtn.textContent = "×";
  removeBtn.onclick = () => itemDiv.remove();
  
  itemDiv.appendChild(itemSelect);
  itemDiv.appendChild(quantityInput);
  itemDiv.appendChild(removeBtn);
  
  container.appendChild(itemDiv);
}

function collectCraftingRecipes() {
const recipesByTable = {};
const recipeDivs = document.getElementById("craftingRecipesContainer").querySelectorAll(".crafting-recipe");

recipeDivs.forEach(recipeDiv => {
const tableName = recipeDiv.querySelector(".recipe-table").value.trim();
if (!tableName) return; // Skip recipes without table name

const anim = recipeDiv.querySelector(".recipe-anim").value || "uncuff";
const progtext = recipeDiv.querySelector(".recipe-progress").value || "Crafting";

// Collect give items (ingredients)
const giveItems = {};
const giveSelectors = recipeDiv.querySelectorAll(".give-items .item-selector");
giveSelectors.forEach(selector => {
  const itemName = selector.querySelector(".item-name").value;
  const quantity = selector.querySelector(".item-quantity").value || 1;
  
  if (itemName) {
    giveItems[itemName] = parseInt(quantity);
  }
});

// Collect take items (results)
const takeItems = {};
const takeSelectors = recipeDiv.querySelectorAll(".take-items .item-selector");
takeSelectors.forEach(selector => {
  const itemName = selector.querySelector(".item-name").value;
  const quantity = selector.querySelector(".item-quantity").value || 1;
  
  if (itemName) {
    takeItems[itemName] = parseInt(quantity);
  }
});

// Only add recipe if it has at least one give and one take item
if ( Object.keys(takeItems).length > 0) {
  // Initialize table array if not exists
  if (!recipesByTable[tableName]) {
    recipesByTable[tableName] = [];
  }
  
  // Add recipe to appropriate table
  recipesByTable[tableName].push({
    anim,
    progtext,
    give: giveItems,
    take: takeItems
  });
}
});

return recipesByTable;
}

function togglePropInput(checkboxId, propInputId) {
const checkbox = document.getElementById(checkboxId);
const propInput = document.getElementById(propInputId);
propInput.style.display = checkbox.checked ? 'block' : 'none';
}

function toggleDropInput(checkboxId, containerID) {
const checkbox = document.getElementById(checkboxId);
const container = document.getElementById(containerID);
container.style.display = checkbox.checked ? 'block' : 'none';
}

function addNewStore() {
const container = document.getElementById("storesContainer");

const storeDiv = document.createElement("div");
storeDiv.classList.add("store-section", "fade-in");

const storeId = "store_" + Date.now();
storeDiv.id = storeId;

// Store header with name input
const storeHeader = document.createElement("div");
storeHeader.classList.add("store-header");

const storeNameLabel = document.createElement("label");
storeNameLabel.textContent = "Store Name:";
storeNameLabel.htmlFor = `${storeId}_name`;

const storeNameInput = document.createElement("input");
storeNameInput.type = "text";
storeNameInput.id = `${storeId}_name`;
storeNameInput.classList.add("store-name");
storeNameInput.placeholder = "e.g. ingredients, merchandise";
storeNameInput.required = true;

const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete-store-btn");
deleteBtn.textContent = "×";
deleteBtn.onclick = () => storeDiv.remove();

storeHeader.appendChild(storeNameLabel);
storeHeader.appendChild(storeNameInput);
storeHeader.appendChild(deleteBtn);

storeDiv.appendChild(storeHeader);

// Store items container
const itemsContainer = document.createElement("div");
itemsContainer.classList.add("store-items-container");

// Headers for the items grid
const headerRow = document.createElement("div");
headerRow.classList.add("grid-row", "header-row");

["Item", "Price", "Amount", "Actions"].forEach(headerText => {
const headerCell = document.createElement("div");
headerCell.classList.add("spreadsheet-cell");
headerCell.textContent = headerText;
headerRow.appendChild(headerCell);
});

itemsContainer.appendChild(headerRow);

// Container for item rows
const itemRowsContainer = document.createElement("div");
itemRowsContainer.classList.add("item-rows-container");
itemRowsContainer.id = `${storeId}_items`;

itemsContainer.appendChild(itemRowsContainer);

// Add item button
const addItemBtn = document.createElement("button");
addItemBtn.classList.add("add-item-btn");
addItemBtn.textContent = "Add Item";
addItemBtn.onclick = () => addStoreItem(itemRowsContainer);

storeDiv.appendChild(itemsContainer);
storeDiv.appendChild(addItemBtn);

container.appendChild(storeDiv);

// Add an initial item row
addStoreItem(itemRowsContainer);
}

function addStoreItem(container) {
const row = document.createElement("div");
row.classList.add("grid-row", "fade-in");

// Item selection dropdown
const nameCell = document.createElement("div");
nameCell.classList.add("spreadsheet-cell");

const itemSelect = document.createElement("select");
itemSelect.classList.add("item-name");

// Add default empty option
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Select Item";
itemSelect.appendChild(defaultOption);

// Add all available items
itemsList.forEach(item => {
const option = document.createElement("option");
option.value = item;
option.textContent = item;
itemSelect.appendChild(option);
});

nameCell.appendChild(itemSelect);
row.appendChild(nameCell);

// Price input
const priceCell = document.createElement("div");
priceCell.classList.add("spreadsheet-cell");

const priceInput = document.createElement("input");
priceInput.type = "number";
priceInput.placeholder = "Price";
priceInput.min = "0";
priceInput.value = "5";
priceInput.classList.add("item-price");

priceCell.appendChild(priceInput);
row.appendChild(priceCell);

// Amount input
const amountCell = document.createElement("div");
amountCell.classList.add("spreadsheet-cell");

const amountInput = document.createElement("input");
amountInput.type = "number";
amountInput.placeholder = "Amount";
amountInput.min = "1";
amountInput.value = "50";
amountInput.classList.add("item-amount");

amountCell.appendChild(amountInput);
row.appendChild(amountCell);

// Delete button
const deleteCell = document.createElement("div");
deleteCell.classList.add("spreadsheet-cell");

const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete-btn");
deleteBtn.textContent = "×";
deleteBtn.onclick = () => row.remove();

deleteCell.appendChild(deleteBtn);
row.appendChild(deleteCell);

container.appendChild(row);
}

function collectStores() {
const stores = {};
const storeDivs = document.getElementById("storesContainer").querySelectorAll(".store-section");

storeDivs.forEach(storeDiv => {
const storeName = storeDiv.querySelector(".store-name").value.trim();
if (!storeName) return; // Skip stores without a name

const storeItems = [];
const itemRows = storeDiv.querySelectorAll(".item-rows-container .grid-row");

itemRows.forEach(row => {
  const itemName = row.querySelector(".item-name").value;
  if (!itemName) return; // Skip items without a name
  
  const price = parseInt(row.querySelector(".item-price").value) || 5;
  const amount = parseInt(row.querySelector(".item-amount").value) || 50;
  
  storeItems.push({
    name: itemName,
    price: price,
    amount: amount
  });
});

if (storeItems.length > 0) {
  stores[storeName] = storeItems;
}
});

return stores;
}

function addLocation(locationType) {
// Get job name from the top of the form
const jobName = document.getElementById("jobName").value || "my_job";

// Create the location container
const container = document.getElementById("locationsContainer");
const locationDiv = document.createElement("div");
locationDiv.classList.add("location-item", "fade-in");

// Create header for the location
const header = document.createElement("div");
header.classList.add("location-header");

const typeLabel = document.createElement("span");
typeLabel.classList.add("location-type");
typeLabel.textContent = locationType;

const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete-location-btn");
deleteBtn.textContent = "×";
deleteBtn.onclick = () => locationDiv.remove();

header.appendChild(typeLabel);
header.appendChild(deleteBtn);
locationDiv.appendChild(header);

// Create the content div
const contentDiv = document.createElement("div");
contentDiv.classList.add("location-content");

// Build different forms based on location type
switch(locationType) {
case "Crafter":
  let crafterPropHtml = "";
  if (document.getElementById("crafterPropCheck").checked) {
    const crafterPropValue = document.getElementById("crafterProp").value;
    crafterPropHtml = `<p><strong>Prop:</strong> <span class="editable" data-field="prop">${crafterPropValue}</span></p>`;
  }
  contentDiv.innerHTML = `
    <div class="location-data" data-type="${locationType}" data-prop-enabled="${document.getElementById("crafterPropCheck").checked}">
      <p><strong>CraftData Type:</strong> <span class="editable" data-field="type">${document.getElementById("crafterType").value}</span></p>
      <p><strong>Target Label:</strong> <span class="editable" data-field="targetLabel">${document.getElementById("crafterTargetLabel").value}</span></p>
      <p><strong>Menu Label:</strong> <span class="editable" data-field="menuLabel">${document.getElementById("crafterMenuLabel").value}</span></p>
      ${crafterPropHtml}
      <p><strong>Location:</strong> <span class="editable" data-field="loc">${document.getElementById("crafterLoc").value}</span></p>
      <p><strong>Length (l):</strong> <span class="editable" data-field="l">${document.getElementById("crafterL").value}</span></p>
      <p><strong>Width (w):</strong> <span class="editable" data-field="w">${document.getElementById("crafterW").value}</span></p>
      <p><strong>Lower (lwr):</strong> <span class="editable" data-field="lwr">${document.getElementById("crafterLwr").value}</span></p>
      <p><strong>Upper (upr):</strong> <span class="editable" data-field="upr">${document.getElementById("crafterUpr").value}</span></p>
      <p><strong>Rotation (r):</strong> <span class="editable" data-field="r">${document.getElementById("crafterR").value}</span></p>
      <p><strong>Job:</strong> ${jobName}</p>
    </div>
  `;
  break;

case "Stores":
  let storesPropHtml = "";
  if (document.getElementById("storesPropCheck").checked) {
    const storesPropValue = document.getElementById("storesProp").value;
    storesPropHtml = `<p><strong>Prop:</strong> <span class="editable" data-field="prop">${storesPropValue}</span></p>`;
  }
  contentDiv.innerHTML = `
    <div class="location-data" data-type="${locationType}" data-prop-enabled="${document.getElementById("storesPropCheck").checked}">
      <p><strong>StoreData Type:</strong> <span class="editable" data-field="type">${document.getElementById("storesType").value}</span></p>
      <p><strong>Target Label:</strong> <span class="editable" data-field="targetLabel">${document.getElementById("storesTargetLabel").value}</span></p>
      <p><strong>Menu Label:</strong> <span class="editable" data-field="menuLabel">${document.getElementById("storesMenuLabel").value}</span></p>
      ${storesPropHtml}
      <p><strong>Location:</strong> <span class="editable" data-field="loc">${document.getElementById("storesLoc").value}</span></p>
      <p><strong>Length (l):</strong> <span class="editable" data-field="l">${document.getElementById("storesL").value}</span></p>
      <p><strong>Width (w):</strong> <span class="editable" data-field="w">${document.getElementById("storesW").value}</span></p>
      <p><strong>Lower (lwr):</strong> <span class="editable" data-field="lwr">${document.getElementById("storesLwr").value}</span></p>
      <p><strong>Upper (upr):</strong> <span class="editable" data-field="upr">${document.getElementById("storesUpr").value}</span></p>
      <p><strong>Rotation (r):</strong> <span class="editable" data-field="r">${document.getElementById("storesR").value}</span></p>
      <p><strong>Job:</strong> ${jobName}</p>
    </div>
  `;
  break;
  
case "Tills":
  const tillLoc = document.getElementById("tillsLoc").value;
  const tillL = document.getElementById("tillsL").value;
  const tillW = document.getElementById("tillsW").value;
  const tillLwr = document.getElementById("tillsLwr").value;
  const tillUpr = document.getElementById("tillsUpr").value;
  const tillR = document.getElementById("tillsR").value;
  let tillsPropHtml = "";
  const commission = document.getElementById('tillsCommission').value;
  if (document.getElementById("tillPropCheck").checked) {
    const storesPropValue = document.getElementById("tillProp").value;
    tillsPropHtml = `<p><strong>Prop:</strong> <span class="editable" data-field="prop">${storesPropValue}</span></p>`;
  }
  contentDiv.innerHTML = `
    <div class="location-data" data-type="${locationType}">
      <p><strong>Location:</strong> <span class="editable" data-field="loc">${tillLoc}</span></p>
      <p><strong>Length (l):</strong> <span class="editable" data-field="l">${tillL}</span></p>
      <p><strong>Width (w):</strong> <span class="editable" data-field="w">${tillW}</span></p>
      <p><strong>Lower (lwr):</strong> <span class="editable" data-field="lwr">${tillLwr}</span></p>
      <p><strong>Upper (upr):</strong> <span class="editable" data-field="upr">${tillUpr}</span></p>
      <p><strong>Rotation (r):</strong> <span class="editable" data-field="r">${tillR}</span></p>
      <p><strong>Commission: </strong> <span class="editable" data-field="commission">${commission}</span></p>
      ${tillsPropHtml}
      <p><strong>Job:</strong> ${jobName}</p>
    </div>
  `;
  break;
  
case "Trays":
case "Stash":
  const isTrays = locationType === "Trays";
  // Common fields
  const label = document.getElementById(`${locationType.toLowerCase()}Label`).value;
  const itemLoc = document.getElementById(`${locationType.toLowerCase()}Loc`).value;
  const itemL = document.getElementById(`${locationType.toLowerCase()}L`).value;
  const itemW = document.getElementById(`${locationType.toLowerCase()}W`).value;
  const itemLwr = document.getElementById(`${locationType.toLowerCase()}Lwr`).value;
  const itemUpr = document.getElementById(`${locationType.toLowerCase()}Upr`).value;
  const itemR = document.getElementById(`${locationType.toLowerCase()}R`).value;
  const slots = document.getElementById(`${locationType.toLowerCase()}Slots`).value;
  const weight = document.getElementById(`${locationType.toLowerCase()}Weight`).value;
  
  // Check if prop is enabled
  console.log(document.getElementById(`${locationType.toLowerCase()}PropCheck`));
  const propEnabled = document.getElementById(`${locationType.toLowerCase()}PropCheck`).checked || false;
  const propValue = propEnabled ? document.getElementById(`${locationType.toLowerCase()}Prop`).value : "";
  
  let propHtml = "";
  if (propEnabled) {
    propHtml = `<p><strong>Prop:</strong> <span class="editable" data-field="prop">${propValue}</span></p>`;
  }
  
  contentDiv.innerHTML = `
    <div class="location-data" data-type="${locationType}" data-prop-enabled="${propEnabled}">
      <p><strong>Label:</strong> <span class="editable" data-field="label">${label}</span></p>
      ${propHtml}
      <p><strong>Location:</strong> <span class="editable" data-field="loc">${itemLoc}</span></p>
      <p><strong>Length (l):</strong> <span class="editable" data-field="l">${itemL}</span></p>
      <p><strong>Width (w):</strong> <span class="editable" data-field="w">${itemW}</span></p>
      <p><strong>Lower (lwr):</strong> <span class="editable" data-field="lwr">${itemLwr}</span></p>
      <p><strong>Upper (upr):</strong> <span class="editable" data-field="upr">${itemUpr}</span></p>
      <p><strong>Rotation (r):</strong> <span class="editable" data-field="r">${itemR}</span></p>
      <p><strong>Slots:</strong> <span class="editable" data-field="slots">${slots}</span></p>
      <p><strong>Weight:</strong> <span class="editable" data-field="weight">${weight}</span></p>
      <p><strong>Job:</strong> ${jobName}</p>
    </div>
  `;
  break;
}

locationDiv.appendChild(contentDiv);
container.appendChild(locationDiv);

// Reset the form
document.getElementById(`${locationType.toLowerCase()}Form`).reset();

// Make fields editable on click
const editableFields = locationDiv.querySelectorAll('.editable');
editableFields.forEach(field => {
field.addEventListener('click', function() {
  const currentText = this.textContent;
  const fieldName = this.getAttribute('data-field');
  const newValue = prompt(`Edit ${fieldName}:`, currentText);
  if (newValue !== null) {
    this.textContent = newValue;
  }
});
});
}

function togglePropInput(checkboxId, propInputId) {
const checkbox = document.getElementById(checkboxId);
const propInput = document.getElementById(propInputId);
propInput.style.display = checkbox.checked ? 'block' : 'none';
}

function collectLocations() {
const locations = {
Crafter: [],
Stores: [],
Tills: [],
Trays: [],
Stash: []
};

const jobName = document.getElementById("jobName").value || "my_job";
const locationItems = document.querySelectorAll('.location-item');

locationItems.forEach(item => {
const typeLabel = item.querySelector('.location-type').textContent;
const locationData = item.querySelector('.location-data');

// Function to get field value
const getField = (field) => {
  const element = locationData.querySelector(`[data-field="${field}"]`);
  return element ? element.textContent : '';
};

switch(typeLabel) {
  case "Crafter":
  locations.Crafter.push({
      CraftData: {
        type: getField('type'),
        targetLabel: getField('targetLabel'),
        menuLabel: getField('menuLabel'),
        prop: locationData.getAttribute('data-prop-enabled') === 'true' ? getField('prop') : null
      },
      loc: getField('loc'),
      l: parseFloat(getField('l')),
      w: parseFloat(getField('w')),
      lwr: parseFloat(getField('lwr')),
      upr: parseFloat(getField('upr')),
      r: parseFloat(getField('r')),
      job: jobName
    });
    break;

  case "Stores":
    locations.Stores.push({
      StoreData: {
        type: getField('type'),
        targetLabel: getField('targetLabel'),
        menuLabel: getField('menuLabel'),
        prop: locationData.getAttribute('data-prop-enabled') === 'true' ? getField('prop') : null
      },
      loc: getField('loc'),
      l: parseFloat(getField('l')),
      w: parseFloat(getField('w')),
      lwr: parseFloat(getField('lwr')),
      upr: parseFloat(getField('upr')),
      r: parseFloat(getField('r')),
      job: jobName
    });
    break;
    
    case "Tills":
    const tillData = {
      loc: getField('loc'),
      l: parseFloat(getField('l')),
      w: parseFloat(getField('w')),
      lwr: parseFloat(getField('lwr')),
      upr: parseFloat(getField('upr')),
      r: parseFloat(getField('r')),
      commission: getField('commission'),
      prop: document.getElementById("tillPropCheck").checked ? getField('prop') : null,
      job: jobName
    };
    locations.Tills.push(tillData);
    break;
    
  case "Trays":
    const traysData = {
      label: getField('label'),
      loc: getField('loc'),
      l: parseFloat(getField('l')),
      w: parseFloat(getField('w')),
      lwr: parseFloat(getField('lwr')),
      upr: parseFloat(getField('upr')),
      r: parseFloat(getField('r')),
      slots: parseInt(getField('slots')),
      weight: parseInt(getField('weight')),
      job: jobName
    };
    
    // Add prop if it exists
    if (locationData.getAttribute('data-prop-enabled') === 'true') {
      traysData.prop = getField('prop');
    }
    
    locations.Trays.push(traysData);
    break;
    
  case "Stash":
    const stashData = {
      label: getField('label'),
      loc: getField('loc'),
      l: parseFloat(getField('l')),
      w: parseFloat(getField('w')),
      lwr: parseFloat(getField('lwr')),
      upr: parseFloat(getField('upr')),
      r: parseFloat(getField('r')),
      slots: parseInt(getField('slots')),
      weight: parseInt(getField('weight')),
      job: jobName
    };
    
    // Add prop if it exists
    if (locationData.getAttribute('data-prop-enabled') === 'true') {
      stashData.prop = getField('prop');
    }
    
    locations.Stash.push(stashData);
    break;
}
});

return locations;
}

function addNewConsumable() {
const container = document.getElementById("consumablesContainer");
const consumableDiv = document.createElement("div");
consumableDiv.classList.add("crafting-recipe", "fade-in");

// Header and Delete Button
const header = document.createElement("div");
header.classList.add("recipe-header");
const title = document.createElement("h4");
title.textContent = "New Consumable";
const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete-recipe-btn");
deleteBtn.textContent = "×";
deleteBtn.onclick = () => consumableDiv.remove();

header.appendChild(title);
header.appendChild(deleteBtn);
consumableDiv.appendChild(header);

// Item Selection Dropdown
const itemDiv = document.createElement("div");
itemDiv.classList.add("item-field");
const itemLabel = document.createElement("label");
itemLabel.textContent = "Select Item";
const itemSelect = document.createElement("select");
itemSelect.classList.add("consumable-item");
// Add default empty option
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Select Item";
itemSelect.appendChild(defaultOption);
// Populate dropdown with itemsList
itemsList.forEach(item => {
const option = document.createElement("option");
option.value = item;
option.textContent = item;
itemSelect.appendChild(option);
});
itemDiv.appendChild(itemLabel);
itemDiv.appendChild(itemSelect);
consumableDiv.appendChild(itemDiv);

// Drink Button
const drinkButton = document.createElement("button");
drinkButton.classList.add("primary-btn");
drinkButton.textContent = "Set as Drink";
drinkButton.style.marginTop = "10px";
drinkButton.onclick = () => {
const animInput = consumableDiv.querySelector(".consumable-anim");
const labelInput = consumableDiv.querySelector(".consumable-label");
const effectsContainer = consumableDiv.querySelector(".effects-container");

// Set anim and label
animInput.value = "drink";
labelInput.value = "Drinking";

// Update all effect type dropdowns to "thirst"
const effectSelectors = consumableDiv.querySelectorAll(".effect-type");
effectSelectors.forEach(selector => {
  selector.value = "thirst";
});
};
consumableDiv.appendChild(drinkButton);

// Food Button
const foodButton = document.createElement("button");
foodButton.classList.add("primary-btn");
foodButton.textContent = "Set as Food";
foodButton.style.marginTop = "10px";
foodButton.onclick = () => {
const animInput = consumableDiv.querySelector(".consumable-anim");
const labelInput = consumableDiv.querySelector(".consumable-label");
const effectsContainer = consumableDiv.querySelector(".effects-container");

// Set anim and label
animInput.value = "eat";
labelInput.value = "Eating";

// Update all effect type dropdowns to "hunger"
const effectSelectors = consumableDiv.querySelectorAll(".effect-type");
effectSelectors.forEach(selector => {
  selector.value = "hunger";
});
};
consumableDiv.appendChild(foodButton);

// Anim Input
const animDiv = document.createElement("div");
animDiv.classList.add("anim-field");
const animLabel = document.createElement("label");
animLabel.textContent = "Animation";
const animInput = document.createElement("input");
animInput.type = "text";
animInput.placeholder = "e.g. eat";
animInput.classList.add("consumable-anim");
animDiv.appendChild(animLabel);
animDiv.appendChild(animInput);
consumableDiv.appendChild(animDiv);

// Label Input
const labelDiv = document.createElement("div");
labelDiv.classList.add("anim-field");
const labelLabel = document.createElement("label");
labelLabel.textContent = "Label";
const labelInput = document.createElement("input");
labelInput.type = "text";
labelInput.placeholder = "e.g. Eating";
labelInput.classList.add("consumable-label");
labelDiv.appendChild(labelLabel);
labelDiv.appendChild(labelInput);
consumableDiv.appendChild(labelDiv);

// Add Effects Section
const effectsDiv = document.createElement("div");
effectsDiv.classList.add("recipe-section");
const effectsHeader = document.createElement("h4");
effectsHeader.textContent = "Effects";
const effectsContainer = document.createElement("div");
effectsContainer.id = `effects_${Date.now()}`;
const addEffectBtn = document.createElement("button");
addEffectBtn.classList.add("add-item-btn");
addEffectBtn.textContent = "Add Effect";
addEffectBtn.onclick = () => addEffectSelector(effectsContainer);

effectsDiv.appendChild(effectsHeader);
effectsDiv.appendChild(effectsContainer);
effectsDiv.appendChild(addEffectBtn);
consumableDiv.appendChild(effectsDiv);

// Add Initial Effect Selector
addEffectSelector(effectsContainer);

container.appendChild(consumableDiv);
}

function addEffectSelector(container) {
const effectDiv = document.createElement("div");
effectDiv.classList.add("item-selector");

// Effect Type Select
const effectSelect = document.createElement("select");
effectSelect.classList.add("effect-type");
const options = ["hunger", "thirst", "stress"];
options.forEach(option => {
const opt = document.createElement("option");
opt.value = option;
opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
effectSelect.appendChild(opt);
});

// Effect Value Input
const valueInput = document.createElement("input");
valueInput.type = "number";
valueInput.min = "1";
valueInput.value = "10";
valueInput.placeholder = "Value";
valueInput.classList.add("effect-value");

// Remove Button
const removeBtn = document.createElement("button");
removeBtn.classList.add("remove-item-btn");
removeBtn.textContent = "×";
removeBtn.onclick = () => effectDiv.remove();

effectDiv.appendChild(effectSelect);
effectDiv.appendChild(valueInput);
effectDiv.appendChild(removeBtn);
container.appendChild(effectDiv);
}

function collectConsumables() {
const consumables = {};
const consumableDivs = document.getElementById("consumablesContainer").querySelectorAll(".crafting-recipe");
consumableDivs.forEach(consumableDiv => {
const itemName = consumableDiv.querySelector(".consumable-item").value; // Get selected item name
if (!itemName) return; // Skip if no item is selected
const anim = consumableDiv.querySelector(".consumable-anim").value || "eat";
const label = consumableDiv.querySelector(".consumable-label").value || "Eating";
const effects = {};

const effectSelectors = consumableDiv.querySelectorAll(".item-selector");
effectSelectors.forEach(selector => {
  const effectType = selector.querySelector(".effect-type").value;
  const effectValue = parseInt(selector.querySelector(".effect-value").value) || 10;
  if (effectType) {
    effects[effectType] = effectValue;
  }
});

if (Object.keys(effects).length > 0) {
  consumables[itemName] = {
    anim,
    label,
    add: effects
  };
}
});
return consumables;
}
// Update downloadAllInputs function to include locations
function downloadAllInputs() {
const jobName = document.getElementById("jobName").value || "my_job";
const cateringEnabled = document.getElementById("cateringCheckbox").checked;
const closedEnabled = document.getElementById("closedCheckbox").checked;
const craftingEnabled = document.getElementById("craftingCheckbox").checked;
const storeEnabled = document.getElementById("storeCheckbox").checked;
const locationEnabled = document.getElementById("locationCheckbox").checked;

const blipSprite = document.getElementById("blipSprite").value || 0;
const blipColor = document.getElementById("blipColor").value || 0;
const blipScale = document.getElementById("blipScale").value || 1.0;
const blipLabel = document.getElementById("blipLabel").value || jobName;
const blipLoc = document.getElementById("blipLoc").value || "vector4(0.0, 0.0, 0.0, 0.0)";

const vehicleModel = document.getElementById("vehicleModel").value || "speedo";
const vehicleLabel = document.getElementById("vehicleLabel").value || "Catering Van";
const vehiclePlate = document.getElementById("vehiclePlate").value || jobName.substring(0, 8).toUpperCase();
const vehicleLoc = document.getElementById("vehicleLoc").value || "vector4(0.0, 0.0, 0.0, 0.0)";
const commissionInput = document.getElementById("commissionInput").value || 0.2;

const closedModel = document.getElementById("closedModel")?.value || "mp_m_freemode_01";
const closedLabel = document.getElementById("closedLabel")?.value || `${jobName} Shop`;
const closedLoc = document.getElementById("closedLoc")?.value || "vector4(0.0, 0.0, 0.0, 0.0)";

const craftingLoc = document.getElementById("craftingLoc")?.value || "vector4(0.0, 0.0, 0.0, 0.0)";
const craftingLabel = document.getElementById("craftingLabel")?.value || `${jobName} Crafting`;

const heading = vehicleLoc.split(',').pop()?.trim().replace(')', '') || "0";

let cateringItemsData = [];
if (cateringEnabled) {
const cateringRows = document.getElementById("cateringItemsContainer").querySelectorAll(".grid-row:not(.header-row)");

cateringRows.forEach(row => {
  const nameCell = row.querySelector(".spreadsheet-cell");
  const name = nameCell ? nameCell.textContent.trim().replace(/\.[^/.]+$/, '') : '';
  const inputs = row.querySelectorAll("input[type='number']");
  if (inputs.length >= 3 && name) {
    cateringItemsData.push({
      name,
      minPrice: inputs[0].value || 10,
      maxPrice: inputs[1].value || 50,
      maxAmount: inputs[2].value || 5
    });
  }
});
}

let closedShopItemsData = [];
if (closedEnabled) {
const closedShopRows = document.getElementById("closedShopsContainer").querySelectorAll(".grid-row:not(.header-row)");

closedShopRows.forEach(row => {
  const nameCell = row.querySelector(".spreadsheet-cell");
  const name = nameCell ? nameCell.textContent.trim().replace(/\.[^/.]+$/, '') : '';
  
  const priceInput = row.querySelector("input[type='number']");
  const price = priceInput ? priceInput.value : 25;
  
  if (name) {
    closedShopItemsData.push({ name, price });
  }
});
}

// Collect crafting recipes grouped by table
let craftingRecipesByTable = {};
if (craftingEnabled) {
craftingRecipesByTable = collectCraftingRecipes();
}

// Collect stores data
let storesData = {};
if (storeEnabled) {
storesData = collectStores();
}

// Collect locations data
let locationsData = {};
if (locationEnabled) {
locationsData = collectLocations();
}

let luaOutput = `Jobs["${jobName}"] = {\n`;
luaOutput += `    CateringEnabled = ${cateringEnabled},\n`;
luaOutput += `    closedShopsEnabled = ${closedEnabled},\n`;
luaOutput += `    Blip = {\n`;
luaOutput += `        { sprite = ${blipSprite}, color = ${blipColor}, scale = ${blipScale}, label = "${blipLabel}", loc = ${blipLoc} },\n`;
luaOutput += `    },\n`;

if (closedEnabled && closedShopItemsData.length > 0) {
luaOutput += `    closedShops = {\n`;
luaOutput += `        {ped = "${closedModel}", loc = ${closedLoc}, label = "${closedLabel}"},\n`;
luaOutput += `    },\n`;

luaOutput += `    closedShopItems = {\n`;
closedShopItemsData.forEach(item => {
  luaOutput += `        ${item.name} = {name = '${item.name}', price = ${item.price}},\n`;
});
luaOutput += `    },\n\n`;
}

if (cateringEnabled && cateringItemsData.length > 0) {
luaOutput += `    catering = {\n`;
luaOutput += `        commission = ${commissionInput},\n`;
luaOutput += `        items = {\n`;

cateringItemsData.forEach(item => {
  luaOutput += `            {name = '${item.name}', minPrice = ${item.minPrice}, maxPrice = ${item.maxPrice}, maxAmount = ${item.maxAmount}},\n`;
});

luaOutput += `        },\n`;

luaOutput += `        Van = {\n`;
luaOutput += `            ${jobName} = {model = "${vehicleModel}", label = "${vehicleLabel}", plate = "${vehiclePlate}", loc = ${vehicleLoc}, heading = ${heading}},\n`;
luaOutput += `        }\n`;
luaOutput += `    },\n\n`;
}

// Add crafting table section to LUA output with new format
if (craftingEnabled && Object.keys(craftingRecipesByTable).length > 0) {
luaOutput += `    crafting = {\n`;
// Format the recipes by table
Object.entries(craftingRecipesByTable).forEach(([tableName, recipes], tableIndex) => {
  luaOutput += `            ${tableName} = {\n`;
  
  recipes.forEach((recipe, recipeIndex) => {
    luaOutput += `                {anim = '${recipe.anim}',`;
    
    // Add give items (ingredients)
    luaOutput += `give = {`;
    Object.entries(recipe.give).forEach(([item, quantity], index) => {
      luaOutput += ` ${item} = ${quantity}`;
      if (index < Object.keys(recipe.give).length - 1) {
        luaOutput += ",";
      }
    });
    luaOutput += `},`;
    
    // Add take items (results)
    luaOutput += ` take = {`;
    Object.entries(recipe.take).forEach(([item, quantity], index) => {
      luaOutput += `${item}=${quantity}`;
      if (index < Object.keys(recipe.take).length - 1) {
        luaOutput += ", ";
      }
    });
    luaOutput += `},`;
    
    luaOutput += ` progtext = '${recipe.progtext}'}`;
    if (recipeIndex < recipes.length - 1) {
      luaOutput += ",\n";
    } else {
      luaOutput += "\n";
    }
  });
  
  // Close the table
  if (tableIndex < Object.keys(craftingRecipesByTable).length - 1) {
    luaOutput += `            },\n`;
  } else {
    luaOutput += `            }\n`;
  }
});

luaOutput += `    },\n\n`;
}

// Add stores section to LUA output
if (storeEnabled && Object.keys(storesData).length > 0) {
luaOutput += `    shops = {\n`;

// Format the stores
Object.entries(storesData).forEach(([storeName, items], storeIndex) => {
  luaOutput += `        ${storeName}={\n`;
  
  items.forEach((item, itemIndex) => {
    luaOutput += `            {name = '${item.name}', price = ${item.price}, amount = ${item.amount}}`;
    if (itemIndex < items.length - 1) {
      luaOutput += ",\n";
    } else {
      luaOutput += "\n";
    }
  });
  
  // Close the store
  if (storeIndex < Object.keys(storesData).length - 1) {
    luaOutput += `        },\n`;
  } else {
    luaOutput += `        }\n`;
  }
});

luaOutput += `    },\n\n`;
}

// Add locations section to LUA output
if (locationEnabled) {
luaOutput += `    locations = {\n`;

// Crafters
// Crafters
if (locationsData.Crafter.length > 0) {
  luaOutput += `        Crafter = {\n`;
  locationsData.Crafter.forEach((item, index) => {
    luaOutput += `            {CraftData = {type = '${item.CraftData.type}', targetLabel = '${item.CraftData.targetLabel}', menuLabel = '${item.CraftData.menuLabel}'`;
    if (item.CraftData.prop) {
      luaOutput += `, prop = '${item.CraftData.prop}'`; // Add prop if it exists
    }
    luaOutput += `},\n`;
    luaOutput += `                loc = ${item.loc}, l = ${item.l}, w = ${item.w}, lwr = ${item.lwr}, upr = ${item.upr}, r = ${item.r}, job = '${item.job}'}`;
    if (index < locationsData.Crafter.length - 1) {
      luaOutput += ",";
    }
    luaOutput += "\n";
  });
  luaOutput += `        },\n`;
}

// Stores
if (locationsData.Stores.length > 0) {
  luaOutput += `        Stores = {\n`;
  locationsData.Stores.forEach((item, index) => {
    luaOutput += `            {StoreData = {type = '${item.StoreData.type}', targetLabel = '${item.StoreData.targetLabel}', menuLabel = '${item.StoreData.menuLabel}'`;
    if (item.StoreData.prop) {
      luaOutput += `, prop = '${item.StoreData.prop}'`; // Add prop if it exists
    }
    luaOutput += `},\n`;
    luaOutput += `                loc = ${item.loc}, l = ${item.l}, w = ${item.w}, lwr = ${item.lwr}, upr = ${item.upr}, r = ${item.r}, job = '${item.job}'}`;
    if (index < locationsData.Stores.length - 1) {
      luaOutput += ",";
    }
    luaOutput += "\n";
  });
  luaOutput += `        },\n`;
}

// Tills
if (locationsData.Tills.length > 0) {
  luaOutput += `        Tills = {\n`;
  locationsData.Tills.forEach((item, index) => {
    luaOutput += `            {loc = ${item.loc}, l = ${item.l}, w = ${item.w}, lwr = ${item.lwr}, upr = ${item.upr}, r = ${item.r}, commission = ${item.commission}`;
    if (item.prop) {
      luaOutput += `, prop = '${item.prop}'`; // Add prop if it exists
    }
    luaOutput += `, job = '${item.job}'}`;
    if (index < locationsData.Tills.length - 1) {
      luaOutput += ",";
    }
    luaOutput += "\n";
  });
  luaOutput += `        },\n`;
}

// Trays
if (locationsData.Trays.length > 0) {
  luaOutput += `        trays = {\n`;
  locationsData.Trays.forEach((item, index) => {
    luaOutput += `            {label = '${item.label}'`;
    if (item.prop) {
      luaOutput += `, prop = '${item.prop}'`; // Add prop if it exists
    }
    luaOutput += `, loc = ${item.loc}, l = ${item.l}, w = ${item.w}, lwr = ${item.lwr}, upr = ${item.upr}, r = ${item.r}, slots = ${item.slots}, weight = ${item.weight}, job = '${item.job}'}`;
    if (index < locationsData.Trays.length - 1) {
      luaOutput += ",";
    }
    luaOutput += "\n";
  });
  luaOutput += `        },\n`;
}

// Stash
if (locationsData.Stash.length > 0) {
  luaOutput += `        stash = {\n`;
  locationsData.Stash.forEach((item, index) => {
    luaOutput += `            {label = '${item.label}'`;
    if (item.prop) {
      luaOutput += `, prop = '${item.prop}'`; // Add prop if it exists
    }
    luaOutput += `, loc = ${item.loc}, l = ${item.l}, w = ${item.w}, lwr = ${item.lwr}, upr = ${item.upr}, r = ${item.r}, slots = ${item.slots}, weight = ${item.weight}, job = '${item.job}'}`;
    if (index < locationsData.Stash.length - 1) {
      luaOutput += ",";
    }
    luaOutput += "\n";
  });
  luaOutput += `        }\n`;
}

luaOutput += `    },\n`;
}
if (document.getElementById("consumableCheckbox").checked) {
const consumablesData = collectConsumables();
if (Object.keys(consumablesData).length > 0) {
luaOutput += `    consumables = {
`;
Object.entries(consumablesData).forEach(([itemName, data]) => {
  luaOutput += `        ${itemName} = {anim = '${data.anim}', label = '${data.label}', add = {`;
  Object.entries(data.add).forEach(([effect, value], index) => {
    luaOutput += `${effect} = ${value}`;
    if (index < Object.keys(data.add).length - 1) {
      luaOutput += ", ";
    }
  });
  luaOutput += `}},
`;
});
luaOutput += `    },
`;
}
}
luaOutput += `}\n`;
generatedLuaContent = luaOutput;
downloadZip();

}

function formatVector(loc) {
const x = parseFloat(loc.x).toFixed(2);
const y = parseFloat(loc.y).toFixed(2);
const z = parseFloat(loc.z).toFixed(2);
return `vector3(${x}, ${y}, ${z})`;
}

function downloadFile(type) {
        let fileContent;
        let filename;
        if (type === "qb") {
            fileContent = "```lua\n" + formattedItems + "\n```";
            filename = "qb.md";
        } else if (type === "ox") {
            fileContent = "```lua\n" + oxItems + "\n```"; // Wrap Ox items with ```lua
            filename = "ox.md";
        }

        let blob = new Blob([fileContent], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename; // Use the appropriate filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

function downloadZip() {
        const jobName = document.getElementById("jobName").value || "my_job";
        const zip = new JSZip();
        const inputFolder = zip.folder(jobName); // Create the input folder
        const jobFiles = downloadJobs(); // Get the job files
        // Create img folder inside the input folder
        const imgFolder = inputFolder.folder("img");

        // Add uploaded image files to the img folder in the ZIP
        uploadedFiles.forEach(file => {
            imgFolder.file(file.name, file);
        });

        // Add qb.md and ox.md to the input folder (not inside img folder)
        inputFolder.file("qb.md", "```lua\n" + formattedItems + "\n```");
        inputFolder.file("ox.md", "```lua\n" + oxItems + "\n```");
        inputFolder.file("jobData.md", jobFiles); // Add the job data file to the input folder
        inputFolder.file(`${jobName}.lua`, generatedLuaContent);
        // Generate the ZIP and prompt download
        zip.generateAsync({ type: "blob" }).then(function(content) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = `${jobName}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

function addGradeInput() {
const container = document.getElementById("gradesContainer");
const gradeDiv = document.createElement("div");
gradeDiv.classList.add("grade-item", "fade-in");

const header = document.createElement("div");
header.classList.add("recipe-header");
const title = document.createElement("h4");
title.textContent = "Grade";
const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete-recipe-btn");
deleteBtn.textContent = "×";
deleteBtn.onclick = () => gradeDiv.remove();
header.appendChild(title);
header.appendChild(deleteBtn);
gradeDiv.appendChild(header);

const fieldGroup = document.createElement("div");
fieldGroup.classList.add("field-group");

// Grade Level
const levelDiv = document.createElement("div");
const levelLabel = document.createElement("label");
levelLabel.textContent = "Level";
const levelInput = document.createElement("input");
levelInput.type = "number";
levelInput.min = "0";
levelInput.placeholder = "e.g. 0";
levelInput.classList.add("grade-level");
levelDiv.appendChild(levelLabel);
levelDiv.appendChild(levelInput);
fieldGroup.appendChild(levelDiv);

// Grade Name
const nameDiv = document.createElement("div");
const nameLabel = document.createElement("label");
nameLabel.textContent = "Name";
const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "e.g. Recruit";
nameInput.classList.add("grade-name");
nameDiv.appendChild(nameLabel);
nameDiv.appendChild(nameInput);
fieldGroup.appendChild(nameDiv);

// Payment
const payDiv = document.createElement("div");
const payLabel = document.createElement("label");
payLabel.textContent = "Payment";
const payInput = document.createElement("input");
payInput.type = "number";
payInput.placeholder = "e.g. 50";
payInput.classList.add("grade-payment");
payDiv.appendChild(payLabel);
payDiv.appendChild(payInput);
fieldGroup.appendChild(payDiv);

// Is Boss
const bossDiv = document.createElement("div");
const bossLabel = document.createElement("label");
bossLabel.textContent = "Is Boss";
const bossSelect = document.createElement("select");
bossSelect.classList.add("grade-isboss");
const bossTrueOption = document.createElement("option");
bossTrueOption.value = "true";
bossTrueOption.textContent = "True";
const bossFalseOption = document.createElement("option");
bossFalseOption.value = "false";
bossFalseOption.textContent = "False";
bossFalseOption.selected = true; // Set this option as selected by default
bossSelect.appendChild(bossTrueOption);
bossSelect.appendChild(bossFalseOption);
bossDiv.appendChild(bossLabel);
bossDiv.appendChild(bossSelect);
fieldGroup.appendChild(bossDiv);

gradeDiv.appendChild(fieldGroup);
container.appendChild(gradeDiv);
}
function collectJobRanks() {
if (!document.getElementById("jobRanksCheckbox").checked) return null;

const label = document.getElementById("jobLabel").value || "police";
const type = document.getElementById("jobType").value || "leo";
const defaultPay = document.getElementById("defaultPay").value || 50;
const defaultDuty = document.getElementById("defaultDuty").value === "false";

const grades = {};
const gradeItems = document.querySelectorAll('.grade-item');
gradeItems.forEach(item => {
const level = item.querySelector(".grade-level").value;
const name = item.querySelector(".grade-name").value;
const payment = item.querySelector(".grade-payment").value;
const isBoss = item.querySelector(".grade-isboss").value === "false";
if (level && name && payment) {
  grades[level] = { name, payment: parseInt(payment) };
  if (isBoss) {
    grades[level].isboss = true;
  }
}
});

if (Object.keys(grades).length > 0) {
return {
  label,
  type,
  defaultPay: parseInt(defaultPay),
  defaultDuty,
  grades
};
}
return null;
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('statusNotification');
  notification.textContent = message;
  notification.className = 'status-notification';
  notification.classList.add(type);
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
function downloadJobs() {
const jobName = document.getElementById("jobName").value || "my_job";
const cateringEnabled = document.getElementById("cateringCheckbox").checked;
const closedEnabled = document.getElementById("closedCheckbox").checked;
const craftingEnabled = document.getElementById("craftingCheckbox").checked;
const storeEnabled = document.getElementById("storeCheckbox").checked;
const locationEnabled = document.getElementById("locationCheckbox").checked;
const consumableEnabled = document.getElementById("consumableCheckbox").checked;

const jobRanksData = collectJobRanks();

let luaQBCore = `-- QBCORE\n`;
let luaQBox = `-- QBOX\n`;
let sqlInserts = `-- SQL Insert Statements\n`;

if (jobRanksData) {
// QBCore Format
luaQBCore += `${jobName} = {\n`;
luaQBCore += `    label = '${jobRanksData.label}',\n`;
luaQBCore += `    type = '${jobRanksData.type}',\n`;
luaQBCore += `    defaultDuty = ${jobRanksData.defaultDuty},\n`;
luaQBCore += `    offDutyPay = ${jobRanksData.offDutyPay},\n`;
luaQBCore += `    grades = {\n`;
Object.entries(jobRanksData.grades).forEach(([level, data], index) => {
  luaQBCore += `        ['${level}'] = {\n`;
  luaQBCore += `            name = '${data.name}',\n`;
  luaQBCore += `            payment = ${data.payment}`;
  if (data.isboss) {
    luaQBCore += `,\n            isboss = true,\n            bankAuth = true`;
  }
  luaQBCore += `\n        }`;
  if (index < Object.keys(jobRanksData.grades).length - 1) {
    luaQBCore += ",";
  }
  luaQBCore += "\n";
});
luaQBCore += `    },\n`;
luaQBCore += `},\n\n`;

// QBox Format
luaQBox += `['${jobName}'] = {\n`;
luaQBox += `    label = '${jobRanksData.label}',\n`;
luaQBox += `    type = '${jobRanksData.type}',\n`;
luaQBox += `    defaultDuty = ${jobRanksData.defaultDuty},\n`;
luaQBox += `    offDutyPay = ${jobRanksData.offDutyPay},\n`;
luaQBox += `    grades = {\n`;
Object.entries(jobRanksData.grades).forEach(([level, data], index) => {
  luaQBox += `        [${level}] = {\n`;
  luaQBox += `            name = '${data.name}',\n`;
  luaQBox += `            payment = ${data.payment}`;
  if (data.isboss) {
    luaQBox += `,\n            isboss = true,\n            bankAuth = true`;
  }
  luaQBox += `\n        }`;
  if (index < Object.keys(jobRanksData.grades).length - 1) {
    luaQBox += ",";
  }
  luaQBox += "\n";
});
luaQBox += `    },\n`;
luaQBox += `},\n\n`;

// SQL Format
sqlInserts += `INSERT INTO \`jobs\` (name, label) VALUES\n`;
sqlInserts += `  ('${jobName}', '${jobRanksData.label}');\n\n`;
sqlInserts += `INSERT INTO \`job_grades\` (job_name, grade, name, label, salary, skin_male, skin_female) VALUES\n`;
Object.entries(jobRanksData.grades).forEach(([level, data], index) => {
  sqlInserts += `  ('${jobName}', ${level}, '${data.name.toLowerCase()}', '${data.name}', ${data.payment}, '{}', '{}')`;
  if (index < Object.keys(jobRanksData.grades).length - 1) {
    sqlInserts += ",";
  }
  sqlInserts += "\n";
});
sqlInserts += ";\n";
}

// Combine all formats into one final output
return luaQBCore + luaQBox + sqlInserts;
}
