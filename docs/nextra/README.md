# GitMesh CE Documentation

This is the new open-source documentation for GitMesh CE, built with [Nextra](https://nextra.site/).

## Development

To run the documentation locally:

```bash
npm install
npm run dev
```

The documentation will be available at `http://localhost:3001`.

## Building

To build the documentation:

```bash
npm run build
```

## Deployment

The documentation can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

For Vercel deployment, simply connect your repository and Vercel will automatically build and deploy the documentation.

## Migration from GitBook

This documentation has been migrated from GitBook to provide:

- ✅ Open-source solution (no vendor lock-in)
- ✅ Version control with Git
- ✅ MDX support for interactive components
- ✅ Better search functionality
- ✅ Customizable themes
- ✅ Easy deployment to Vercel/Netlify

## Structure

- `pages/` - Documentation pages in MDX format
- `theme.config.tsx` - Nextra theme configuration
- `next.config.js` - Next.js configuration
- `public/` - Static assets

## Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes in the `docs/nextra/pages/` directory
4. Test locally with `npm run dev`
5. Submit a pull request

## Features

- 📝 MDX support for rich content
- 🔍 Built-in search
- 📱 Mobile responsive
- 🌙 Dark mode support
- 🔗 Automatic link checking
- 📊 Analytics ready
- 🚀 Fast static site generation