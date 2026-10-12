# Cancionero Digital

Song management web app for building and organizing a personal songbook. Designed in Figma and implemented with React and TypeScript.

**Live demo:** https://cancionero-gray.vercel.app

## Features

- Add, edit and delete songs (with a confirmation step before deleting)
- Real-time search, sorted alphabetically with Spanish collation
- Grid / list view toggle
- Song selection with a numbered order, exported as a **PDF songbook** (jsPDF)
- Toast notifications for every action
- Client-side persistence: songs are stored in the browser

## Tech stack

React · TypeScript · Vite · Tailwind CSS · Radix UI · Lucide icons · jsPDF · Sonner · Deployed on Vercel

## Run it locally

```bash
npm install
npm run dev
```

## Notes

The initial UI was exported from a Figma design and then extended with the song management logic, selection flow and PDF generation.
