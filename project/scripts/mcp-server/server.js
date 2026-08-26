import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://kassdsugfktqptsxzqhr.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const server = new Server(
  { name: "ankjyotish-ai-mcp", version: "1.2.0" },
  { capabilities: { tools: {} } }
);

// High-intent SEO Keyword Library for AI Assistants
const SEO_KEYWORD_DATABASE = [
  { keyword: "Mulank 8 Marriage & Career in 2026", category: "Career & Life", difficulty: "Low", monthlyVolume: "12,500", intent: "Transactional / Informational", suggestedTitle: "Mulank 8 Horoscope 2026: Saturn Energy, Wealth Peaks & Marriage Timing" },
  { keyword: "Name Spelling Correction for Success", category: "Name Numerology", difficulty: "Medium", monthlyVolume: "24,000", intent: "Transactional", suggestedTitle: "How Name Spelling Correction Can Shift Your Life Frequency by 30%" },
  { keyword: "Mobile Number Numerology Calculator", category: "Mobile Numerology", difficulty: "Medium", monthlyVolume: "18,200", intent: "Tool Search", suggestedTitle: "Is Your Mobile Number Lucky? How to Calculate Mobile Number Vibration" },
  { keyword: "Mulank and Bhagyank Compatibility", category: "Love & Marriage", difficulty: "Low", monthlyVolume: "15,800", intent: "Informational", suggestedTitle: "Mulank vs Bhagyank Difference: How Driver & Destiny Numbers Define Your Life" },
  { keyword: "Lucky Vehicle Number for Business Owners", category: "Vehicle Numerology", difficulty: "Low", monthlyVolume: "8,900", intent: "Transactional", suggestedTitle: "How to Choose a Lucky Vehicle Plate Number for Safety & Prosperity" },
  { keyword: "Master Numbers 11 22 33 Meaning", category: "Core Numerology", difficulty: "High", monthlyVolume: "45,000", intent: "Educational", suggestedTitle: "Master Numbers 11, 22, 33 in Vedic Numerology: Spiritual Power & Challenges" },
  { keyword: "Lo Shu Grid Missing Numbers Remedies", category: "Vedic Remedies", difficulty: "Low", monthlyVolume: "14,100", intent: "Solution Seeking", suggestedTitle: "Complete Lo Shu Grid Remedies: How to Balance Missing Numbers 1 to 9" },
  { keyword: "Lucky Baby Names by Birth Date 2026", category: "Baby Names", difficulty: "Medium", monthlyVolume: "32,000", intent: "Transactional", suggestedTitle: "How to Name Your Baby According to Vedic Numerology for Health & Wealth" }
];

// 1. List Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "publish_blog_post",
        description: "Publish or draft a new SEO-optimized blog post directly into the AnkJyotish CMS. Automatically sets slug, meta tags, reading time, and schema.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Article H1 Title" },
            content: { type: "string", description: "Full article body in markdown or HTML format" },
            slug: { type: "string", description: "SEO URL slug e.g. mulank-8-career-prediction-2026" },
            category: { type: "string", description: "Category: General | Career | Love | Remedies | Name Correction | Mobile Numerology" },
            excerpt: { type: "string", description: "1-2 sentence meta description / summary excerpt" },
            meta_title: { type: "string", description: "SEO Title Tag (< 60 chars)" },
            meta_description: { type: "string", description: "Meta Description Tag (< 160 chars)" },
            keywords: { type: "array", items: { type: "string" }, description: "Focus SEO keywords" },
            author: { type: "string", description: "Author name (default: AnkJyotish Vedic Team)" },
            published: { type: "boolean", description: "True to publish immediately, false for draft" },
            language: { type: "string", description: "en | hi | hinglish (default: en)" }
          },
          required: ["title", "content", "slug", "category", "excerpt"]
        }
      },
      {
        name: "list_blog_posts",
        description: "Fetch existing blog posts from the website CMS with category, search term, and publish status filters.",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", description: "Filter by category" },
            published_only: { type: "boolean", description: "If true, returns only published posts" },
            limit: { type: "number", description: "Number of posts to fetch (default: 20)" }
          }
        }
      },
      {
        name: "update_blog_post",
        description: "Update an existing blog post's content, title, meta description, or publish state.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string", description: "Target blog post slug" },
            title: { type: "string" },
            content: { type: "string" },
            excerpt: { type: "string" },
            meta_title: { type: "string" },
            meta_description: { type: "string" },
            published: { type: "boolean" }
          },
          required: ["slug"]
        }
      },
      {
        name: "delete_blog_post",
        description: "Delete or unpublish a blog post from the CMS.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string", description: "Target blog post slug to remove" }
          },
          required: ["slug"]
        }
      },
      {
        name: "get_seo_keywords",
        description: "Retrieves high-traffic Vedic numerology keywords, search volume estimates, and suggested high-ranking blog topics.",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", description: "Filter by category e.g. Career, Love, Mobile Numerology" }
          }
        }
      },
      {
        name: "generate_blog_schema",
        description: "Generates structured JSON-LD Schema markup (BlogPosting & FAQPage) for any blog post slug.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string", description: "Target blog post slug" },
            faqs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  q: { type: "string" },
                  a: { type: "string" }
                }
              }
            }
          },
          required: ["slug"]
        }
      },
      {
        name: "get_blog_analytics",
        description: "Reports total published articles, draft counts, category distribution, and content freshness stats.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_user_profile",
        description: "Fetch consolidated User Intelligence Profile (DOB, Mulank, Bhagyank, goals, purchased reports).",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "User email address" },
            user_id: { type: "string", description: "Optional Supabase user UUID" }
          }
        }
      },
      {
        name: "generate_report_edge",
        description: "Triggers the backend Supabase Edge Function to compile a specialized report.",
        inputSchema: {
          type: "object",
          properties: {
            user_id: { type: "string", description: "Target user ID" },
            report_key: { type: "string", description: "Report key e.g. career_numerology, name_correction" },
            language: { type: "string", description: "en | hi | hinglish" }
          },
          required: ["report_key"]
        }
      },
      {
        name: "sync_remedies_data",
        description: "Updates or inserts planetary remedy entries in the knowledge base.",
        inputSchema: {
          type: "object",
          properties: {
            number: { type: "number", description: "Root number 1-9" },
            remedy_text: { type: "string" },
            gemstone: { type: "string" },
            language: { type: "string" }
          },
          required: ["number", "remedy_text"]
        }
      },
      {
        name: "retrieve_user_analytics",
        description: "Reports core growth metrics and transaction summaries for admin review.",
        inputSchema: {
          type: "object",
          properties: {
            days_back: { type: "number", description: "Data range in days (default 30)" }
          }
        }
      }
    ]
  };
});

// Helper for audit logging
async function logMcpAudit(action, details) {
  try {
    await supabase.from("admin_audit_log").insert({
      action: `MCP_${action.toUpperCase()}`,
      details,
      created_at: new Date().toISOString()
    });
  } catch {
    // Non-blocking
  }
}

// 2. Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // ===== SEO & BLOGGING TOOLS =====
      case "publish_blog_post": {
        const isPublished = args.published !== undefined ? args.published : true;
        const words = (args.content || "").split(/\s+/).length;
        const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

        const payload = {
          title: args.title,
          slug: args.slug,
          content: args.content,
          excerpt: args.excerpt,
          category: args.category,
          author: args.author || "AnkJyotish Vedic Team",
          read_time: `${readTimeMinutes} min read`,
          published: isPublished,
          meta_title: args.meta_title || args.title,
          meta_description: args.meta_description || args.excerpt,
          keywords: args.keywords || [],
          language: args.language || "en",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from("blog_posts")
          .upsert(payload, { onConflict: "slug" })
          .select();

        if (error) throw error;
        await logMcpAudit("publish_blog_post", { slug: args.slug, published: isPublished });

        return {
          content: [{
            type: "text",
            text: `🎉 Blog Post successfully ${isPublished ? 'PUBLISHED' : 'DRAFTED'}!\n\nTitle: "${args.title}"\nURL Slug: /blog/${args.slug}\nCategory: ${args.category}\nRead Time: ${readTimeMinutes} mins\nLive Status: ${isPublished ? 'Live on Site' : 'Draft Mode'}`
          }]
        };
      }

      case "list_blog_posts": {
        let query = supabase.from("blog_posts").select("id, title, slug, category, published, created_at, read_time");
        if (args.category) query = query.eq("category", args.category);
        if (args.published_only) query = query.eq("published", true);
        query = query.order("created_at", { ascending: false }).limit(args.limit || 20);

        const { data, error } = await query;
        if (error) throw error;

        await logMcpAudit("list_blog_posts", { count: data?.length });
        return { content: [{ type: "text", text: JSON.stringify(data || [], null, 2) }] };
      }

      case "update_blog_post": {
        const updateData = { updated_at: new Date().toISOString() };
        if (args.title) updateData.title = args.title;
        if (args.content) updateData.content = args.content;
        if (args.excerpt) updateData.excerpt = args.excerpt;
        if (args.meta_title) updateData.meta_title = args.meta_title;
        if (args.meta_description) updateData.meta_description = args.meta_description;
        if (args.published !== undefined) updateData.published = args.published;

        const { data, error } = await supabase
          .from("blog_posts")
          .update(updateData)
          .eq("slug", args.slug)
          .select();

        if (error) throw error;
        await logMcpAudit("update_blog_post", { slug: args.slug });
        return { content: [{ type: "text", text: `Blog post '${args.slug}' updated successfully.` }] };
      }

      case "delete_blog_post": {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("slug", args.slug);

        if (error) throw error;
        await logMcpAudit("delete_blog_post", { slug: args.slug });
        return { content: [{ type: "text", text: `Blog post '${args.slug}' removed from CMS.` }] };
      }

      case "get_seo_keywords": {
        let keywords = SEO_KEYWORD_DATABASE;
        if (args.category) {
          keywords = keywords.filter(k => k.category.toLowerCase().includes(args.category.toLowerCase()));
        }
        await logMcpAudit("get_seo_keywords", { filter: args.category });
        return { content: [{ type: "text", text: JSON.stringify(keywords, null, 2) }] };
      }

      case "generate_blog_schema": {
        const { data: post, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", args.slug)
          .maybeSingle();

        if (error) throw error;
        const p = post || { title: args.slug, excerpt: "Vedic Numerology Insights", created_at: new Date().toISOString() };

        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": p.title || args.slug,
          "description": p.excerpt || p.meta_description || "Vedic Numerology Guide",
          "author": { "@type": "Organization", "name": "AnkJyotish AI Team" },
          "publisher": { "@type": "Organization", "name": "AnkJyotish AI", "logo": { "@type": "ImageObject", "url": "https://ankjyotish.com/logo.png" } },
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://ankjyotish.com/blog/${args.slug}` }
        };

        let faqSchema = null;
        if (Array.isArray(args.faqs) && args.faqs.length > 0) {
          faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": args.faqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          };
        }

        return { content: [{ type: "text", text: JSON.stringify({ articleSchema, faqSchema }, null, 2) }] };
      }

      case "get_blog_analytics": {
        const { data: posts, error } = await supabase
          .from("blog_posts")
          .select("id, category, published");

        if (error) throw error;
        const total = posts?.length || 0;
        const published = posts?.filter(p => p.published).length || 0;
        const drafts = total - published;

        const categories = {};
        posts?.forEach(p => {
          const cat = p.category || "Uncategorized";
          categories[cat] = (categories[cat] || 0) + 1;
        });

        const stats = {
          total_articles: total,
          published_articles: published,
          draft_articles: drafts,
          categories_breakdown: categories
        };

        return { content: [{ type: "text", text: JSON.stringify(stats, null, 2) }] };
      }

      // ===== ORIGINAL MCP TOOLS =====
      case "get_user_profile": {
        let query = supabase.from("profiles").select("*, user_psychology(*), user_goals(*)");
        if (args.email) query = query.eq("email", args.email);
        else if (args.user_id) query = query.eq("id", args.user_id);
        else throw new Error("Either email or user_id must be provided");

        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        await logMcpAudit("get_user_profile", { query: args });
        return { content: [{ type: "text", text: JSON.stringify(data || { message: "User not found" }, null, 2) }] };
      }

      case "generate_report_edge": {
        const { data, error } = await supabase.functions.invoke("generate-report-ai", {
          body: {
            reportKey: args.report_key,
            userId: args.user_id,
            lang: args.language || "en"
          }
        });
        if (error) throw error;
        await logMcpAudit("generate_report_edge", { report_key: args.report_key });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "sync_remedies_data": {
        const { data, error } = await supabase
          .from("daily_guidance")
          .upsert({
            mulank: args.number,
            guidance_en: args.remedy_text,
            lucky_color: args.gemstone || "Auspicious",
            created_at: new Date().toISOString()
          }, { onConflict: "mulank" })
          .select();
        if (error) throw error;
        await logMcpAudit("sync_remedies_data", { number: args.number });
        return { content: [{ type: "text", text: `Remedies data synced for Mulank ${args.number}` }] };
      }

      case "retrieve_user_analytics": {
        const days = args.days_back || 30;
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

        const [ordersRes, usersRes] = await Promise.all([
          supabase.from("report_orders").select("id, amount, status, report_key, created_at").gte("created_at", cutoff),
          supabase.from("profiles").select("id, created_at").gte("created_at", cutoff)
        ]);

        const orders = ordersRes.data || [];
        const users = usersRes.data || [];
        const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        const summary = {
          period_days: days,
          new_users_count: users.length,
          total_orders_count: orders.length,
          paid_orders_count: orders.filter(o => o.status === 'paid').length,
          total_revenue_inr: totalRevenue
        };

        await logMcpAudit("retrieve_user_analytics", { days_back: days });
        return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
      }

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (err) {
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
  console.error("AnkJyotish SEO & Blogging MCP Server running on Stdio transport.");
}

run();
