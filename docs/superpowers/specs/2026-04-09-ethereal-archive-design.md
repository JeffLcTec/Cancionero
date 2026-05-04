---
name: Ethereal Archive Design
description: A minimalist, sacred modern UI/UX for the church songbook manager.
type: project
---

# Ethereal Archive Design Specification

**Date:** 2026-04-09
**Status:** Approved

## Vision
To transform the "Sistema de Creación de Canciones" into a high-end, "sacred modern" digital experience. The design follows the "Ethereal Archive" concept: a peaceful, light-filled, and minimalist interface that feels like a digital manuscript, evoking a sense of reverence and purity.

## Visual Language

### 1. Color Palette (High-Key / Divine Light)
*   **Primary Background**: `#FCFAF7` (Warm Ivory) - Provides a soft, non-stark foundation.
*   **Accent (Sacred Gold)**: `#C5A059` (Muted Gold) - Used for primary actions, active states, and critical hierarchy.
*   **Text Hierarchy**:
    *   **Primary**: `#2D2926` (Deep Espresso) - High legibility, softer than pure black.
    *   **Secondary**: `#7D746D` (Warm Taupe) - For labels and secondary metadata.
*   **Glass Layers**: White with `10-20%` opacity and `20px+` backdrop blur.

### 2. Typography
*   **Display (Titles/Song Names)**: *Cormorant Garamond* (Serif) - Elegant, traditional, and authoritative.
*   **UI/Interface (Labels/Buttons)**: *Inter* (Sans-serif) - Clean, modern, with increased tracking for a "gallery" feel.
*   **Body (Lyrics)**: *Lora* (Serif) - Optimized for long-form reading while maintaining a classic aesthetic.

### 3. The "Artistry" (Modern Details)
*   **Ambient Light**: Slow-moving, large, blurred radial gradients in gold and cream in the background to simulate sunlight filtering through windows.
*   **Floating Glass**: Components use a `1px` translucent white stroke and soft, wide `box-shadow` to simulate depth and refraction.
*   **Micro-interactions**: Subtle "lift" on hover, "pop" on selection, and "materialization" animations for modals.

## Component Architecture

### 1. Core Components
*   **`GlassCard`**: The fundamental container. Uses `backdrop-filter: blur(20px)`, a `1px` translucent stroke, and soft shadows.
*   **`FloatingHeader` (Command Center)**: A centered, glass-effect bar containing the "Ministerio de Alabanza" label, the "Cancionero" title, and minimal song/selection counters.
*   **`SacredButton`**: Buttons with refined gold accents or subtle glass effects, featuring smooth hover/active state transitions.

### 2. Key Views
*   **Song Management View**: A clean, breathable list of songs using `GlassCard` items.
*   **Lyric/Song Detail View**: A "Focus Mode" that dims the background and elevates the song content, with chords styled in `Sacred Gold`.
*   **Modals (Add/Edit)**: "Materializing" overlays that fade and scale up smoothly.

## Interaction Model
*   **Responsiveness**: Adaptive layout. On mobile, the header collapses into a compact floating bar; on desktop, it expands into a sophisticated command center.
*   **Fluidity**: All transitions (modals, view changes, selections) use smooth, eased animations (e.g., `300ms ease-out`).
*   **Tactile Feedback**: Subtle scaling and shadow changes to provide a sense of presence and response.

## Implementation Roadmap
1.  **Foundation**: Setup global CSS (colors, typography, ambient light animation).
2.  **Core Components**: Build `GlassCard`, `FloatingHeader`, and `SacredButton`.
3.  **Layout Refactor**: Rebuild `SongManager` with the new component-based architecture.
4.  **Refinement**: Implement micro-interactions, advanced transitions, and mobile optimization.
