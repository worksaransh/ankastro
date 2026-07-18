# AnkJyotish AI — Model Context Protocol (MCP) Architecture Blueprint

This blueprint outlines the technical architecture to make the AnkJyotish AI platform **MCP-ready**. This will enable external AI environments (such as Cursor, Claude Desktop, ChatGPT, Gemini, and local LLMs) to securely query the database, generate reports, update the CMS, translate assets, and audit analytics.

---

## 1. System Topology

The AnkJyotish MCP Server operates as a bridge between the **External AI Host** (using the Model Context Protocol) and the **Supabase Database & Edge Functions**.

```
┌───────────────────────┐
│ External AI Client    │ (e.g. Cursor, Claude Desktop)
└───────────┬───────────┘
            │
            │ JSON-RPC 2.0 (via stdio or SSE)
            ▼
┌──────────────────────────────────────────────────────┐
│ AnkJyotish Unified MCP Server (Node.js Express / SDK)│
└───────────┬──────────────────────────────────────────┘
            │
            ├─────────────── Fetch / Mutation ──────────────┐
            ▼                                               ▼
┌───────────────────────┐                       ┌───────────────────────┐
│ Supabase PostgreSQL   │                       │ Supabase Edge         │
│ (Tables, CMS, Logs)   │                       │ (generate-report-ai)  │
└───────────────────────┘                       └───────────────────────┘
```

---

## 2. Server Implementation Protocol

The server will be built in **TypeScript** using the official `@modelcontextprotocol/sdk`. It can run locally over `stdio` for developers, or be deployed to a cloud server (Hostinger VPS / fly.io) exposing a secure **SSE (Server-Sent Events)** endpoint protected by API token verification.

### 2.1 Dependency Requirements
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.6.0",
    "@supabase/supabase-js": "^2.39.0",
    "dotenv": "^16.4.5"
  }
}
```

---

## 3. Tool Specifications & Schemas

The MCP server exposes 8 primary tools to the AI host.

### 3.1 `get_user_profile`
Retrieves a consolidated User Intelligence Profile (DOB, psychic/destiny numbers, goals, challenges, and purchased reports).
- **Arguments**:
  - `email` (string, required): The user's email address.
- **Output**: Detailed JSON representation of the profile.

### 3.2 `generate_report_edge`
Triggers the backend Supabase Edge Function to compile a specialized report (e.g. Name Correction, Career Prediction) for the user.
- **Arguments**:
  - `user_id` (string, required): Target user ID.
  - `report_key` (string, required): E.g., `career_numerology`, `name_correction`.
  - `language` (string, optional): `en` | `hi` | `hinglish`. Default: `en`.

### 3.3 `create_blog_draft`
Creates a new programmatic blog post inside the CMS matching SEO target keywords.
- **Arguments**:
  - `title` (string, required): Title of the post.
  - `content` (string, required): HTML/Markdown content body.
  - `category` (string, required): Category folder (e.g., `remedies`, `numbers`).
  - `slug` (string, required): URL-friendly string.
  - `keywords` (array of strings, optional): Meta keyword tags.
  - `language` (string, optional): `en` | `hi` | `hinglish`.

### 3.4 `sync_remedies_data`
Updates or inserts planetary remedy entries in the knowledge base.
- **Arguments**:
  - `number` (number, required): Root number (1-9).
  - `remedy_text` (string, required): Text of the remedy.
  - `gemstone` (string, optional): Auspicious gemstone details.
  - `language` (string, required): `en` | `hi` | `hinglish`.

### 3.5 `manage_page_blocks`
Updates dynamic content blocks on the landing page builder.
- **Arguments**:
  - `slug` (string, required): Target page slug.
  - `block_key` (string, required): E.g., `hero_text`, `features`.
  - `content` (object, required): JSON block content matching the page schema.

### 3.6 `update_translations`
Inserts or overrides translation keys inside the localized static site content dictionary.
- **Arguments**:
  - `key` (string, required): Static lookup key.
  - `language` (string, required): `en` | `hi` | `hinglish`.
  - `value` (string, required): Translated string.

### 3.7 `optimize_page_seo`
Overwrites meta tags and generates GEO/AEO schemas for dynamic sitemaps.
- **Arguments**:
  - `slug` (string, required): Page route identifier.
  - `meta_title` (string, required): Target title.
  - `meta_description` (string, required): Brief search description.
  - `faq_json` (array of FAQ objects, optional): Answer Engine schemas.

### 3.8 `retrieve_user_analytics`
Reports core growth metrics for admin review.
- **Arguments**:
  - `days_back` (number, optional): Data range (default: 30 days).
- **Output**: Daily registration trends, transaction amounts, and report conversion percentages.

---

## 4. Node.js MCP Server Code Template

Below is the entry point template (`server.ts`) for the MCP integration server:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypasses RLS securely for admin actions
);

const server = new Server(
  { name: "ankjyotish-ai-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 1. List Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_user_profile",
        description: "Fetch consolidated User Intelligence Profile.",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "User email address" }
          },
          required: ["email"]
        }
      },
      {
        name: "create_blog_draft",
        description: "Create a blog draft inside the CMS.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            slug: { type: "string" },
            category: { type: "string" }
          },
          required: ["title", "content", "slug", "category"]
        }
      }
    ]
  };
});

// 2. Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_user_profile": {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", args.email)
          .single();
        if (error) throw error;
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      }
      
      case "create_blog_draft": {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert({
            title: args.title,
            content: args.content,
            slug: args.slug,
            category: args.category,
            status: "draft"
          })
          .select();
        if (error) throw error;
        return { content: [{ type: "text", text: `Draft created successfully. ID: ${data[0].id}` }] };
      }

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (err: any) {
    return {
      isError: true,
      content: [{ type: "text", text: err.message || "Unknown execution error" }]
    };
  }
});

// 3. Start Server Transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AnkJyotish MCP Server running on Stdio transport.");
}

run();
```

---

## 5. Security Protocols & Safeguards

1. **Service Role Restrictions**: The MCP server is executed using Supabase's `service_role` key to write CMS and SEO configurations. It must never expose arbitrary SQL queries (`raw-sql-executor`) to prevent SQL injection vulnerabilities.
2. **Access Token Handshake**: For SSE-based endpoints, all incoming HTTP requests must supply an authorization header:
   `Authorization: Bearer <mcp_token_secret>`
3. **Audit Log Logging**: Every write action executed by the MCP server must register a record inside the `admin_audit_log` table stating the action type, timestamp, target entity, and client metadata.
