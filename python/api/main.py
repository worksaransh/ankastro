from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from python.common.config import settings
from python.common.security import verify_internal_api_key
from python.common.models import (
    BirthProfileInput,
    NumerologyCalculationResult,
    VedicAstrologyResult,
    AIInterpretationRequest,
    RecommendationRequest,
    RecommendationItem
)
from python.numerology.calculator import calculate_numerology
from python.numerology.nikb_matrix import get_mb_matrix_insight, analyze_loshu_arrows
from python.astrology.vedic_engine import calculate_vedic_astrology
from python.astrology.ashtakoota import calculate_ashtakoota_match
from python.ai.grounded_engine import synthesize_grounded_interpretation
from python.recommendations.engine import generate_recommendations

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AnkJyotish AI Intelligence Layer",
        "version": "2.0.0",
        "timestamp": "2026-08-26T10:00:00Z"
    }

@app.post(
    f"{settings.API_V1_STR}/calculate/numerology",
    response_model=NumerologyCalculationResult,
    dependencies=[Depends(verify_internal_api_key)]
)
def api_calculate_numerology(profile: BirthProfileInput):
    return calculate_numerology(profile)

@app.post(
    f"{settings.API_V1_STR}/calculate/astrology",
    response_model=VedicAstrologyResult,
    dependencies=[Depends(verify_internal_api_key)]
)
def api_calculate_astrology(profile: BirthProfileInput):
    return calculate_vedic_astrology(profile)

@app.post(
    f"{settings.API_V1_STR}/interpret",
    dependencies=[Depends(verify_internal_api_key)]
)
async def api_interpret(req: AIInterpretationRequest):
    return await synthesize_grounded_interpretation(req)

@app.post(
    f"{settings.API_V1_STR}/recommend",
    response_model=List[RecommendationItem],
    dependencies=[Depends(verify_internal_api_key)]
)
def api_recommend(req: RecommendationRequest):
    return generate_recommendations(req)

@app.get(
    f"{settings.API_V1_STR}/compatibility/ashtakoota",
    dependencies=[Depends(verify_internal_api_key)]
)
def api_ashtakoota(boy_moon: int, boy_nak: int, girl_moon: int, girl_nak: int):
    return calculate_ashtakoota_match(boy_moon, boy_nak, girl_moon, girl_nak)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("python.api.main:app", host="0.0.0.0", port=8000, reload=True)
