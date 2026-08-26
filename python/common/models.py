from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date

class BirthProfileInput(BaseModel):
    full_name: str = Field(..., example="Saransh Gulati")
    dob: date = Field(..., example="1995-10-19")
    birth_time: Optional[str] = Field(None, example="14:30")
    birth_place: Optional[str] = Field(None, example="New Delhi, India")
    latitude: Optional[float] = Field(28.6139, example=28.6139)
    longitude: Optional[float] = Field(77.2090, example=77.2090)
    gender: Optional[str] = Field("male", example="male")
    current_year: Optional[int] = Field(2026, example=2026)

class NumerologyCalculationResult(BaseModel):
    mulank: int
    bhagyank: int
    name_number: int
    soul_urge_number: int
    personality_number: int
    karmic_debts: List[int]
    master_numbers: List[int]
    loshu_grid: Dict[str, int]
    missing_numbers: List[int]
    present_numbers: List[int]
    personal_year: int
    personal_month: int
    personal_day: int
    compound_number: int
    compound_name: str
    planes_of_expression: Dict[str, int]
    pinnacles: List[int]
    challenges: List[int]
    ruling_planet: str
    lucky_colors: List[str]
    lucky_days: List[str]
    lucky_gemstones: List[str]
    neutral_numbers: List[int]
    enemy_numbers: List[int]
    verified: bool = True

class PlanetPosition(BaseModel):
    name: str
    rashi: str
    rashi_lord: str
    degree: float
    nakshatra: str
    nakshatra_pada: int
    nakshatra_lord: str
    house: int
    is_retrograde: bool
    dignity: str  # 'exalted', 'mooltrikona', 'own', 'friendly', 'neutral', 'enemy', 'debilitated'

class VedicAstrologyResult(BaseModel):
    lagna: str
    lagna_lord: str
    moon_sign: str
    sun_sign: str
    nakshatra: str
    nakshatra_pada: int
    planets: List[PlanetPosition]
    houses: Dict[int, str]
    current_mahadasha: str
    current_antardasha: str
    active_yogas: List[Dict[str, Any]]
    ashtakavarga_points: Dict[str, int]
    verified: bool = True

class RecommendationRequest(BaseModel):
    user_id: Optional[str] = None
    mulank: int
    bhagyank: int
    zodiac: Optional[str] = None
    life_stage: Optional[str] = "working"
    interests: Optional[List[str]] = []

class RecommendationItem(BaseModel):
    item_type: str  # 'tshirt', 'gemstone', 'report', 'remedy', 'affiliate'
    title: str
    slug: str
    price: float
    reason: str
    confidence: float
    source_rule: str
    image_url: Optional[str] = None
    target_url: Optional[str] = None

class AIInterpretationRequest(BaseModel):
    profile: BirthProfileInput
    numerology: Optional[NumerologyCalculationResult] = None
    astrology: Optional[VedicAstrologyResult] = None
    user_query: Optional[str] = None
    report_pillar: Optional[str] = "overview"
    language: Optional[str] = "en"  # 'en', 'hi', 'hinglish'
