import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>GitMesh CE Documentation</span>,
  project: {
    link: 'https://github.com/LF-Decentralized-Trust-labs/gitmesh',
  },
  chat: {
    link: 'https://discord.gg/gitmesh-ce',
  },
  docsRepositoryBase: 'https://github.com/LF-Decentralized-Trust-labs/gitmesh/tree/main/docs/nextra',
  footer: {
    text: 'GitMesh CE Documentation',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – GitMesh CE'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="GitMesh CE Documentation" />
      <meta property="og:description" content="Open-source developer data platform documentation" />
    </>
  ),
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
  },
}

export default config