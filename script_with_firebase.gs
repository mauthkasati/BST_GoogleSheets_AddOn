let bst = null; // Temporary global variable during function execution

class BSTNode {
  constructor(word, row, col) {
    this.word = word; // Keyword
    this.row = row; // Row position
    this.col = col; // Column position
    this.left = null; // Left child
    this.right = null; // Right child
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(word, row, col) {
    const newNode = new BSTNode(word, row, col);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (word < current.word) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  findAllOccurrences(node, keyword, results) {
    if (!node) return;

    // Perform in-order traversal
    this.findAllOccurrences(node.left, keyword, results);
    if (node.word === keyword) {
      results.push({ row: node.row, col: node.col });
    }
    this.findAllOccurrences(node.right, keyword, results);
  }
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Add-on')
    .addItem('Load Data into BST', 'loadDataIntoBST')
    .addItem('Search Keyword', 'searchKeyword')
    .addToUi();
}

function loadDataIntoBST() {
  const startTime = Date.now(); // Start timing

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const bst = new BinarySearchTree();
  const totalCells = data.length * data[0].length; // Total number of cells
  let processedCells = 0; // Counter for processed cells

  // Process data row by row to optimize memory usage
  data.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const words = String(cell).split(/\s+/); // Split by whitespace
      words.forEach(word => {
        bst.insert(word.toLowerCase(), rowIndex + 1, colIndex + 1); // Insert into BST
      });
      processedCells++;
      // Show progress every 1000 cells
      if (processedCells % 1000 === 0) {
        const progress = ((processedCells / totalCells) * 100).toFixed(2);
        SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutput(`Loading Data: ${progress}% Complete`));
      }
    });
  });

  // Serialize the BST into JSON
  const bstJSON = JSON.stringify(bst);

  // Upload BST to Firebase
  const firebaseUrl = 'https://BST.firebaseio.com/bst.json';
  const options = {
    method: 'put',
    contentType: 'application/json',
    payload: bstJSON
  };
  UrlFetchApp.fetch(firebaseUrl, options);

  const endTime = Date.now(); // End timing
  const loadTime = ((endTime - startTime)).toFixed(2); // Calculate loading time in seconds

  SpreadsheetApp.getUi().alert(`Data has been successfully loaded into the Binary Search Tree and uploaded to Firebase!\nLoading Time: ${loadTime} milliseconds`);
}

function searchKeyword() {
  const ui = SpreadsheetApp.getUi();

  // Retrieve the BST from Firebase
  const firebaseUrl = 'https://BST.firebaseio.com/bst.json';
  const response = UrlFetchApp.fetch(firebaseUrl);
  const bstJSON = response.getContentText();

  if (!bstJSON) {
    ui.alert('The BST is not initialized. Please load the data first.');
    return;
  }

  // Deserialize the BST
  const bst = JSON.parse(bstJSON);

  // Get the keyword to search for
  const responsePrompt = ui.prompt('Enter the keyword to search:');
  const keyword = responsePrompt.getResponseText().toLowerCase();

  if (!keyword) {
    ui.alert('Please enter a valid keyword.');
    return;
  }

  const startTime = Date.now(); // Start timing

  // Find all occurrences of the keyword
  const results = [];
  findAllOccurrencesInDeserializedBST(bst.root, keyword, results);

  const endTime = Date.now(); // End timing
  const searchTime = ((endTime - startTime)).toFixed(2); // Calculate search time in seconds

  if (results.length > 0) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    results.forEach(result => {
      const range = sheet.getRange(result.row, result.col);
      range.setBackground('yellow'); // Highlight the cell
    });

    ui.alert(`Found ${results.length} occurrence(s) of the keyword "${keyword}" and highlighted the cells.\nSearch Time: ${searchTime} milliseconds`);
  } else {
    ui.alert(`Keyword not found.\nSearch Time: ${searchTime} milliseconds`);
  }
}

// Helper function to find all occurrences in the deserialized BST
function findAllOccurrencesInDeserializedBST(node, keyword, results) {
  if (!node) return;

  // Perform in-order traversal
  findAllOccurrencesInDeserializedBST(node.left, keyword, results);
  if (node.word === keyword) {
    results.push({ row: node.row, col: node.col });
  }
  findAllOccurrencesInDeserializedBST(node.right, keyword, results);
}
