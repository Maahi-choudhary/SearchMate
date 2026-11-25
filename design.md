---
version: alpha
name: Discord Analysis
description: An analysis of Discord's design language — a loud, playful gaming-native system built on a deep-indigo canvas lit by Blurple, electric green, and vibrant magenta gradients. Heavy ABC Ginto Nord display type shouts in all-caps over generously rounded media, gradient feature panels, and full-bleed Blurple bands; the mood is arcade-energetic, never corporate.

colors:
  primary: "#5865f2"
  on-primary: "#ffffff"
  green: "#35ed7e"
  magenta: "#ec48bd"
  link: "#00b0f4"
  canvas: "#0a0d3a"
  surface-indigo: "#1e2353"
  surface-onyx: "#23272a"
  surface-black: "#000000"
  ink: "#ffffff"
  ink-dark: "#000000"
  muted: "#333333"
  hairline: "#23272a"

typography:
  display-xl:
    fontFamily: ABC Ginto Nord
    fontSize: 82px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: 0
  display-lg:
    fontFamily: ABC Ginto Nord
    fontSize: 62px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: 0
  display-md:
    fontFamily: ABC Ginto Nord
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: 0
  heading-lg:
    fontFamily: ABC Ginto Nord
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0
  heading-sm:
    fontFamily: ABC Ginto Nord
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  body-lg:
    fontFamily: ABC Ginto
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  link-lg:
    fontFamily: ABC Ginto
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body:
    fontFamily: ggsans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  link:
    fontFamily: ABC Ginto
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  link-sm:
    fontFamily: ABC Ginto
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 6px
  sm: 12px
  md: 14px
  lg: 16px
  xl: 40px
  pill: 50px
  jumbo: 120px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  section: 40px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.link}"
    padding: "{spacing.md} {spacing.xl}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.link-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg} {spacing.xl}"
  button-green:
    backgroundColor: "{colors.green}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.link-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.xl}"
  button-white:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.link}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.md}"
  button-ghost:
    backgroundColor: "{colors.surface-indigo}"
    textColor: "{colors.ink}"
    typography: "{typography.link}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  button-ghost-sm:
    backgroundColor: "{colors.surface-indigo}"
    textColor: "{colors.ink}"
    typography: "{typography.link-sm}"
    rounded: "{rounded.xs}"
    padding: "{spacing.sm} {spacing.xxl}"
  hero:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section}"
  feature-card-gradient:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.section}"
  feature-card-dark:
    backgroundColor: "{colors.surface-indigo}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
  showcase-band-black:
    backgroundColor: "{colors.surface-black}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.section}"
  stat-card:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
  step-card:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  cta-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.section}"
  marquee-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.lg}"
  pricing-table:
    backgroundColor: "{colors.surface-indigo}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  game-rank-feature:
    backgroundColor: "{colors.surface-indigo}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  game-rank-row:
    backgroundColor: "{colors.surface-indigo}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
  faq-accordion:
    backgroundColor: "{colors.surface-indigo}"
    textColor: "{colors.ink}"
    typography: "{typography.link-lg}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  badge:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.ink}"
    typography: "{typography.link-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxs} {spacing.sm}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.link}"
    padding: "{spacing.section}"
---

## Overview
Discord's design system — energetic, approachable, and saturated. Primary Blurple (#5865f2), electric green (#35ed7e), vibrant magenta (#ec48bd), and deep-indigo canvas (#0a0d3a / #1e2353).
