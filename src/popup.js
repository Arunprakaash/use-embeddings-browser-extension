import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

let model = null;

async function loadModel() {
    try {
        await tf.setBackend('webgl');
        console.log('Using WebGL backend');
    } catch (e) {
        console.log('WebGL not supported, switching to WASM');
        await tf.setBackend('wasm');
    }

    await tf.ready();

    if (!model) {
        model = await use.load();
        console.log('Universal Sentence Encoder model loaded');
        chrome.runtime.sendMessage({ action: 'log', message: 'Model loaded successfully' });
    }
}

async function getEmbedding(text) {
    if (!model) {
        await loadModel();
    }

    const embeddings = await model.embed([text]);
    return Array.from(await embeddings.array());
}

document.addEventListener('DOMContentLoaded', () => {
    const embedButton = document.getElementById('embed');
    const inputText = document.getElementById('input');
    const outputDiv = document.getElementById('output');

    embedButton.addEventListener('click', async () => {
        const text = inputText.value;
        try {
            const embedding = await getEmbedding(text);
            outputDiv.textContent = JSON.stringify(embedding[0], null, 2);
            chrome.runtime.sendMessage({ action: 'log', message: 'Embedding generated successfully' });
        } catch (error) {
            outputDiv.textContent = `Error: ${error.message}`;
            chrome.runtime.sendMessage({ action: 'log', message: `Error: ${error.message}` });
        }
    });

    // Start loading the model as soon as the popup opens
    loadModel().catch(error => {
        outputDiv.textContent = `Error loading model: ${error.message}`;
        chrome.runtime.sendMessage({ action: 'log', message: `Error loading model: ${error.message}` });
    });
});