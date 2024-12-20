# Google Sheets Keyword Search Add-on

This repository contains the implementation of a keyword search add-on for Google Sheets, designed to improve search performance and scalability using a Binary Search Tree (BST) and Firebase Firestore.

## Key Features

- **Efficient Keyword Search**: Utilizes a Binary Search Tree (BST) with logarithmic time complexity (O(log n)) for rapid keyword searches.
- **Firebase Integration**: Ensures data persistence and scalability by storing the BST in Firebase Firestore.
- **Dynamic Search**: Supports both partial and exact keyword matching.
- **Result Highlighting**: Automatically highlights matching cells in Google Sheets for easy identification.

## How It Works

1. **Data Loading**:
   - The dataset from the Google Sheet is parsed, normalized, and inserted into a BST.
   - The BST is serialized to JSON and uploaded to Firebase Firestore for persistence.

2. **Keyword Search**:
   - The BST is retrieved from Firebase Firestore.
   - The binary search algorithm is applied to find matches efficiently.
   - Matching cells are highlighted in Google Sheets.

## Setup Instructions

### Prerequisites
- A Google account with access to Google Sheets.
- A Firebase project with Firestore enabled.

### Steps to Configure

1. **Clone or Download**
   Clone this repository or download the code files.

2. **Set Up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database.
   - Replace `<your-project-id>` in the code with your Firebase project ID.

3. **Deploy the Script**
   - Open your Google Sheet.
   - Go to `Extensions > Apps Script`.
   - Copy and paste the provided code into the Apps Script editor.
   - Save the project.

4. **Run the Add-On**
   - Reload your Google Sheet.
   - Access the add-on via the menu: `Custom Add-on > Load Data into BST`.
   - Once loaded, use `Custom Add-on > Search Keyword` to perform searches.

## Usage

### Loading Data
- The `Load Data into BST` option processes the Google Sheet's content, builds a BST, and uploads it to Firebase Firestore.
- A progress sidebar shows the loading status.

### Searching Keywords
- The `Search Keyword` option retrieves the BST from Firestore and searches for the entered keyword.
- Matching cells are highlighted in yellow within the Google Sheet.

## Performance
- **Insertion Time Complexity**: \(O(n \log n)\) (one-time during data loading).
- **Search Time Complexity**: \(O(\log n)\) (per search query).
- **Comparison with Native Search**: The add-on demonstrates superior scalability and performance compared to Google Sheets' native `Ctrl + F` functionality.

## Example Dataset
- A sample dataset of 2,000 e-commerce item names is provided for testing.

## Limitations
- Rebuilding the BST is required for dynamic updates (e.g., adding new rows).
- Requires an active internet connection to interact with Firebase.

## Contributing
Feel free to submit issues or contribute by creating a pull request. Suggestions and improvements are always welcome!

## License
This project is licensed under the MIT License. See the LICENSE file for details.
