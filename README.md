## PrevueMD: A real-time Markdown editor built in Vue 3. [Try it out!](https://bit.ly/prevuemd)

This was the first app I built after learning Vue; from ideation and design to development and deployment. <br>
I did not like the markdown editor on GitHub, so I decided to build my own.

> [Learn about the development process.](https://wazeerc.github.io/blog/learning-vue/)

## Features

- 🚀 Real-time preview as you type
- 💾 Export to markdown file
- 📋 Copy to clipboard functionality

## Usage

1. Begin writing markdown in the editor.
2. See the live preview as you type.
3. Copy or download your code.

## Local Development Setup

1. **Prerequisites**
   - [Node.js](https://nodejs.org/en/download) 16 or higher
   - [pnpm](https://pnpm.io/installation) package manager

2. **Installation**
```
git clone https://github.com/wazeerc/PrevueMD.git
cd PrevueMD
pnpm install
```

3. **Development**
```
pnpm dev        # Start development server
pnpm test       # Run tests
pnpm build      # Build for production
```

4. Access the development server at `http://localhost:5173`

## Built With

- [Playwright](https://playwright.dev/) - E2E testing
- [Remark](https://remark.js.org/) - Plugins
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Unified](https://unifiedjs.com/) - For markdown processing
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [Vitest](https://vitest.dev/) - Unit testing
- [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Vue Toastification](https://github.com/Maronato/vue-toastification) - Toast notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- Icons by [Feather Icons](https://feathericons.com/) & [Vijay](https://3dicons.co/)

## Status

[![CI/CD: Test and Deploy to GCP](https://github.com/wazeerc/PrevueMD/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/wazeerc/PrevueMD/actions/workflows/ci-cd.yml)
[![Coverage Status](https://coveralls.io/repos/github/wazeerc/PrevueMD/badge.svg?branch=main)](https://coveralls.io/github/wazeerc/PrevueMD?branch=main)
