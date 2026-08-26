-- =====================================================================
-- ANKJYOTISH AI — 100% COMPLETE ALL-IN-ONE MASTER MYSQL DATABASE
-- Contains ALL Tables, Seeds, NIKB Matrix, Remedies, Products, Roles, & Data
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


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

INSERT INTO `nikb_mb_matrix` (`mulank`, `bhagyank`, `archetype`, `title`, `compatibility_score`, `core_dynamics`, `career_strategy`, `wealth_pattern`, `relationship_pattern`, `shadow_wound`, `life_guidance`) VALUES
(1, 1, 'The Creative Monarch', 'Mulank 1 × Bhagyank 1 — The Creative Monarch', 71, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 1.'),
(1, 2, 'The Institutional Architect', 'Mulank 1 × Bhagyank 2 — The Institutional Architect', 72, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 2.'),
(1, 3, 'The Dynamic Visionary', 'Mulank 1 × Bhagyank 3 — The Dynamic Visionary', 73, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 3.'),
(1, 4, 'The Harmonious Sovereign', 'Mulank 1 × Bhagyank 4 — The Harmonious Sovereign', 74, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 4.'),
(1, 5, 'The Mystical King', 'Mulank 1 × Bhagyank 5 — The Mystical King', 75, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 5.'),
(1, 6, 'The Empire Commander', 'Mulank 1 × Bhagyank 6 — The Empire Commander', 76, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 6.'),
(1, 7, 'The Warrior Sovereign', 'Mulank 1 × Bhagyank 7 — The Warrior Sovereign', 77, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 7.'),
(1, 8, 'The Sovereign Titan', 'Mulank 1 × Bhagyank 8 — The Sovereign Titan', 78, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 8.'),
(1, 9, 'The Intuitive Leader', 'Mulank 1 × Bhagyank 9 — The Intuitive Leader', 79, 'Harmonizes internal psychic frequency 1 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 1.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 1 to fulfill your higher destiny path 9.'),
(2, 1, 'The Institutional Architect', 'Mulank 2 × Bhagyank 1 — The Institutional Architect', 72, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 1.'),
(2, 2, 'The Dynamic Visionary', 'Mulank 2 × Bhagyank 2 — The Dynamic Visionary', 74, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 2.'),
(2, 3, 'The Harmonious Sovereign', 'Mulank 2 × Bhagyank 3 — The Harmonious Sovereign', 76, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 3.'),
(2, 4, 'The Mystical King', 'Mulank 2 × Bhagyank 4 — The Mystical King', 78, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 4.'),
(2, 5, 'The Empire Commander', 'Mulank 2 × Bhagyank 5 — The Empire Commander', 80, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 5.'),
(2, 6, 'The Warrior Sovereign', 'Mulank 2 × Bhagyank 6 — The Warrior Sovereign', 82, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 6.'),
(2, 7, 'The Sovereign Titan', 'Mulank 2 × Bhagyank 7 — The Sovereign Titan', 84, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 7.'),
(2, 8, 'The Intuitive Leader', 'Mulank 2 × Bhagyank 8 — The Intuitive Leader', 86, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 8.'),
(2, 9, 'The Creative Monarch', 'Mulank 2 × Bhagyank 9 — The Creative Monarch', 88, 'Harmonizes internal psychic frequency 2 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 2.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 2 to fulfill your higher destiny path 9.'),
(3, 1, 'The Dynamic Visionary', 'Mulank 3 × Bhagyank 1 — The Dynamic Visionary', 73, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 1.'),
(3, 2, 'The Harmonious Sovereign', 'Mulank 3 × Bhagyank 2 — The Harmonious Sovereign', 76, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 2.'),
(3, 3, 'The Mystical King', 'Mulank 3 × Bhagyank 3 — The Mystical King', 79, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 3.'),
(3, 4, 'The Empire Commander', 'Mulank 3 × Bhagyank 4 — The Empire Commander', 82, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 4.'),
(3, 5, 'The Warrior Sovereign', 'Mulank 3 × Bhagyank 5 — The Warrior Sovereign', 85, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 5.'),
(3, 6, 'The Sovereign Titan', 'Mulank 3 × Bhagyank 6 — The Sovereign Titan', 88, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 6.'),
(3, 7, 'The Intuitive Leader', 'Mulank 3 × Bhagyank 7 — The Intuitive Leader', 91, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 7.'),
(3, 8, 'The Creative Monarch', 'Mulank 3 × Bhagyank 8 — The Creative Monarch', 94, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 8.'),
(3, 9, 'The Institutional Architect', 'Mulank 3 × Bhagyank 9 — The Institutional Architect', 97, 'Harmonizes internal psychic frequency 3 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 3.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 3 to fulfill your higher destiny path 9.'),
(4, 1, 'The Harmonious Sovereign', 'Mulank 4 × Bhagyank 1 — The Harmonious Sovereign', 74, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 1.'),
(4, 2, 'The Mystical King', 'Mulank 4 × Bhagyank 2 — The Mystical King', 78, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 2.'),
(4, 3, 'The Empire Commander', 'Mulank 4 × Bhagyank 3 — The Empire Commander', 82, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 3.'),
(4, 4, 'The Warrior Sovereign', 'Mulank 4 × Bhagyank 4 — The Warrior Sovereign', 86, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 4.'),
(4, 5, 'The Sovereign Titan', 'Mulank 4 × Bhagyank 5 — The Sovereign Titan', 90, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 5.'),
(4, 6, 'The Intuitive Leader', 'Mulank 4 × Bhagyank 6 — The Intuitive Leader', 94, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 6.'),
(4, 7, 'The Creative Monarch', 'Mulank 4 × Bhagyank 7 — The Creative Monarch', 98, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 7.'),
(4, 8, 'The Institutional Architect', 'Mulank 4 × Bhagyank 8 — The Institutional Architect', 73, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 8.'),
(4, 9, 'The Dynamic Visionary', 'Mulank 4 × Bhagyank 9 — The Dynamic Visionary', 77, 'Harmonizes internal psychic frequency 4 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 4.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 4 to fulfill your higher destiny path 9.'),
(5, 1, 'The Mystical King', 'Mulank 5 × Bhagyank 1 — The Mystical King', 75, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 1.'),
(5, 2, 'The Empire Commander', 'Mulank 5 × Bhagyank 2 — The Empire Commander', 80, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 2.'),
(5, 3, 'The Warrior Sovereign', 'Mulank 5 × Bhagyank 3 — The Warrior Sovereign', 85, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 3.'),
(5, 4, 'The Sovereign Titan', 'Mulank 5 × Bhagyank 4 — The Sovereign Titan', 90, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 4.'),
(5, 5, 'The Intuitive Leader', 'Mulank 5 × Bhagyank 5 — The Intuitive Leader', 95, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 5.'),
(5, 6, 'The Creative Monarch', 'Mulank 5 × Bhagyank 6 — The Creative Monarch', 71, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 6.'),
(5, 7, 'The Institutional Architect', 'Mulank 5 × Bhagyank 7 — The Institutional Architect', 76, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 7.'),
(5, 8, 'The Dynamic Visionary', 'Mulank 5 × Bhagyank 8 — The Dynamic Visionary', 81, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 8.'),
(5, 9, 'The Harmonious Sovereign', 'Mulank 5 × Bhagyank 9 — The Harmonious Sovereign', 86, 'Harmonizes internal psychic frequency 5 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 5.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 5 to fulfill your higher destiny path 9.'),
(6, 1, 'The Empire Commander', 'Mulank 6 × Bhagyank 1 — The Empire Commander', 76, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 1.'),
(6, 2, 'The Warrior Sovereign', 'Mulank 6 × Bhagyank 2 — The Warrior Sovereign', 82, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 2.'),
(6, 3, 'The Sovereign Titan', 'Mulank 6 × Bhagyank 3 — The Sovereign Titan', 88, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 3.'),
(6, 4, 'The Intuitive Leader', 'Mulank 6 × Bhagyank 4 — The Intuitive Leader', 94, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 4.'),
(6, 5, 'The Creative Monarch', 'Mulank 6 × Bhagyank 5 — The Creative Monarch', 71, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 5.'),
(6, 6, 'The Institutional Architect', 'Mulank 6 × Bhagyank 6 — The Institutional Architect', 77, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 6.'),
(6, 7, 'The Dynamic Visionary', 'Mulank 6 × Bhagyank 7 — The Dynamic Visionary', 83, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 7.'),
(6, 8, 'The Harmonious Sovereign', 'Mulank 6 × Bhagyank 8 — The Harmonious Sovereign', 89, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 8.'),
(6, 9, 'The Mystical King', 'Mulank 6 × Bhagyank 9 — The Mystical King', 95, 'Harmonizes internal psychic frequency 6 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 6.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 6 to fulfill your higher destiny path 9.'),
(7, 1, 'The Warrior Sovereign', 'Mulank 7 × Bhagyank 1 — The Warrior Sovereign', 77, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 1.'),
(7, 2, 'The Sovereign Titan', 'Mulank 7 × Bhagyank 2 — The Sovereign Titan', 84, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 2.'),
(7, 3, 'The Intuitive Leader', 'Mulank 7 × Bhagyank 3 — The Intuitive Leader', 91, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 3.'),
(7, 4, 'The Creative Monarch', 'Mulank 7 × Bhagyank 4 — The Creative Monarch', 98, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 4.'),
(7, 5, 'The Institutional Architect', 'Mulank 7 × Bhagyank 5 — The Institutional Architect', 76, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 5.'),
(7, 6, 'The Dynamic Visionary', 'Mulank 7 × Bhagyank 6 — The Dynamic Visionary', 83, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 6.'),
(7, 7, 'The Harmonious Sovereign', 'Mulank 7 × Bhagyank 7 — The Harmonious Sovereign', 90, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 7.'),
(7, 8, 'The Mystical King', 'Mulank 7 × Bhagyank 8 — The Mystical King', 97, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 8.'),
(7, 9, 'The Empire Commander', 'Mulank 7 × Bhagyank 9 — The Empire Commander', 75, 'Harmonizes internal psychic frequency 7 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 7.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 7 to fulfill your higher destiny path 9.'),
(8, 1, 'The Sovereign Titan', 'Mulank 8 × Bhagyank 1 — The Sovereign Titan', 78, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 1.'),
(8, 2, 'The Intuitive Leader', 'Mulank 8 × Bhagyank 2 — The Intuitive Leader', 86, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 2.'),
(8, 3, 'The Creative Monarch', 'Mulank 8 × Bhagyank 3 — The Creative Monarch', 94, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 3.'),
(8, 4, 'The Institutional Architect', 'Mulank 8 × Bhagyank 4 — The Institutional Architect', 73, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 4.'),
(8, 5, 'The Dynamic Visionary', 'Mulank 8 × Bhagyank 5 — The Dynamic Visionary', 81, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 5.'),
(8, 6, 'The Harmonious Sovereign', 'Mulank 8 × Bhagyank 6 — The Harmonious Sovereign', 89, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 6.'),
(8, 7, 'The Mystical King', 'Mulank 8 × Bhagyank 7 — The Mystical King', 97, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 7.'),
(8, 8, 'The Empire Commander', 'Mulank 8 × Bhagyank 8 — The Empire Commander', 76, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 8.'),
(8, 9, 'The Warrior Sovereign', 'Mulank 8 × Bhagyank 9 — The Warrior Sovereign', 84, 'Harmonizes internal psychic frequency 8 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 8.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 8 to fulfill your higher destiny path 9.'),
(9, 1, 'The Intuitive Leader', 'Mulank 9 × Bhagyank 1 — The Intuitive Leader', 79, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 1.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 1.'),
(9, 2, 'The Creative Monarch', 'Mulank 9 × Bhagyank 2 — The Creative Monarch', 88, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 2.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 2.'),
(9, 3, 'The Institutional Architect', 'Mulank 9 × Bhagyank 3 — The Institutional Architect', 97, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 3.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 3.'),
(9, 4, 'The Dynamic Visionary', 'Mulank 9 × Bhagyank 4 — The Dynamic Visionary', 77, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 4.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 4.'),
(9, 5, 'The Harmonious Sovereign', 'Mulank 9 × Bhagyank 5 — The Harmonious Sovereign', 86, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 5.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 5.'),
(9, 6, 'The Mystical King', 'Mulank 9 × Bhagyank 6 — The Mystical King', 95, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 6.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 6.'),
(9, 7, 'The Empire Commander', 'Mulank 9 × Bhagyank 7 — The Empire Commander', 75, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 7.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 7.'),
(9, 8, 'The Warrior Sovereign', 'Mulank 9 × Bhagyank 8 — The Warrior Sovereign', 84, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 8.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 8.'),
(9, 9, 'The Sovereign Titan', 'Mulank 9 × Bhagyank 9 — The Sovereign Titan', 93, 'Harmonizes internal psychic frequency 9 with external life destiny trajectory 9.', 'Excel in independent leadership, high-value ownership, and structured strategic execution aligned with ruling number 9.', 'Build long-term assets through proprietary enterprises and calculated investments.', 'Requires reciprocal partnership with high mutual respect and emotional sovereignty.', 'Balancing internal pride with patient collaboration during challenging cycle transitions.', 'Channel your natural vibration 9 to fulfill your higher destiny path 9.')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `nikb_compound_numbers` (`number`, `name`, `archetype`, `ruling_planets`, `meaning`, `career_advice`, `wealth_advice`, `relationship_advice`) VALUES
(10, 'The Wheel of Fortune', 'The Cyclical Sovereign', 'Sun', 'Cyclical luck and divine protection. Success comes in major transformational waves.', 'Leadership, directorship, founder roles.', 'Earns through enterprise; keep emergency buffers for cycle shifts.', 'Requires adaptable and supportive partner.'),
(11, 'The Spiritual Messenger', 'The Intuitive Visionary', 'Moon / Master 11', 'Master Number 11 carrying extreme psychic sensitivity, vision, and inspirational leadership.', 'Spiritual education, psychology, visionary entrepreneurship.', 'Wealth flows from purpose-aligned missions.', 'Needs emotionally deep, reassuring partner.'),
(12, 'The Sacrifice', 'The Anxious Expresser', 'Jupiter', 'Creative energy earned through patient perseverance and overcoming self-doubt.', 'Creative writing, law, research.', 'Steady disciplined accumulation.', 'Avoid people-pleasing; set clear boundaries.'),
(13, 'The Phoenix', 'The Karmic Alchemist', 'Rahu', 'Karmic transformation through hard work and rebuilding after structural changes.', 'Engineering, architecture, tech innovation.', 'Hard-earned enduring wealth.', 'Loyal and devoted in relationships.'),
(14, 'The Temperance', 'The Movement Seeker', 'Mercury', 'Dynamic communication, freedom of movement, and financial versatility.', 'Trade, media, travel, international business.', 'Multiple revenue streams; avoid speculative risks.', 'Needs an adventurous and flexible companion.'),
(15, 'The Alchemist', 'The Magnetic Charmer', 'Venus', 'High charisma, artistic magnetism, and persuasive communication power.', 'Entertainment, luxury goods, diplomacy, fashion.', 'Attracts wealth through personal brand and charm.', 'Enjoys romance and harmony.'),
(16, 'The Fallen Citadel', 'The Karmic Awakening', 'Ketu', 'Karmic awakening requiring detachment from superficial ego structures.', 'Philosophy, spiritual guidance, research.', 'Focus on ethical and value-driven investments.', 'Requires deep authenticity and honesty.'),
(17, 'The Star of the Magi', 'The Immortal Achiever', 'Saturn', 'Immortality of name and enduring public reputational triumph.', 'High corporate office, institutional leadership.', 'Sustained long-term empire wealth.', 'Solid and steadfast partnerships.'),
(18, 'The Spiritual Conflict', 'The Resilient Warrior', 'Mars', 'Overcomes internal warfare to protect and serve high causes.', 'Defense, medicine, crisis management.', 'Direct ownership; avoid deceptive partnerships.', 'Needs a grounding and calming partner.'),
(19, 'The Prince of Heaven', 'The Royal Victor', 'Sun', 'Chaldean royal protection and ultimate victory over all adversity.', 'CEO, pioneer, founder, surgeon.', 'Generates immense wealth through solo initiative.', 'Direct, generous, and sovereign.'),
(20, 'The Awakening', 'The Spiritual Transformer', 'Moon', 'Karmic turning point leading to profound spiritual awakening.', 'Counseling, public welfare, arts.', 'Wealth through partnerships and emotional intuition.', 'Devoted and intuitive bond.'),
(21, 'The Crown of the Magi', 'The Fortunate Hero', 'Jupiter', 'Highest fortunate compound conferring general advancement and public favor.', 'Publishing, foreign commerce, high diplomacy.', 'Abundant wealth through natural charm and merit.', 'Joyful and fulfilling romance.'),
(22, 'The Master Architect', 'The Universal Builder', 'Rahu / Master 22', 'Master Number 22 capable of materializing large-scale global institutions.', 'Global infrastructure, mega-projects, philanthropy.', 'Immense institutional scale wealth.', 'Seeks an inspiring life partner.'),
(28, 'The Delayed Sovereign', 'The Persistent Builder', 'Moon-Saturn', 'Emotional leadership with delayed explosive breakthroughs in mid-career.', 'Industrial management, real estate, finance.', 'Builds substantial long-term tangible assets.', 'Patience required; deep loyalty in marriage.'),
(33, 'The Master Teacher', 'The Universal Healer', 'Venus / Master 33', 'Master Number 33 representing universal compassion and selfless spiritual teaching.', 'Healing arts, humanitarian leadership, arts.', 'Wealth flows from serving humanity.', 'Pure unconditional love and devotion.')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);


SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- MASTER DATABASE CREATION COMPLETED (ALL TABLES & SEEDS VERIFIED)
-- =====================================================================


-- ========================================================
-- ENTERPRISE & HYPER-PERSONALIZED EXTENSION TABLES
-- ========================================================

-- =====================================================================
-- 29_hyper_personalized_reports_schema.sql — Hyper-Personalized Reports Engine Schema
-- Adds 5 new tables to support context-driven personalized content across all reports, parts, and sections.
-- Safe to re-run (idempotent).
-- =====================================================================

-- 1. Table: report_section_templates (Configurable report structure)
CREATE TABLE IF NOT EXISTS report_section_templates (
  id VARCHAR(36) PRIMARY KEY,
  report_key VARCHAR(100) NOT NULL,             -- e.g. 'career_wealth', 'name_correction', 'life_path'
  part_number int NOT NULL,             -- 1, 2, 3, 4
  part_title text NOT NULL,             -- e.g. "PART 1: Core Personality & Soul Blueprint"
  section_key VARCHAR(100) NOT NULL,            -- e.g. 'work_style_matrix'
  section_title text NOT NULL,          -- e.g. "Your Dynamic Work & Financial Style"
  section_order int NOT NULL,
  required_inputs JSON,
  is_premium boolean DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT report_section_templates_unique_key UNIQUE(report_key, section_key),
  KEY idx_rst_report_key (report_key)
);

-- 2. Table: personalized_content_library (Contextual interpretations matrix)
CREATE TABLE IF NOT EXISTS personalized_content_library (
  id VARCHAR(36) PRIMARY KEY,
  number_type VARCHAR(50) NOT NULL,            -- 'mulank', 'bhagyank', 'karmic_debt', 'personal_year'
  number_val int NOT NULL,              -- 1-9, 11, 22, 13, 14, 16, 19
  life_stage VARCHAR(50) DEFAULT 'ALL',        -- 'student', 'working', 'business', 'retired', 'ALL'
  profession_category VARCHAR(50) DEFAULT 'ALL',-- 'tech', 'finance', 'creative', 'management', 'ALL'
  pillar_key VARCHAR(50) NOT NULL,             -- 'career', 'love', 'money', 'health', 'remedies'
  lang VARCHAR(20) DEFAULT 'hinglish',         -- 'en', 'hi', 'hinglish'
  headline text NOT NULL,
  detailed_analysis text NOT NULL,
  opportunities JSON,
  warning_signals JSON,
  actionable_tip text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pcl_lookup (number_type, number_val, pillar_key, lang)
);

-- 3. Table: user_report_sections (Generated dynamic user section content)
CREATE TABLE IF NOT EXISTS user_report_sections (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  report_key VARCHAR(100) NOT NULL,
  part_number int NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  personalized_title text NOT NULL,
  personalized_content JSON NOT NULL DEFAULT '{}',
  vibration_score int CHECK (vibration_score BETWEEN 0 AND 100),
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_report_sections_unique UNIQUE(user_id, report_key, section_key),
  KEY idx_urs_user_report (user_id, report_key)
);

-- 4. Table: user_personalized_remedies (Custom user prescribed remedies)
CREATE TABLE IF NOT EXISTS user_personalized_remedies (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  remedy_type VARCHAR(50) NOT NULL,            -- 'gemstone', 'mantra', 'color', 'yantra', 'charity', 'signature'
  remedy_title text NOT NULL,
  target_pillar text NOT NULL,          -- 'career', 'health', 'relationship', 'finance'
  prescription_reason text NOT NULL,
  instructions text NOT NULL,
  priority_level text DEFAULT 'high',   -- 'critical', 'high', 'medium'
  is_active boolean DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_upr_user (user_id)
);

-- 5. Table: user_personalized_cycles (Personalized time matrix)
CREATE TABLE IF NOT EXISTS user_personalized_cycles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  year int NOT NULL,
  month int,                            -- NULL for yearly summary, 1-12 for monthly
  personal_year int NOT NULL,
  personal_month int,
  key_theme text NOT NULL,
  growth_score int CHECK (growth_score BETWEEN 0 AND 100),
  aligned_goals JSON,
  favorable_days JSON,
  caution_days JSON,
  action_plan text NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_personalized_cycles_unique UNIQUE(user_id, year, month),
  KEY idx_upc_user (user_id)
);

-- =====================================================================
-- 30_ultimate_enterprise_numerology_schema.sql — Enterprise Numerology & Personal Intelligence Architecture
-- Adds 15 new enterprise tables across 6 functional layers:
-- 1. Corporate & Business Numerology
-- 2. Karmic & Soul Blueprint Systems
-- 3. Multi-Profile Network & Relationship Tree
-- 4. Daily Vibe & Transit Journal (Habit Engine)
-- 5. Lifestyle, Asset Vibrations & Vitality Profile
-- 6. Stateful AI Memory Context
-- Safe to re-run (idempotent).
-- =====================================================================

-- LAYER 1: ADVANCED BUSINESS & CORPORATE NUMEROLOGY
-- 1. business_entities
CREATE TABLE IF NOT EXISTS business_entities (
  id VARCHAR(36) PRIMARY KEY,
  owner_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  pythagorean_sum int NOT NULL,
  chaldean_sum int NOT NULL,
  registration_date date,
  industry text,
  brand_colors JSON,
  bank_account_number text,
  bank_sum_root int,
  address_number text,
  address_sum_root int,
  overall_synergy_score int CHECK (overall_synergy_score BETWEEN 0 AND 100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_be_owner (owner_id)
);

-- 2. business_partner_synergy
CREATE TABLE IF NOT EXISTS business_partner_synergy (
  id VARCHAR(36) PRIMARY KEY,
  business_id VARCHAR(36) REFERENCES business_entities(id) ON DELETE CASCADE,
  partner_name text NOT NULL,
  partner_dob date NOT NULL,
  partner_mulank int NOT NULL,
  partner_bhagyank int NOT NULL,
  equity_percentage float DEFAULT 50.0,
  synergy_score int CHECK (synergy_score BETWEEN 0 AND 100),
  friction_points JSON,
  decision_rule text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bps_biz (business_id)
);



-- 3. corporate_events_scheduler
CREATE TABLE IF NOT EXISTS corporate_events_scheduler (
  id VARCHAR(36) PRIMARY KEY,
  business_id VARCHAR(36) REFERENCES business_entities(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'launch', 'contract_signing', 'rebranding', 'hiring', 'investment'
  proposed_date date NOT NULL,
  personal_year int,
  personal_month int,
  auspiciousness_rating text DEFAULT 'neutral', -- 'highly_auspicious', 'neutral', 'unfavorable'
  recommendation_notes text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ces_biz (business_id)
);




-- LAYER 2: DEEP KARMIC & SOUL BLUEPRINT SYSTEMS
-- 4. karmic_debt_tracker
CREATE TABLE IF NOT EXISTS karmic_debt_tracker (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  karmic_number int NOT NULL, -- 13, 14, 16, 19
  origin_source text NOT NULL,
  life_lesson_description text NOT NULL,
  resolution_rituals JSON,
  is_resolved boolean DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_kdt_user (user_id)
);

-- 5. karmic_lessons_grid
CREATE TABLE IF NOT EXISTS karmic_lessons_grid (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  missing_numbers JSON DEFAULT '{}',
  element_imbalances JSON,
  balancing_remedies JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT klg_user_unique UNIQUE(user_id)
);




-- 6. pinnacles_and_challenges
CREATE TABLE IF NOT EXISTS pinnacles_and_challenges (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  pinnacle_phase int CHECK (pinnacle_phase BETWEEN 1 AND 4),
  start_age int NOT NULL,
  end_age int NOT NULL,
  pinnacle_number int NOT NULL,
  challenge_number int NOT NULL,
  key_theme text NOT NULL,
  growth_objective text NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pac_user_phase_unique UNIQUE(user_id, pinnacle_phase),
  KEY idx_pac_user (user_id)
);

-- LAYER 3: MULTI-PROFILE NETWORK & RELATIONSHIP TREE
-- 7. user_contacts_network
CREATE TABLE IF NOT EXISTS user_contacts_network (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name text NOT NULL,
  relationship_type VARCHAR(50) NOT NULL, -- 'spouse', 'partner', 'child', 'parent', 'friend', 'colleague'
  dob date NOT NULL,
  mulank int NOT NULL,
  bhagyank int NOT NULL,
  notes text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ucn_user (user_id)
);

-- 8. compatibility_matrix_cache
CREATE TABLE IF NOT EXISTS compatibility_matrix_cache (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id VARCHAR(36) REFERENCES user_contacts_network(id) ON DELETE CASCADE,
  love_score int,
  work_score int,
  trust_score int,
  communication_score int,
  overall_score int,
  relationship_advice text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cmc_user_contact_unique UNIQUE(user_id, contact_id)
);




-- 9. baby_name_shortlists
CREATE TABLE IF NOT EXISTS baby_name_shortlists (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  baby_name text NOT NULL,
  gender VARCHAR(20) NOT NULL,
  name_root int NOT NULL,
  destiny_root int NOT NULL,
  compatibility_score int,
  is_favorite boolean DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bns_user (user_id)
);

-- LAYER 4: HABIT-FORMING DAILY ENGAGEMENT & TRANSITS
-- 10. daily_vibe_journal
CREATE TABLE IF NOT EXISTS daily_vibe_journal (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  daily_personal_number int NOT NULL,
  user_mood VARCHAR(50), -- 'great', 'neutral', 'anxious', 'productive', 'low_energy'
  energy_rating int CHECK (energy_rating BETWEEN 1 AND 5),
  events_notes text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT dvj_user_date_unique UNIQUE(user_id, date),
  KEY idx_dvj_user (user_id)
);

-- 11. transit_notifications_queue
CREATE TABLE IF NOT EXISTS transit_notifications_queue (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'daily_vibe', 'monthly_shift', 'caution_day', 'remedy_reminder'
  scheduled_for DATETIME NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  is_sent boolean DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_tnq_user (user_id, is_sent)
);

-- 12. remedy_habit_tracker
CREATE TABLE IF NOT EXISTS remedy_habit_tracker (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  remedy_id VARCHAR(36) REFERENCES user_personalized_remedies(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  completed boolean DEFAULT false,
  streak_count int DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rht_user_remedy_date UNIQUE(user_id, remedy_id, log_date),
  KEY idx_rht_user (user_id)
);

-- LAYER 5: LIFESTYLE, ASSETS & VITALITY PROFILE
-- 13. user_assets_vibration
CREATE TABLE IF NOT EXISTS user_assets_vibration (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL, -- 'vehicle', 'house', 'mobile', 'bank_account', 'passport'
  asset_identifier VARCHAR(100) NOT NULL,
  calculated_root int NOT NULL,
  compatibility_verdict text NOT NULL,
  match_score int,
  suggested_remedy text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_uav_user (user_id)
);

-- 14. health_vitality_profile
CREATE TABLE IF NOT EXISTS health_vitality_profile (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  vulnerable_organs JSON,
  element_deficiency text,
  ayurvedic_diet_tips JSON,
  chakra_focus text,
  stress_relief_routine text,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT hvp_user_unique UNIQUE(user_id)
);





-- LAYER 6: STATEFUL AI MEMORY CONTEXT
-- 15. ai_user_memory
CREATE TABLE IF NOT EXISTS ai_user_memory (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  memory_key VARCHAR(100) NOT NULL, -- 'top_life_goal', 'relationship_struggle', 'career_ambition', 'preferred_tone'
  memory_value text NOT NULL,
  confidence_score float DEFAULT 1.0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT aum_user_key_unique UNIQUE(user_id, memory_key),
  KEY idx_aum_user (user_id)
);

-- =====================================================================
-- 31_deep_study_master_schema.sql — Master Deep Study Schema
-- Adds tables for Lo Shu Grid 8-Planes & Raj Yogas, Chaldean Compound Meanings, and Gemstone/Rudraksha Prescriptions.
-- Safe to re-run (idempotent).
-- =====================================================================

-- 1. Table: loshu_grid_planes
CREATE TABLE IF NOT EXISTS loshu_grid_planes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  has_mental_plane boolean DEFAULT false,    -- 4-9-2
  has_emotional_plane boolean DEFAULT false, -- 3-5-7
  has_practical_plane boolean DEFAULT false,  -- 8-1-6
  has_thought_plane boolean DEFAULT false,   -- 4-3-8
  has_will_plane boolean DEFAULT false,      -- 9-5-1
  has_action_plane boolean DEFAULT false,    -- 2-7-6
  has_golden_yog boolean DEFAULT false,      -- 4-5-6 (Raj Yog)
  has_silver_yog boolean DEFAULT false,      -- 2-5-8 (Property Yog)
  missing_remedies JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lgp_user_unique UNIQUE(user_id)
);





-- 2. Table: chaldean_compound_meanings
CREATE TABLE IF NOT EXISTS chaldean_compound_meanings (
  compound_number int PRIMARY KEY,
  symbol_name text NOT NULL,
  occult_meaning text NOT NULL,
  is_fortunate boolean DEFAULT true,
  actionable_guidance text NOT NULL
);





-- 3. Table: prescribed_gemstones_rudraksha
CREATE TABLE IF NOT EXISTS prescribed_gemstones_rudraksha (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  primary_gemstone text NOT NULL,
  recommended_ratti float NOT NULL,
  metal_type text NOT NULL,
  wear_finger text NOT NULL,
  wear_day_time text NOT NULL,
  rudraksha_mukhi text NOT NULL,
  yantra_direction text NOT NULL,
  beej_mantra text NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pgr_user_unique UNIQUE(user_id)
);


