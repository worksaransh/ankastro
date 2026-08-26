from typing import List
from python.common.models import RecommendationRequest, RecommendationItem

# Product catalog reference mappings
MULANK_TSHIRTS = {
    1: {"title": "The Sovereign Pioneer (Mulank 1 Luxury T-Shirt)", "slug": "mulank-1-luxury-tshirt", "price": 999.0},
    2: {"title": "The Intuitive Diplomat (Mulank 2 Luxury T-Shirt)", "slug": "mulank-2-luxury-tshirt", "price": 999.0},
    3: {"title": "The Creative Visionary (Mulank 3 Luxury T-Shirt)", "slug": "mulank-3-luxury-tshirt", "price": 999.0},
    4: {"title": "The Master Builder (Mulank 4 Luxury T-Shirt)", "slug": "mulank-4-luxury-tshirt", "price": 999.0},
    5: {"title": "The Dynamic Alchemist (Mulank 5 Luxury T-Shirt)", "slug": "mulank-5-luxury-tshirt", "price": 999.0},
    6: {"title": "The Harmonious Guardian (Mulank 6 Luxury T-Shirt)", "slug": "mulank-6-luxury-tshirt", "price": 999.0},
    7: {"title": "The Mystic Philosopher (Mulank 7 Luxury T-Shirt)", "slug": "mulank-7-luxury-tshirt", "price": 999.0},
    8: {"title": "The Sovereign Strategist (Mulank 8 Luxury T-Shirt)", "slug": "mulank-8-luxury-tshirt", "price": 999.0},
    9: {"title": "The Universal Humanitarian (Mulank 9 Luxury T-Shirt)", "slug": "mulank-9-luxury-tshirt", "price": 999.0},
}

GEMSTONE_REMEDIES = {
    1: {"gem": "Natural Certified Ruby (Manikya)", "price": 4999.0, "slug": "ruby-gemstone-remedy"},
    2: {"gem": "South Sea Natural Pearl (Moti)", "price": 3499.0, "slug": "pearl-gemstone-remedy"},
    3: {"gem": "Ceylon Yellow Sapphire (Pukhraj)", "price": 7999.0, "slug": "yellow-sapphire-remedy"},
    4: {"gem": "African Hessonite Garnet (Gomed)", "price": 3999.0, "slug": "hessonite-remedy"},
    5: {"gem": "Zambian Natural Emerald (Panna)", "price": 6499.0, "slug": "emerald-remedy"},
    6: {"gem": "Natural White Opal / Zircon", "price": 3999.0, "slug": "opal-remedy"},
    7: {"gem": "Natural Chrysoberyl Cat's Eye (Lehsunia)", "price": 4499.0, "slug": "cats-eye-remedy"},
    8: {"gem": "Natural Blue Sapphire (Neelam) / Amethyst", "price": 8999.0, "slug": "blue-sapphire-remedy"},
    9: {"gem": "Italian Natural Red Coral (Moonga)", "price": 4999.0, "slug": "red-coral-remedy"},
}

def generate_recommendations(req: RecommendationRequest) -> List[RecommendationItem]:
    items: List[RecommendationItem] = []

    # 1. Personalized Mulank Luxury T-Shirt
    tshirt_info = MULANK_TSHIRTS.get(req.mulank, MULANK_TSHIRTS[1])
    items.append(RecommendationItem(
        item_type="tshirt",
        title=tshirt_info["title"],
        slug=tshirt_info["slug"],
        price=tshirt_info["price"],
        reason=f"Recommended because your Mulank {req.mulank} channels planetary resonance through this 24K gold foil geometric emblem.",
        confidence=0.98,
        source_rule="rule_mulank_merch_vibration_match",
        image_url=f"/images/tshirts/mulank_{req.mulank}_front.webp",
        target_url=f"/products/{tshirt_info['slug']}"
    ))

    # 2. Auspicious Astrological Gemstone Remedy
    gem_info = GEMSTONE_REMEDIES.get(req.mulank, GEMSTONE_REMEDIES[1])
    items.append(RecommendationItem(
        item_type="gemstone",
        title=gem_info["gem"],
        slug=gem_info["slug"],
        price=gem_info["price"],
        reason=f"Energizes your ruling planetary vibration to dissolve career obstacles and heighten mental focus.",
        confidence=0.94,
        source_rule="rule_planetary_gemstone_harmonization",
        image_url="/images/remedies/gemstone_sample.webp",
        target_url=f"/remedies/{gem_info['slug']}"
    ))

    # 3. Master Life Blueprint / Deep Kundli Report
    items.append(RecommendationItem(
        item_type="report",
        title="Master Life Blueprint & 5-Pillar Kundli Intelligence",
        slug="master-blueprint-report",
        price=999.0,
        reason="Provides comprehensive 10-year timeline, Loshu grid depth, and personalized career/wealth remediation.",
        confidence=0.96,
        source_rule="rule_master_report_upgrade",
        image_url="/images/reports/master_report_cover.webp",
        target_url="/buy-report/master-life-blueprint"
    ))

    # 4. Curated Affiliate Cosmic Item
    items.append(RecommendationItem(
        item_type="affiliate",
        title="Vedic Brass Shri Yantra (Energized 3D Meru)",
        slug="energized-shri-yantra",
        price=1499.0,
        reason="Amplifies cosmic abundance and vastu harmonization in personal and office sanctuaries.",
        confidence=0.88,
        source_rule="rule_affiliate_vastu_harmony",
        image_url="/images/affiliates/shri_yantra.webp",
        target_url="https://affiliate.ankjyotishai.com/redirect/shri-yantra"
    ))

    return items
