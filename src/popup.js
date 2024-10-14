import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

let model = null;
const EMBEDDINGS_KEY = 'tfjs_embeddings';
const MODEL_INFO_KEY = 'use_model_info';

async function loadModel() {
    if (model) return;

    try {
        await tf.ready();
        if (tf.getBackend() !== 'webgl') {
            await tf.setBackend('webgl');
        }
        console.log('Using WebGL backend');
    } catch (e) {
        console.log('WebGL not supported, using CPU');
        await tf.setBackend('cpu');
    }

    const cachedModelInfo = await chrome.storage.local.get(MODEL_INFO_KEY);
    if (cachedModelInfo[MODEL_INFO_KEY]) {
        try {
            model = await use.load({ modelUrl: 'indexeddb://use-model' });
            console.log('Loaded model from cache');
            return;
        } catch (e) {
            console.log('Failed to load cached model, loading from remote');
        }
    }

    model = await use.load();
    await cacheModel();
    console.log('Universal Sentence Encoder model loaded and cached');
}

async function cacheModel() {
    const modelArtifacts = await model.model.save('indexeddb://use-model');
    await chrome.storage.local.set({
        [MODEL_INFO_KEY]: {
            date: new Date().toISOString(),
            modelArtifactsInfo: modelArtifacts
        }
    });
}

async function getEmbedding(text) {
    if (!model) {
        await loadModel();
    }

    const cachedEmbedding = await getCachedEmbeddings(text);
    if (cachedEmbedding) {
        console.log('Using cached embedding');
        return [cachedEmbedding];
    }

    console.log('Generating new embedding');
    const embeddings = await model.embed([text]);
    const result = Array.from(await embeddings.array());
    await cacheEmbeddings(text, result[0]);
    return result;
}

async function getCachedEmbeddings(text) {
    const result = await chrome.storage.local.get(EMBEDDINGS_KEY);
    const embeddings = result[EMBEDDINGS_KEY] || {};
    return embeddings[text];
}

async function cacheEmbeddings(text, embedding) {
    const result = await chrome.storage.local.get(EMBEDDINGS_KEY);
    const embeddings = result[EMBEDDINGS_KEY] || {};
    embeddings[text] = embedding;
    await chrome.storage.local.set({ [EMBEDDINGS_KEY]: embeddings });
}

document.addEventListener('DOMContentLoaded', () => {
    const embedButton = document.getElementById('embed');
    const inputText = document.getElementById('input');
    const outputDiv = document.getElementById('output');
    const statusDiv = document.getElementById('status');

    embedButton.addEventListener('click', async () => {
        const text = inputText.value;
        if (!text) {
            outputDiv.textContent = 'Please enter some text.';
            return;
        }

        statusDiv.textContent = 'Generating embedding...';
        embedButton.disabled = true;

        try {
            const embedding = await getEmbedding(text);
            outputDiv.textContent = JSON.stringify(embedding[0], null, 2);
            statusDiv.textContent = 'Embedding generated successfully.';
        } catch (error) {
            outputDiv.textContent = `Error: ${error.message}`;
            statusDiv.textContent = 'An error occurred.';
        } finally {
            embedButton.disabled = false;
        }
    });

    // Start loading the model as soon as the popup opens
    statusDiv.textContent = 'Loading model...';
    loadModel().then(() => {
        statusDiv.textContent = 'Model loaded and ready.';
    }).catch(error => {
        statusDiv.textContent = `Error loading model: ${error.message}`;
        console.error('Error loading model:', error);
    });
});