---
name: snap-to-stack
description: Convert UI screenshots, Figma mockups, and hand-drawn wireframes into production-ready React + Tailwind CSS code using Google Gemma 4.
author: amanmaurya92
version: 1.0.0
license: MIT
metadata:
  model: gemma-4
  open_weight: true
  provider: google-genai
---

# SnapToStack Agent Skill

> Compliant with the [Agent Skill Open Standard](https://agentskills.io).

This skill enables AI coding agents (Claude Code, Cursor, Copilot, Antigravity) to ingest visual UI mockups, screenshots, or hand-drawn sketches and compile them into clean, responsive React + Tailwind CSS components.

## When to Use This Skill
- When asked to convert a screenshot, wireframe, or mockup image into web code.
- When prototyping frontend components from visual design assets.
- When performing design-to-code extraction and preserving visual fidelity (colors, typography, spacing).

## Execution Workflow
1. **Visual Ingestion**: Load the input image file (PNG, JPG, WebP) and encode as Base64.
2. **Layout Decomposition**: Use **Google Gemma 4** (`gemma-4` multimodal) via the Gemini API to analyze:
   - Component hierarchy (Nav, Hero, Grid, Cards, Modals).
   - Design tokens (Color palette hex codes, spacing scales, border radiuses).
   - Interactive UI elements (buttons, inputs, dropdowns).
3. **Code Synthesis**: Output a single-file or modular React component styled exclusively with modern Tailwind CSS classes.
4. **Validation**: Test the component inside a sandboxed browser environment with Tailwind CDN loaded.

## CLI Usage

```bash
# Analyze a screenshot and generate a React component
python -m backend.main --image path/to/mockup.png --stack react-tailwind --output App.tsx
```

## Input Parameters
- `image` (string, required): Path or base64 data URI of the design image.
- `stack` (string, default: `react-tailwind`): Target code framework (`react-tailwind`, `html-tailwind`, `vue-tailwind`).
- `design_system` (string, optional): Specific design conventions (e.g. `dark-mode`, `glassmorphism`, `minimalist`).
