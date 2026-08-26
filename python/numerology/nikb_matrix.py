from typing import Dict, Any, List

# NIKB 81 Matrix: Sample High-Resolution Syntheses
MB_MATRIX_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "1_1": {
        "title": "The Double Sun — Pure Unmitigated Will",
        "archetype": "The Autonomous Titan",
        "dynamics": "Intense drive, fearless independence. High risk of burnout or refusing collaboration.",
        "wealth_strategy": "Direct founder equity, proprietary B2C brands, solo enterprise.",
        "relationship_advice": "Seek non-competing partner (2, 6). Avoid dominance struggles.",
        "shadow_wound": "Fear of vulnerability masquerading as unyielding invincibility."
    },
    "1_8": {
        "title": "Sun Meets Saturn — Sovereign Empire Builder",
        "archetype": "The Strategic Commander",
        "dynamics": "Sun vision combined with Saturnian execution discipline. Delayed explosive breakthroughs.",
        "wealth_strategy": "Heavy enterprise infrastructure, asset accumulation, industrial ventures.",
        "relationship_advice": "Requires patience; professional ambitions often consume early twenties.",
        "shadow_wound": "Internal friction between swift recognition (1) and karmic patience (8)."
    },
    "3_8": {
        "title": "Jupiter Meets Saturn — Creative Genius with Concrete Form",
        "archetype": "The Industrial Visionary",
        "dynamics": "Expansive visionary ideation grounded by meticulous institutional execution.",
        "wealth_strategy": "IP licensing, publishing conglomerates, scalable architectural ventures.",
        "relationship_advice": "Balance demanding work schedule with intentional emotional intimacy.",
        "shadow_wound": "High perfectionism creating severe frustration when team falls short."
    }
}

LOSHU_ARROWS: Dict[str, Dict[str, Any]] = {
    "arrow_of_intellect": {
        "numbers": [4, 9, 2],
        "name": "Arrow of Deep Intellect & Memory",
        "present_desc": "Extraordinary mental retention, strategic foresight, high intellectual agility.",
        "missing_desc": "Over-reliance on intuition without structured analytical frameworks."
    },
    "arrow_of_spirituality": {
        "numbers": [3, 5, 7],
        "name": "Arrow of Spiritual Understanding & Serenity",
        "present_desc": "Natural philosophical wisdom, emotional equilibrium, healing resonance.",
        "missing_desc": "Prone to cynicism or restlessness; benefits from structured mindfulness."
    },
    "arrow_of_determination": {
        "numbers": [1, 5, 9],
        "name": "Arrow of Unyielding Determination",
        "present_desc": "Relentless perseverance, overcomes extreme adversity, finishes what is started.",
        "missing_desc": "Vacillating willpower; needs external accountability systems."
    },
    "arrow_of_prosperity": {
        "numbers": [8, 1, 6],
        "name": "Arrow of Practical Material Manifestation",
        "present_desc": "Grounded commercial acumen, real-world execution, wealth accumulation skills.",
        "missing_desc": "Idealistic visionary who must partner with operational executors."
    }
}

def get_mb_matrix_insight(mulank: int, bhagyank: int) -> Dict[str, Any]:
    key = f"{mulank}_{bhagyank}"
    if key in MB_MATRIX_KNOWLEDGE:
        return MB_MATRIX_KNOWLEDGE[key]
    return {
        "title": f"Mulank {mulank} × Bhagyank {bhagyank} Synthesis",
        "archetype": f"Archetype {mulank}-{bhagyank}",
        "dynamics": f"Harmonizing the direct personality of number {mulank} with life destiny path {bhagyank}.",
        "wealth_strategy": "Focus on value-first ventures aligned with your core planetary rulers.",
        "relationship_advice": "Cultivate transparent communication and mutual autonomy.",
        "shadow_wound": "Balancing internal impulse with long-term destiny trajectory."
    }

def analyze_loshu_arrows(loshu_grid: Dict[str, int]) -> List[Dict[str, Any]]:
    results = []
    for arrow_id, data in LOSHU_ARROWS.items():
        nums = data["numbers"]
        is_complete = all(loshu_grid.get(str(n), 0) > 0 for n in nums)
        is_empty = all(loshu_grid.get(str(n), 0) == 0 for n in nums)

        if is_complete:
            results.append({
                "arrow": data["name"],
                "status": "active",
                "type": "strength",
                "description": data["present_desc"]
            })
        elif is_empty:
            results.append({
                "arrow": data["name"],
                "status": "missing",
                "type": "growth_challenge",
                "description": data["missing_desc"]
            })
    return results
