## OpenSearch GPT

A personalised AI search engine that learns about you and your interests as you browse the web.

It's like a perplexity / searchGPT clone, but for _you_.

![screenshot](https://opensearch-ai.pages.dev/screenshot.png)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:supermemoryai/opensearch-ai.git
cd opensearch-ai
```

### 2. Install Dependencies

Make sure you have [Bun](https://bun.sh) installed. Then, run:

```bash
bun install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure the necessary environment variables:

```bash
cp .env.example .env
```

- **OpenAI API Key**: Add your OpenAI API key in the `.env` file under `OPENAI_API_KEY`.
- **Google Client ID and Secret**: Follow the instructions [here](https://next-auth.js.org/providers/google) to create a Google Client ID and Secret. Add these to the `.env` file.
- **Next Auth Security Key**: Generate a random secret for Next Auth and add it to the `.env` file under `BACKEND_SECURITY_KEY`.
- **MEM0 and Brave Search API Keys**: Create API keys for MEM0 and Brave Search, then add them to the `.env` file under `MEM0_API_KEY` and `SEARCH_API_KEY` respectively.

### 4. Start the Application

Run the development server with:

```bash
bun dev
```

### Powered by

- [Mem0](https://mem0.ai) - Automatic memory collection and retrival
- [Brave Search API](https://brave.com/search/api/) - Access an index of billions of pages with a single call.
- [Vercel AI ADK](https://github.com/vercel/ai) - A framework for building AI applications
- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Shadcn UI](https://tailwindui.com/) - A set of completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS
- [Cobe](https://github.com/shuding/cobe) - Globe animation
- [GPT-4o-mini](https://openai.com)
- [Cloudflare Pages](https://pages.cloudflare.com/) - A platform for building and deploying web applications

Built by [Supermemory.ai](https://supermemory.ai) team.
