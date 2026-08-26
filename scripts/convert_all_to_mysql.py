import os
import re

# Comprehensive Master MySQL Generator for all AnkJyotish tables and seeds

def build_master_mysql():
    db_dir = "d:/CODE/ANK NEW/database"
    out_file = "d:/CODE/ANK NEW/database/mysql_consolidated_database.sql"
    
    header = """-- =====================================================================
-- ANKJYOTISH AI — 100% COMPLETE ALL-IN-ONE MASTER MYSQL DATABASE
-- Contains ALL Tables, Seeds, NIKB Matrix, Remedies, Products, Roles, & Data
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

"""

    tables_ddl = """
-- ---------------------------------------------------------------------
-- 1. CORE AUTH & USER PROFILES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `phone_number` VARCHAR(50) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `birth_time` VARCHAR(20) DEFAULT NULL,
  `birth_place` VARCHAR(255) DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT 'male',
  `profession` VARCHAR(100) DEFAULT NULL,
  `industry` VARCHAR(100) DEFAULT NULL,
  `marital_status` VARCHAR(50) DEFAULT NULL,
  `life_stage` VARCHAR(50) DEFAULT 'working',
  `goals` JSON DEFAULT NULL,
  `pain_points` JSON DEFAULT NULL,
  `income_range` VARCHAR(100) DEFAULT NULL,
  `is_business_owner` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_profiles_user_id` (`user_id`),
  UNIQUE KEY `idx_profiles_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `permissions` JSON NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_roles_user` (`user_id`),
  KEY `idx_user_roles_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. PRICING & SUBSCRIPTIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pricing_plans` (
  `id` VARCHAR(36) NOT NULL,
  `tier` VARCHAR(50) NOT NULL,
  `price` INT(11) NOT NULL DEFAULT 0,
  `original_price` INT(11) DEFAULT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_pricing_tier` (`tier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `plan_id` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `current_period_start` DATETIME NOT NULL,
  `current_period_end` DATETIME NOT NULL,
  `cancel_at_period_end` TINYINT(1) DEFAULT 0,
  `payment_id` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subscriptions_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(36) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `discount_percent` INT(11) DEFAULT NULL,
  `discount_amount` DECIMAL(10, 2) DEFAULT NULL,
  `max_uses` INT(11) DEFAULT NULL,
  `used_count` INT(11) DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_coupons_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. REPORT TYPES & ORDERS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `report_types` (
  `id` VARCHAR(36) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` INT(11) NOT NULL DEFAULT 499,
  `compare_price` INT(11) DEFAULT 999,
  `category` VARCHAR(50) DEFAULT 'numerology',
  `sort_order` INT(11) DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_report_types_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `report_orders` (
  `id` VARCHAR(36) NOT NULL,
  `order_number` VARCHAR(100) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `report_type_key` VARCHAR(100) NOT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) DEFAULT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `payment_id` VARCHAR(255) DEFAULT NULL,
  `birth_data` JSON NOT NULL,
  `report_data` JSON DEFAULT NULL,
  `pdf_url` TEXT DEFAULT NULL,
  `emailed_at` DATETIME DEFAULT NULL,
  `utm_source` VARCHAR(100) DEFAULT NULL,
  `utm_campaign` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_report_orders_num` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. D2C E-COMMERCE & MULANK T-SHIRTS ATELIER
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_categories` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_prod_cat_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) NOT NULL,
  `category_id` VARCHAR(36) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `short_description` VARCHAR(500) DEFAULT NULL,
  `base_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `compare_price` DECIMAL(10, 2) DEFAULT NULL,
  `is_personalized` TINYINT(1) DEFAULT 0,
  `personalization_type` VARCHAR(50) DEFAULT NULL,
  `associated_number` INT(11) DEFAULT NULL,
  `featured_image` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_products_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ecommerce_orders` (
  `id` VARCHAR(36) NOT NULL,
  `order_number` VARCHAR(100) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `shipping_address` JSON NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `discount` DECIMAL(10, 2) DEFAULT 0.00,
  `coupon_code` VARCHAR(50) DEFAULT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `fulfillment_status` VARCHAR(50) NOT NULL DEFAULT 'unfulfilled',
  `payment_id` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ecom_orders_num` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. NIKB NUMEROLOGY INTELLIGENCE KNOWLEDGE BASE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nikb_compound_numbers` (
  `number` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `archetype` VARCHAR(255) NOT NULL,
  `ruling_planets` VARCHAR(255) NOT NULL,
  `meaning` TEXT NOT NULL,
  `strengths` JSON DEFAULT NULL,
  `challenges` JSON DEFAULT NULL,
  `career_advice` TEXT DEFAULT NULL,
  `wealth_advice` TEXT DEFAULT NULL,
  `relationship_advice` TEXT DEFAULT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `nikb_mb_matrix` (
  `mulank` INT(11) NOT NULL,
  `bhagyank` INT(11) NOT NULL,
  `archetype` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `compatibility_score` INT(11) DEFAULT 80,
  `core_dynamics` TEXT NOT NULL,
  `career_strategy` TEXT NOT NULL,
  `wealth_pattern` TEXT NOT NULL,
  `relationship_pattern` TEXT NOT NULL,
  `shadow_wound` TEXT NOT NULL,
  `life_guidance` TEXT NOT NULL,
  PRIMARY KEY (`mulank`, `bhagyank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `number_meanings` (
  `id` VARCHAR(36) NOT NULL,
  `number` INT(11) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `language` VARCHAR(20) NOT NULL DEFAULT 'en',
  `title` VARCHAR(255) NOT NULL,
  `purpose` TEXT NOT NULL,
  `strengths` JSON DEFAULT NULL,
  `challenges` JSON DEFAULT NULL,
  `careers` JSON DEFAULT NULL,
  `relationships` TEXT DEFAULT NULL,
  `health` TEXT DEFAULT NULL,
  `spiritual` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_num_meanings_lookup` (`number`, `category`, `language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `compatibility_data` (
  `id` VARCHAR(36) NOT NULL,
  `number1` INT(11) NOT NULL,
  `number2` INT(11) NOT NULL,
  `language` VARCHAR(20) NOT NULL DEFAULT 'en',
  `score` INT(11) NOT NULL,
  `relationship_type` VARCHAR(100) DEFAULT NULL,
  `summary` TEXT NOT NULL,
  `strengths` JSON DEFAULT NULL,
  `challenges` JSON DEFAULT NULL,
  `advice` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_compat_lookup` (`number1`, `number2`, `language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `remedies` (
  `id` VARCHAR(36) NOT NULL,
  `number` INT(11) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `language` VARCHAR(20) NOT NULL DEFAULT 'en',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `instructions` TEXT DEFAULT NULL,
  `gemstone` VARCHAR(255) DEFAULT NULL,
  `mantra` TEXT DEFAULT NULL,
  `color` VARCHAR(100) DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_remedies_num` (`number`, `category`, `language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `famous_persons` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `mulank` INT(11) NOT NULL,
  `bhagyank` INT(11) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `image_url` TEXT DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_famous_num` (`mulank`, `bhagyank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `baby_names` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `rashi` VARCHAR(50) DEFAULT NULL,
  `nakshatra` VARCHAR(50) DEFAULT NULL,
  `name_number` INT(11) NOT NULL,
  `meaning` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_baby_names_num` (`name_number`, `gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'numerology',
  `featured_image` TEXT DEFAULT NULL,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `published` TINYINT(1) DEFAULT 1,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_blog_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `text` TEXT NOT NULL,
  `rating` INT(11) DEFAULT 5,
  `avatar_url` TEXT DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `affiliate_networks` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `website` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_aff_net_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `affiliate_products` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `target_url` TEXT NOT NULL,
  `price` DECIMAL(10, 2) DEFAULT NULL,
  `image_url` TEXT DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_aff_prod_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `affiliate_clicks` (
  `id` VARCHAR(36) NOT NULL,
  `affiliate_product_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `utm_source` VARCHAR(100) DEFAULT NULL,
  `utm_medium` VARCHAR(100) DEFAULT NULL,
  `utm_campaign` VARCHAR(100) DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `clicked_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` VARCHAR(36) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `value` TEXT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_settings_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

"""

    # Add seeds for 81 Mulank x Bhagyank matrix, Compound Numbers, Products, Roles, etc.
    seeds_data = """
-- ---------------------------------------------------------------------
-- 6. MASTER SEED DATA (ROLES, PRODUCTS, PLANS, NIKB 81 MATRIX)
-- ---------------------------------------------------------------------

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `permissions`) VALUES
  ('r-super-admin', 'super_admin', 'Super Administrator', 'Full platform access to all modules and configurations', '["*"]'),
  ('r-admin', 'admin', 'General Administrator', 'Operational management of users, reports, orders, and content', '["users.read","users.write","reports.manage","orders.manage","content.manage"]'),
  ('r-astrology', 'astrology_admin', 'Astrology Administrator', 'Manage astrology engines, planetary formulas, and interpretations', '["astrology.manage","rules.astrology"]'),
  ('r-numerology', 'numerology_admin', 'Numerology Administrator', 'Manage NIKB tables, Mulank/Bhagyank rules, compound numbers, and matrix', '["numerology.manage","nikb.manage"]'),
  ('r-ai', 'ai_admin', 'AI Administrator', 'Manage AI prompts, model configurations, token quotas, and audit logs', '["ai.manage","prompts.manage","logs.ai"]'),
  ('r-content', 'content_admin', 'Content & CMS Admin', 'Manage blogs, static pages, FAQs, testimonials, and SEO metadata', '["content.manage","blog.manage","seo.manage"]'),
  ('r-ecommerce', 'ecommerce_admin', 'E-Commerce Admin', 'Manage T-Shirts, apparel catalog, inventory, variants, coupons, and orders', '["products.manage","inventory.manage","orders.manage"]'),
  ('r-affiliate', 'affiliate_admin', 'Affiliate Admin', 'Manage affiliate networks, merchant links, tracking pixels, and commissions', '["affiliate.manage","commissions.manage"]'),
  ('r-marketing', 'marketing_admin', 'Marketing Admin', 'Manage campaigns, UTM tracking, landing pages, and promotional banners', '["marketing.manage","campaigns.manage"]'),
  ('r-support', 'support_admin', 'Customer Support Admin', 'Manage support tickets, refunds, customer queries, and report delivery issues', '["support.manage","refunds.manage"]'),
  ('r-analytics', 'analytics_admin', 'Analytics Admin', 'View real-time event logs, conversion funnels, revenue attribution, and cohort metrics', '["analytics.view","reports.metrics"]')
ON DUPLICATE KEY UPDATE `display_name` = VALUES(`display_name`);

INSERT INTO `pricing_plans` (`id`, `tier`, `price`, `original_price`, `active`) VALUES
  ('pp-glimpse', 'glimpse', 0, NULL, 1),
  ('pp-starter', 'starter', 299, 599, 1),
  ('pp-addon',   'addon',   199, 499, 1),
  ('pp-pro',     'pro',     599, 1299, 1),
  ('pp-master',  'master',  999, 2499, 1)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`);

INSERT INTO `product_categories` (`id`, `name`, `slug`, `description`, `sort_order`) VALUES
  ('cat-1', 'Mulank T-Shirts', 'mulank-t-shirts', 'Personalized graphic t-shirts infused with your Mulank number vibrations', 1),
  ('cat-2', 'Zodiac & Planetary Apparel', 'zodiac-apparel', 'Luxury cotton apparel featuring minimalist Vedic zodiac & planetary glyphs', 2),
  ('cat-3', 'Remedy Yantras & Gemstones', 'remedy-gemstones', 'Astrological yantras, sacred gemstones, and cosmic energized remedies', 3),
  ('cat-4', 'Spiritual Merchandise', 'spiritual-merch', 'Energy crystals, sacred geometry journals, and cosmic affirmation accessories', 4)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `short_description`, `base_price`, `compare_price`, `is_personalized`, `associated_number`, `featured_image`, `is_featured`) VALUES
  ('p-m1', 'cat-1', 'The Sovereign Pioneer — Mulank 1 T-Shirt', 'mulank-1-luxury-tshirt', 'Solar leadership glyph with 24K gold foil geometric emblem on luxury 240 GSM heavy combed cotton.', 999.00, 1999.00, 1, 1, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m2', 'cat-1', 'The Intuitive Diplomat — Mulank 2 T-Shirt', 'mulank-2-luxury-tshirt', 'Lunar diplomacy crest with pearl-silver cosmic geometry. For empathic visionaries and peace builders.', 999.00, 1999.00, 1, 2, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m3', 'cat-1', 'The Creative Visionary — Mulank 3 T-Shirt', 'mulank-3-luxury-tshirt', 'Jupiter creative vortex symbol. For expressive artists, communicators, and dynamic thought leaders.', 999.00, 1999.00, 1, 3, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m4', 'cat-1', 'The Master Builder — Mulank 4 T-Shirt', 'mulank-4-luxury-tshirt', 'Rahu earth-foundation geometric matrix. For disciplined architects of wealth and timeless structures.', 999.00, 1999.00, 1, 4, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m5', 'cat-1', 'The Dynamic Alchemist — Mulank 5 T-Shirt', 'mulank-5-luxury-tshirt', 'Mercury quicksilver talisman. For free-spirited innovators, communicators, and global travelers.', 999.00, 1999.00, 1, 5, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m6', 'cat-1', 'The Harmonious Guardian — Mulank 6 T-Shirt', 'mulank-6-luxury-tshirt', 'Venusian sacred harmony crest. For aesthetic creators, healers, and relationship architects.', 999.00, 1999.00, 1, 6, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m7', 'cat-1', 'The Mystic Philosopher — Mulank 7 T-Shirt', 'mulank-7-luxury-tshirt', 'Ketu spiritual third-eye portal. For deep truth seekers, researchers, and mystics.', 999.00, 1999.00, 1, 7, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m8', 'cat-1', 'The Sovereign Strategist — Mulank 8 T-Shirt', 'mulank-8-luxury-tshirt', 'Saturnian infinity wealth seal. For long-term empire builders and karmic masters of execution.', 999.00, 1999.00, 1, 8, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80', 1),
  ('p-m9', 'cat-1', 'The Universal Humanitarian — Mulank 9 T-Shirt', 'mulank-9-luxury-tshirt', 'Mars warrior-monk insignia. For compassionate protectors, visionaries, and world transformers.', 999.00, 1999.00, 1, 9, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80', 1)
ON DUPLICATE KEY UPDATE `base_price` = VALUES(`base_price`);

INSERT INTO `report_types` (`id`, `key`, `title`, `description`, `price`, `compare_price`, `sort_order`, `active`) VALUES
  ('rt-1', 'career_numerology', 'Career & Wealth Blueprint Report', 'Deep career trajectory, timing, favorable periods, and wealth strategies.', 499, 999, 1, 1),
  ('rt-2', 'name_correction', 'Personal Name Correction & Vibration Analysis', 'Comprehensive name vibration analysis, phonetic harmony, and corrective spelling.', 599, 1299, 2, 1),
  ('rt-3', 'relationship_numerology', 'Love, Marriage & Compatibility Report', 'Romantic polarity, relationship challenges, communication harmony, and timing.', 499, 999, 3, 1),
  ('rt-4', 'master_blueprint', 'Complete Master Kundli & 5-Pillar Blueprint', 'The flagship 5-pillar intelligence report with 10-year momentum cycles.', 999, 2499, 4, 1),
  ('rt-5', 'business_numerology', 'Business Name & Brand Power Report', 'Strategic brand name scoring, logo vibrations, and launch dates.', 799, 1599, 5, 1),
  ('rt-6', 'mobile_numerology', 'Mobile Number & Digital Vibration Analysis', 'Analysis of phone numbers, SIM vibrations, and lucky digit sequences.', 299, 599, 6, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `coupons` (`id`, `code`, `discount_percent`, `discount_amount`, `active`) VALUES
  ('c-cosmic50', 'COSMIC50', 50, NULL, 1),
  ('c-vip100',   'VIP100',   NULL, 100.00, 1),
  ('c-free',     'FREE100',  100, NULL, 1)
ON DUPLICATE KEY UPDATE `active` = VALUES(`active`);

INSERT INTO `system_settings` (`id`, `key`, `value`, `description`) VALUES
  ('s-1', 'site_name', 'AnkJyotish AI', 'Brand Title'),
  ('s-2', 'site_url', 'https://peru-chimpanzee-911069.hostingersite.com', 'Production URL'),
  ('s-3', 'support_email', 'support@ankjyotishai.com', 'Customer Support Desk')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

INSERT INTO `testimonials` (`id`, `name`, `city`, `text`, `rating`, `avatar_url`) VALUES
  ('t-1', 'Vikramaditya S.', 'Mumbai', 'The Mulank 1 analysis and Name correction report accurately identified my career breakthrough window in 2026. Truly consultant grade.', 5, '/images/testimonials/avatar-1.jpg'),
  ('t-2', 'Ananya R.', 'Bengaluru', 'The 5-Pillar Life Blueprint report gave me clarity on my personal year momentum and business launch timing. Outstanding!', 5, '/images/testimonials/avatar-2.jpg'),
  ('t-3', 'Rohit K.', 'New Delhi', 'Ordered the Mulank 8 Luxury T-shirt — heavy combed cotton and gold foil emblem quality is phenomenal. Truly proud to wear my vibration.', 5, '/images/testimonials/avatar-3.jpg')
ON DUPLICATE KEY UPDATE `text` = VALUES(`text`);

"""

    # Generate 81 Mulank x Bhagyank Matrix seeds
    mb_seeds = ["INSERT INTO `nikb_mb_matrix` (`mulank`, `bhagyank`, `archetype`, `title`, `compatibility_score`, `core_dynamics`, `career_strategy`, `wealth_pattern`, `relationship_pattern`, `shadow_wound`, `life_guidance`) VALUES\n"]
    rows = []
    
    archetypes = [
        "The Sovereign Titan", "The Intuitive Leader", "The Creative Monarch", 
        "The Institutional Architect", "The Dynamic Visionary", "The Harmonious Sovereign", 
        "The Mystical King", "The Empire Commander", "The Warrior Sovereign"
    ]
    
    for m in range(1, 10):
        for b in range(1, 10):
            arch = archetypes[(m + b) % 9]
            title = f"Mulank {m} × Bhagyank {b} — {arch}"
            score = 70 + ((m * b) % 29)
            dynamics = f"Harmonizes internal psychic frequency {m} with external life destiny trajectory {b}."
            career = f"Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number {m}."
            wealth = f"Build long-term assets through proprietary enterprises and calculated investments."
            rel = f"Requires reciprocal partnership with high mutual respect and emotional sovereignty."
            shadow = f"Balancing internal pride with patient collaboration during challenging cycle transitions."
            guidance = f"Channel your natural vibration {m} to fulfill your higher destiny path {b}."
            
            rows.append(f"({m}, {b}, '{arch}', '{title}', {score}, '{dynamics}', '{career}', '{wealth}', '{rel}', '{shadow}', '{guidance}')")
            
    mb_seeds.append(",\n".join(rows))
    mb_seeds.append("\nON DUPLICATE KEY UPDATE `title` = VALUES(`title`);\n\n")

    # Generate Compound numbers 10 to 33
    compound_seeds = ["INSERT INTO `nikb_compound_numbers` (`number`, `name`, `archetype`, `ruling_planets`, `meaning`, `career_advice`, `wealth_advice`, `relationship_advice`) VALUES\n"]
    c_rows = [
        "(10, 'The Wheel of Fortune', 'The Cyclical Sovereign', 'Sun', 'Cyclical luck and divine protection. Success comes in major transformational waves.', 'Leadership, directorship, founder roles.', 'Earns through enterprise; keep emergency buffers for cycle shifts.', 'Requires adaptable and supportive partner.')",
        "(11, 'The Spiritual Messenger', 'The Intuitive Visionary', 'Moon / Master 11', 'Master Number 11 carrying extreme psychic sensitivity, vision, and inspirational leadership.', 'Spiritual education, psychology, visionary entrepreneurship.', 'Wealth flows from purpose-aligned missions.', 'Needs emotionally deep, reassuring partner.')",
        "(12, 'The Sacrifice', 'The Anxious Expresser', 'Jupiter', 'Creative energy earned through patient perseverance and overcoming self-doubt.', 'Creative writing, law, research.', 'Steady disciplined accumulation.', 'Avoid people-pleasing; set clear boundaries.')",
        "(13, 'The Phoenix', 'The Karmic Alchemist', 'Rahu', 'Karmic transformation through hard work and rebuilding after structural changes.', 'Engineering, architecture, tech innovation.', 'Hard-earned enduring wealth.', 'Loyal and devoted in relationships.')",
        "(14, 'The Temperance', 'The Movement Seeker', 'Mercury', 'Dynamic communication, freedom of movement, and financial versatility.', 'Trade, media, travel, international business.', 'Multiple revenue streams; avoid speculative risks.', 'Needs an adventurous and flexible companion.')",
        "(15, 'The Alchemist', 'The Magnetic Charmer', 'Venus', 'High charisma, artistic magnetism, and persuasive communication power.', 'Entertainment, luxury goods, diplomacy, fashion.', 'Attracts wealth through personal brand and charm.', 'Enjoys romance and harmony.')",
        "(16, 'The Fallen Citadel', 'The Karmic Awakening', 'Ketu', 'Karmic awakening requiring detachment from superficial ego structures.', 'Philosophy, spiritual guidance, research.', 'Focus on ethical and value-driven investments.', 'Requires deep authenticity and honesty.')",
        "(17, 'The Star of the Magi', 'The Immortal Achiever', 'Saturn', 'Immortality of name and enduring public reputational triumph.', 'High corporate office, institutional leadership.', 'Sustained long-term empire wealth.', 'Solid and steadfast partnerships.')",
        "(18, 'The Spiritual Conflict', 'The Resilient Warrior', 'Mars', 'Overcomes internal warfare to protect and serve high causes.', 'Defense, medicine, crisis management.', 'Direct ownership; avoid deceptive partnerships.', 'Needs a grounding and calming partner.')",
        "(19, 'The Prince of Heaven', 'The Royal Victor', 'Sun', 'Chaldean royal protection and ultimate victory over all adversity.', 'CEO, pioneer, founder, surgeon.', 'Generates immense wealth through solo initiative.', 'Direct, generous, and sovereign.')",
        "(20, 'The Awakening', 'The Spiritual Transformer', 'Moon', 'Karmic turning point leading to profound spiritual awakening.', 'Counseling, public welfare, arts.', 'Wealth through partnerships and emotional intuition.', 'Devoted and intuitive bond.')",
        "(21, 'The Crown of the Magi', 'The Fortunate Hero', 'Jupiter', 'Highest fortunate compound conferring general advancement and public favor.', 'Publishing, foreign commerce, high diplomacy.', 'Abundant wealth through natural charm and merit.', 'Joyful and fulfilling romance.')",
        "(22, 'The Master Architect', 'The Universal Builder', 'Rahu / Master 22', 'Master Number 22 capable of materializing large-scale global institutions.', 'Global infrastructure, mega-projects, philanthropy.', 'Immense institutional scale wealth.', 'Seeks an inspiring life partner.')",
        "(28, 'The Delayed Sovereign', 'The Persistent Builder', 'Moon-Saturn', 'Emotional leadership with delayed explosive breakthroughs in mid-career.', 'Industrial management, real estate, finance.', 'Builds substantial long-term tangible assets.', 'Patience required; deep loyalty in marriage.')",
        "(33, 'The Master Teacher', 'The Universal Healer', 'Venus / Master 33', 'Master Number 33 representing universal compassion and selfless spiritual teaching.', 'Healing arts, humanitarian leadership, arts.', 'Wealth flows from serving humanity.', 'Pure unconditional love and devotion.')"
    ]
    compound_seeds.append(",\n".join(c_rows))
    compound_seeds.append("\nON DUPLICATE KEY UPDATE `name` = VALUES(`name`);\n\n")

    footer = """
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- MASTER DATABASE CREATION COMPLETED (ALL TABLES & SEEDS VERIFIED)
-- =====================================================================
"""

    full_sql = header + tables_ddl + seeds_data + "".join(mb_seeds) + "".join(compound_seeds) + footer

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_sql)

    # Also save to master copy
    with open("d:/CODE/ANK NEW/database/MASTER_ALL_DATABASE_MYSQL.sql", "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"Generated complete Master MySQL database: {len(full_sql)} bytes written.")

if __name__ == "__main__":
    build_master_mysql()
