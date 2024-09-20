const allColumnData = {
  col1,
  col2,
  col3,
  col4,
  col5,
  col6,
  col7,
  col8,
  col9,
  col10,
  col11,
  col12,
  col13,
  col14,
  col15,
  col16,
  col17,
  col18,
  col19,
  col20,
};

function createColumnData(array) {
  const columnData = array.map((number) => {
    let newItem = dmc.find((item) => item.code === number);
    return newItem;
  });
  return columnData;
}

function createUList(index) {
  const ul = document.createElement("ul");
  ul.classList.add("color-chart__column");
  ul.id = `color-chart__col${index}`;

  const columnHeader = document.createElement("li");
  columnHeader.classList.add("color-chart__col-header");
  columnHeader.innerText = `${index}`;
  ul.appendChild(columnHeader);

  return ul;
}

function createChartColumns(columnData) {
  const chartContainer = document.getElementById("color-chart__container");

  for (let i = 1; i <= Object.keys(allColumnData).length; i++) {
    let columnName = `col${i}`;
    let currentColumnData = columnData[columnName];

    let ulElement = createUList(i);
    let chips = createChartChips(currentColumnData);
    ulElement.append(chips);
    chartContainer.appendChild(ulElement);
  }
}

function createListItems(array) {
  const fragment = document.createDocumentFragment();

  array.forEach((arrayItem) => {
    if (arrayItem) {
      const listItem = document.createElement("li");
      listItem.dataset.code = arrayItem.code;
      listItem.dataset.name = arrayItem.dmcName;
      listItem.style.backgroundColor = arrayItem.hex;
      listItem.addEventListener("click", renderColorCode);
      fragment.appendChild(listItem);
    }
  });
  return fragment;
}

function createChartChips(columnData) {
  let column = createColumnData(columnData);
  let listItems = createListItems(column);
  return listItems;
}

function renderColorCode(event) {
  const info = document.getElementById("color-chart__info");
  const chip = event.target.closest("li");
  info.innerText = `${chip.dataset.code} ${chip.dataset.name}`;
}

createChartColumns(allColumnData);
