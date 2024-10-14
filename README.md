# Use Embeddings Browser Extension

## Description

This browser extension generates text embeddings using the Universal Sentence Encoder model from TensorFlow.js. It allows users to input text and receive corresponding embeddings, which can be useful for various NLP tasks.

## Features

- Generate embeddings for user-input text
- Uses TensorFlow.js and Universal Sentence Encoder model
- Works as a browser extension

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/Arunprakaash/use-embeddings-browser-extension.git
   ```

2. Navigate to the project directory:
   ```
   cd use-embeddings-browser-extension
   ```

3. Install dependencies:
   ```
   yarn install
   ```

4. Build the extension:
   ```
   yarn build
   ```

5. Load the extension in your browser:
   - Open your browser's extension page (e.g., `chrome://extensions/` for Chrome)
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder in your project directory

## Development

To work on the extension in development mode:

1. Run the development script:
   ```
   yarn dev
   ```

2. Make changes to the files in the `src` directory
3. The extension will automatically rebuild when you save changes

## Scripts

- `yarn build`: Build the extension for production
- `yarn dev`: Run the extension in development mode with auto-rebuilding
- `yarn watch`: Watch for changes and rebuild (part of `dev` script)
- `yarn copy`: Copy necessary files to the `dist` directory

## Dependencies

- @tensorflow-models/universal-sentence-encoder
- @tensorflow/tfjs

## Screenshot

![screenshot](/static/screenshot.png "screenshot")