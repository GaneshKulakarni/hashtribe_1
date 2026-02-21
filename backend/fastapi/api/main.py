import time
import uuid
import os
from typing import Callable, Optional
from fastapi import FastAPI, Request, Response, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import structlog
from contextlib import asynccontextmanager
from pydantic_settings import BaseSettings

# Configuration
class Settings(BaseSettings):
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    RATE_LIMIT_DEFAULT: str = "100/hour"
    ENV: str = "development"
    
settings = Settings()

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()

# Initialize Rate Limiter
storage_uri = settings.REDIS_URL if settings.REDIS_URL else "memory://"
limiter = Limiter(key_func=get_remote_address, storage_uri=storage_uri)
app = FastAPI(title="HashTribe API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory analytics store (for demonstration)
# In production, this would be pushed to a database (PostgreSQL/TimescaleDB) or an ELK stack
analytics_data = {
    "total_requests": 0,
    "endpoints": {},
    "status_codes": {},
    "error_rates": 0,
    "avg_response_time": 0.0
}

# Custom Middleware for Usage Analytics
@app.middleware("http")
async def analytics_middleware(request: Request, call_next: Callable):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    # Track endpoint activity
    endpoint = request.url.path
    
    try:
        response = await call_next(request)
        status_code = response.status_code
    except Exception as e:
        status_code = 500
        logger.error("request_failed", request_id=request_id, error=str(e))
        raise e
    finally:
        process_time = time.time() - start_time
        process_time_ms = round(process_time * 1000, 2)
        
        # Update analytics (Simplified for MVP)
        analytics_data["total_requests"] += 1
        analytics_data["endpoints"][endpoint] = analytics_data["endpoints"].get(endpoint, 0) + 1
        analytics_data["status_codes"][status_code] = analytics_data["status_codes"].get(status_code, 0) + 1
        
        # Log structured analytics
        logger.info(
            "api_analytics",
            request_id=request_id,
            method=request.method,
            path=endpoint,
            status_code=status_code,
            duration_ms=process_time_ms,
            ip=request.client.host if request.client else "unknown",
        )
        
        # If rate limited, log as suspicious if repeated
        if status_code == 429:
            logger.warning("rate_limit_violation", ip=request.client.host, path=endpoint)

    response.headers["X-Request-ID"] = request_id
    return response

# Routes
@app.get("/")
@limiter.limit("60/minute")
async def root(request: Request):
    return {"message": "HashTribe Backend API"}

@app.get("/api/v1/analytics/summary")
@limiter.limit("5/minute")
async def get_analytics_summary(request: Request):
    """Admin endpoint to see usage patterns."""
    return analytics_data

@app.get("/api/v1/tribes")
@limiter.limit("20/minute")
async def list_tribes(request: Request):
    return {"data": [], "count": 0}

@app.get("/api/v1/health")
async def health():
    return {"status": "ok", "timestamp": time.time()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
