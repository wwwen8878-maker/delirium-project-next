'use client'

import React from 'react'

/**
 * Renders a professional, multi-layered background.
 * This component should be placed at the root of your layout.
 * The styling is handled globally in `globals.css` via the `.professional-background` class.
 */
export function MedicalBackground() {
  return <div className="professional-background" />
}

// For consistency and potential future variations, we keep the named export.
export const DefaultBackground = MedicalBackground
