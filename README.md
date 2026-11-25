# NEXUS // PERPLEXITY EXPLORER

An interactive, client-side educational platform exploring token probabilities, surprise, and perplexity running **DistilGPT-2** directly inside the browser — designed under the **NEXUS** frontier technology brand identity.

Recreation and visual evolution of [perplexityexplorer.vercel.app](https://perplexityexplorer.vercel.app/).

---

## ✦ Key Features

- **In-Browser Neural Runtime**: Runs quantized 8-bit DistilGPT-2 (`Xenova/distilgpt2`, Q8) client-side using Transformers.js and ONNX WebAssembly. Zero API keys, zero backend servers.
- **Section 1 · Sentence Input & Evaluation**: Input custom text sequences or select from curated sample sentences (`"I love Python"`, `"Python love I"`, `"The capital of France is Paris"`).
- **Section 2 · Token Probabilities & Perplexity**: Tokenizes the sequence, prepends start token `<|endoftext|>` (`50256`) for initial token conditional evaluation, applies stable softmax over logits, and breaks down perplexity into 3 clear steps:
  1. **Multiply Surprise Values**: $S_i = 1 / P_i$
  2. **Sequence Length**: Number of evaluated tokens $N$
  3. **Perplexity**: Geometric mean $\text{Perplexity} = (\prod S_i)^{1/N} = \exp\left(\frac{1}{N} \sum -\ln P_i\right)$
- **Section 3 · Next Token Predictions**: Renders the top 8 continuation tokens predicted from the final sequence position with probability bars and the `#1 Top Pick` badge.
- **Section 4 · Manual Simulator**: Interactive sandbox with live updates as you type, token addition/deletion, input validation ($0 < P \le 1$), and 3 curated presets:
  - `"I love Python"`: $(0.5, 0.8, 0.2) \rightarrow \text{Perplexity} = 2.32$
  - `"All 1/8"`: 8 tokens at $0.125 \rightarrow \text{Perplexity} = 8.00$
  - `"One surprising word"`: $(0.9, 0.9, 0.9, 0.01)$
- **NEXUS Visual Identity**:
  - Precision vector recreation of the angular geometric NEXUS monogram and wordmark.
  - Dark architectural color palette: NEXUS Amber (`#FFAC2F`), Deep Amber (`#E99519`), Pure Black (`#050505`), Charcoal (`#151515`), and Dark Surface (`#1D1D1D`).
  - Typography: Space Grotesk (headings), Inter (interface), and JetBrains Mono (tokens & numerical values).
  - Fully responsive across desktop, laptop, tablet, and mobile screens.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Neural Runtime**: `@huggingface/transformers` v3 (DistilGPT-2 Q8) + ONNX Runtime WebAssembly
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

Node.js (v18+) and npm.

### Installation

```bash
git clone https://github.com/daprachinegi/nexus-perplexity-explorer.git
cd nexus-perplexity-explorer
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📐 Brand Statement

> *"NEXUS is the operational bridge between frontier technology and human understanding."*
