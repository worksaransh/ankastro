# 🚀 AnkJyotish SEO & Automated Blogging MCP Server

This Model Context Protocol (MCP) server allows AI assistants (Claude Desktop, ChatGPT, Cursor, or custom AI agents) to research keywords, generate 1500+ word SEO blog posts, and **publish them directly to the live AnkJyotish AI website**.

---

## 🛠️ Available MCP Tools

| Tool Name | Purpose | Example Input |
|---|---|---|
| 📝 **`publish_blog_post`** | Creates & publishes an SEO blog post directly into Supabase DB. | `{ "title": "...", "slug": "mulank-8-career", "content": "...", "category": "Career", "excerpt": "..." }` |
| 📚 **`list_blog_posts`** | Lists all articles (published or drafts) with reading times & dates. | `{ "published_only": true, "limit": 10 }` |
| ✏️ **`update_blog_post`** | Updates title, content, meta tags, or publish state of an article. | `{ "slug": "mulank-8-career", "meta_title": "..." }` |
| 🗑️ **`delete_blog_post`** | Removes or unpublishes an article. | `{ "slug": "old-post-slug" }` |
| 🔑 **`get_seo_keywords`** | Retrieves high-intent Vedic numerology keywords & suggested titles. | `{ "category": "Career" }` |
| 🌐 **`generate_blog_schema`** | Auto-generates Article & FAQPage JSON-LD schema markup. | `{ "slug": "mulank-8-career" }` |
| 📊 **`get_blog_analytics`** | Reports total published articles, drafts, and category distribution. | `{}` |

---

## ⚙️ How to Connect to Claude Desktop

1. Open your Claude Desktop config file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the `ankjyotish-seo-mcp` server:

```json
{
  "mcpServers": {
    "ankjyotish-seo-mcp": {
      "command": "node",
      "args": [
        "d:/AI/AnkJyotish_FINAL/project/scripts/mcp-server/server.js"
      ],
      "env": {
        "SUPABASE_URL": "https://kassdsugfktqptsxzqhr.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "YOUR_SUPABASE_SERVICE_ROLE_KEY"
      }
    }
  }
}
```

3. Restart Claude Desktop.

---

## 💬 Sample Prompts for AI

### 1. High-Traffic Article Creation & Direct Publishing
> *"Use `get_seo_keywords` to find a high-volume keyword in Career. Write a comprehensive 1500-word SEO article in Hindi and publish it directly using `publish_blog_post`."*

### 2. SEO Meta & Schema Optimization
> *"Fetch all published blog posts using `list_blog_posts`. For each post, generate Article and FAQPage schema using `generate_blog_schema` and update its meta tags."*

### 3. Content Audit
> *"Run `get_blog_analytics` and give me a summary of published articles vs drafts."*

---

## 🌐 Live Blog URL Format
Published articles will instantly appear on your site at:
`https://ankjyotish.com/blog/<slug>`
