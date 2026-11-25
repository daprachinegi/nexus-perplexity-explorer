import { computeStableTokenProbability, calculatePerplexityFromProbabilities, formatTokenDisplay } from './math';
import { TokenResult, NextTokenPrediction, PerplexityResult } from '../types';

let tokenizerInstance: any = null;
let modelInstance: any = null;
let TensorClass: any = null;
let isLoading = false;

export type ProgressCallback = (message: string, progress?: number) => void;

/**
 * Dynamically resolves Transformers.js AutoTokenizer, AutoModelForCausalLM, and Tensor
 * Supports both bundled npm package and CDN ESM fallback.
 */
async function getTransformersLib() {
  if (tokenizerInstance && modelInstance && TensorClass) {
    return { AutoTokenizer: null, AutoModelForCausalLM: null, Tensor: TensorClass };
  }

  // Load browser-compatible Transformers.js from CDN (identical to reference site)
  try {
    // @ts-ignore
    const cdnUrl = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3';
    // @ts-ignore
    const tf = await import(/* @vite-ignore */ cdnUrl);
    TensorClass = tf.Tensor;
    return tf;
  } catch (err) {
    console.error('Failed to load Transformers.js from CDN:', err);
    throw new Error('Could not load browser neural runtime. Check your internet connection.');
  }
}

/**
 * Lazy loads Xenova/distilgpt2 (q8) and its tokenizer
 */
export async function loadDistilGPT2Model(onProgress?: ProgressCallback) {
  if (modelInstance && tokenizerInstance) {
    return { tokenizer: tokenizerInstance, model: modelInstance };
  }

  if (isLoading) {
    throw new Error('Model is already loading');
  }

  isLoading = true;

  try {
    onProgress?.('Initializing neural runtime…', 5);
    const { AutoTokenizer, AutoModelForCausalLM } = await getTransformersLib();

    onProgress?.('Fetching DistilGPT-2 tokenizer…', 15);
    tokenizerInstance = await AutoTokenizer.from_pretrained('Xenova/distilgpt2', {
      progress_callback: (p: any) => {
        if (p.status === 'progress' && p.file) {
          const pct = Math.round(p.progress || 0);
          onProgress?.(`Downloading tokenizer: ${pct}% (${p.file})`, 15 + pct * 0.15);
        }
      }
    });

    onProgress?.('Downloading quantized model weights (q8)…', 30);
    modelInstance = await AutoModelForCausalLM.from_pretrained('Xenova/distilgpt2', {
      dtype: 'q8',
      progress_callback: (p: any) => {
        if (p.status === 'progress' && p.file) {
          const pct = Math.round(p.progress || 0);
          onProgress?.(`Loading model weights: ${pct}% (${p.file})`, 30 + pct * 0.65);
        }
      }
    });

    onProgress?.('Neural network loaded and ready', 100);
    return { tokenizer: tokenizerInstance, model: modelInstance };
  } catch (error: any) {
    tokenizerInstance = null;
    modelInstance = null;
    throw error;
  } finally {
    isLoading = false;
  }
}

export interface ModelInferenceResult {
  tokenResults: TokenResult[];
  perplexityMath: PerplexityResult;
  nextTokens: NextTokenPrediction[];
}

/**
 * Evaluates sentence perplexity and next token predictions using DistilGPT-2
 */
export async function runSentenceInference(
  sentence: string,
  onProgress?: ProgressCallback
): Promise<ModelInferenceResult> {
  const trimmed = sentence.trim();
  if (!trimmed) {
    throw new Error('Sentence input cannot be empty.');
  }

  // Ensure model is loaded
  await loadDistilGPT2Model(onProgress);

  onProgress?.('Tokenizing input sequence…', 95);

  // 1. Encode text to token IDs
  const encoded = await tokenizerInstance.encode(trimmed);
  let rawIds: number[] = [];
  if (Array.isArray(encoded)) {
    rawIds = encoded.map(Number);
  } else if (encoded && encoded.data) {
    rawIds = Array.from(encoded.data).map(Number);
  } else {
    const fallback = await tokenizerInstance(trimmed);
    rawIds = Array.from(fallback.input_ids.data).map(Number);
  }

  if (rawIds.length === 0) {
    throw new Error('Tokenizer produced 0 tokens for the given input.');
  }

  onProgress?.('Running forward inference pass…', 98);

  // 2. Prepend start-of-sequence token 50256 (<|endoftext|>)
  // so the first word gets evaluated under conditional probability
  const allIds = [50256, ...rawIds];
  const n = allIds.length;

  // 3. Construct input tensors
  const input_ids = new TensorClass('int64', BigInt64Array.from(allIds.map(BigInt)), [1, n]);
  const attention_mask = new TensorClass('int64', new BigInt64Array(n).fill(1n), [1, n]);

  // 4. Run model forward pass
  const output = await modelInstance({ input_ids, attention_mask });
  const logits = output.logits; // shape [1, n, vocabSize]
  const vocabSize = logits.dims[2];
  const logitsData = logits.data as Float32Array;

  // 5. Compute probability for each input token from logits at preceding position
  const tokenResults: TokenResult[] = [];
  const probsArray: number[] = [];

  for (let i = 0; i < rawIds.length; i++) {
    const tokenId = rawIds[i];
    const prevPosition = i; // preceding position in allIds
    const logitsSlice = logitsData.subarray(prevPosition * vocabSize, (prevPosition + 1) * vocabSize);

    const prob = computeStableTokenProbability(logitsSlice, tokenId);
    probsArray.push(prob);

    // Decode token string
    const decodedStr = await tokenizerInstance.decode([tokenId]);
    const displayToken = formatTokenDisplay(decodedStr);

    tokenResults.push({
      index: i + 1,
      tokenId,
      displayToken,
      prob,
      surprise: 1 / Math.max(prob, 1e-15)
    });
  }

  // 6. Compute 3-step Perplexity
  const perplexityMath = calculatePerplexityFromProbabilities(probsArray);

  // 7. Extract Top 8 Next Token Predictions from the final position logits
  const lastPos = n - 1;
  const lastLogits = logitsData.subarray(lastPos * vocabSize, n * vocabSize);

  let lastMaxLogit = -Infinity;
  for (let j = 0; j < vocabSize; j++) {
    if (lastLogits[j] > lastMaxLogit) lastMaxLogit = lastLogits[j];
  }

  let lastSumExp = 0;
  for (let j = 0; j < vocabSize; j++) {
    lastSumExp += Math.exp(lastLogits[j] - lastMaxLogit);
  }

  // Find top 8
  const top8: Array<{ id: number; logit: number }> = [];
  for (let j = 0; j < vocabSize; j++) {
    const logit = lastLogits[j];
    if (top8.length < 8) {
      top8.push({ id: j, logit });
      top8.sort((a, b) => b.logit - a.logit);
    } else if (logit > top8[7].logit) {
      top8[7] = { id: j, logit };
      top8.sort((a, b) => b.logit - a.logit);
    }
  }

  const nextTokens: NextTokenPrediction[] = [];
  for (let r = 0; r < top8.length; r++) {
    const item = top8[r];
    const prob = Math.exp(item.logit - lastMaxLogit) / lastSumExp;
    const decoded = await tokenizerInstance.decode([item.id]);
    const displayToken = formatTokenDisplay(decoded);

    nextTokens.push({
      rank: r + 1,
      id: item.id,
      displayToken,
      prob,
      percent: (prob * 100).toFixed(1),
      isTop: r === 0
    });
  }

  onProgress?.('Evaluation complete', 100);

  return {
    tokenResults,
    perplexityMath,
    nextTokens
  };
}

