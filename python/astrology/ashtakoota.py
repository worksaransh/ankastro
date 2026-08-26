from typing import Dict, Any, Tuple

# 8 Ashtakoota Kootas
# 1. Varna (1 pt), 2. Vashya (2 pts), 3. Tara (3 pts), 4. Yoni (4 pts),
# 5. Graha Maitri (5 pts), 6. Gana (6 pts), 7. Bhakoot (7 pts), 8. Nadi (8 pts) = Total 36

def calculate_ashtakoota_match(boy_moon_sign_idx: int, boy_nak_idx: int, girl_moon_sign_idx: int, girl_nak_idx: int) -> Dict[str, Any]:
    # 1. Varna (1)
    varna_boy = boy_moon_sign_idx % 4
    varna_girl = girl_moon_sign_idx % 4
    varna_score = 1.0 if varna_boy >= varna_girl else 0.0

    # 2. Vashya (2)
    vashya_score = 2.0 if boy_moon_sign_idx == girl_moon_sign_idx else 1.0

    # 3. Tara (3)
    tara_diff = (girl_nak_idx - boy_nak_idx) % 9
    tara_score = 3.0 if tara_diff in [1, 2, 4, 6, 8] else 1.5

    # 4. Yoni (4)
    yoni_boy = boy_nak_idx % 14
    yoni_girl = girl_nak_idx % 14
    yoni_score = 4.0 if yoni_boy == yoni_girl else 2.0

    # 5. Graha Maitri (5)
    maitri_score = 5.0 if boy_moon_sign_idx == girl_moon_sign_idx else 3.5

    # 6. Gana (6)
    gana_boy = boy_nak_idx % 3  # 0: Deva, 1: Manushya, 2: Rakshasa
    gana_girl = girl_nak_idx % 3
    if gana_boy == gana_girl:
        gana_score = 6.0
    elif (gana_boy == 0 and gana_girl == 1) or (gana_boy == 1 and gana_girl == 0):
        gana_score = 5.0
    else:
        gana_score = 1.0

    # 7. Bhakoot (7)
    dist = abs(boy_moon_sign_idx - girl_moon_sign_idx)
    bhakoot_score = 0.0 if dist in [1, 5, 7] else 7.0

    # 8. Nadi (8)
    nadi_boy = boy_nak_idx % 3  # 0: Aadi, 1: Madhya, 2: Antya
    nadi_girl = girl_nak_idx % 3
    nadi_score = 0.0 if nadi_boy == nadi_girl else 8.0

    total_score = varna_score + vashya_score + tara_score + yoni_score + maitri_score + gana_score + bhakoot_score + nadi_score
    max_score = 36.0

    verdict = "Excellent" if total_score >= 28 else "Good" if total_score >= 18 else "Average / Remedial Guidance Advised"

    return {
        "total_score": round(total_score, 1),
        "max_score": max_score,
        "percentage": round((total_score / max_score) * 100, 1),
        "verdict": verdict,
        "kootas": {
            "varna": {"score": varna_score, "max": 1, "name": "Varna (Spiritual Compatibility)"},
            "vashya": {"score": vashya_score, "max": 2, "name": "Vashya (Mutual Dominance & Influence)"},
            "tara": {"score": tara_score, "max": 3, "name": "Tara (Destiny & Longevity Vibration)"},
            "yoni": {"score": yoni_score, "max": 4, "name": "Yoni (Physical & Intimacy Harmony)"},
            "maitri": {"score": maitri_score, "max": 5, "name": "Graha Maitri (Mental & Friendship Wave)"},
            "gana": {"score": gana_score, "max": 6, "name": "Gana (Temperament & Lifestyle Alignment)"},
            "bhakoot": {"score": bhakoot_score, "max": 7, "name": "Bhakoot (Emotional Health & Wealth Flow)"},
            "nadi": {"score": nadi_score, "max": 8, "name": "Nadi (Genetic, Physiological & Soul Resonance)"}
        }
    }
