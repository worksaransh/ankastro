from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from python.common.config import settings

api_key_header = APIKeyHeader(name="X-Internal-Secret", auto_error=False)

async def verify_internal_api_key(api_key: str = Security(api_key_header)):
    if not api_key or api_key != settings.SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing internal API key"
        )
    return True
