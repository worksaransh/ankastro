import sys
import os
import datetime

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from python.common.models import BirthProfileInput, RecommendationRequest
from python.numerology.calculator import calculate_numerology
from python.astrology.vedic_engine import calculate_vedic_astrology
from python.astrology.ashtakoota import calculate_ashtakoota_match
from python.recommendations.engine import generate_recommendations

def test_numerology_calculation():
    profile = BirthProfileInput(
        full_name="Saransh Gulati",
        dob=datetime.date(1995, 10, 19),
        birth_time="14:30"
    )
    result = calculate_numerology(profile)
    assert result.mulank == 1  # 19 -> 1+9=10 -> 1
    assert result.compound_number == 19
    assert result.compound_name == "The Prince of Heaven / Royal Victor"
    assert result.ruling_planet == "Sun (Surya)"
    assert result.verified is True
    assert len(result.pinnacles) == 4
    assert len(result.challenges) == 4

def test_vedic_astrology_calculation():
    profile = BirthProfileInput(
        full_name="Saransh Gulati",
        dob=datetime.date(1995, 10, 19),
        birth_time="14:30",
        latitude=28.6139,
        longitude=77.2090
    )
    result = calculate_vedic_astrology(profile)
    assert result.lagna is not None
    assert len(result.planets) == 9
    assert result.verified is True
    assert result.current_mahadasha is not None

def test_ashtakoota_match():
    # Test sample moon signs and nakshatra indices
    res = calculate_ashtakoota_match(0, 0, 0, 0)
    assert res["total_score"] >= 0
    assert res["max_score"] == 36.0
    assert "kootas" in res

def test_recommendation_engine():
    req = RecommendationRequest(
        mulank=1,
        bhagyank=8,
        life_stage="working"
    )
    recs = generate_recommendations(req)
    assert len(recs) >= 3
    assert any(r.item_type == "tshirt" for r in recs)
    assert any(r.item_type == "gemstone" for r in recs)

if __name__ == "__main__":
    print("Running Python Intelligence Engine Unit Tests...")
    test_numerology_calculation()
    print("  [OK] Numerology Calculation Engine: Passed")
    test_vedic_astrology_calculation()
    print("  [OK] Vedic Astrology Engine: Passed")
    test_ashtakoota_match()
    print("  [OK] Ashtakoota Gun Milan Engine: Passed")
    test_recommendation_engine()
    print("  [OK] Recommendation Engine: Passed")
    print("ALL TESTS PASSED SUCCESSFULLY!")
