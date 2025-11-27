#!/usr/bin/env python3
"""
Environment Configuration Validator for PopStruct
Checks if all required environment variables are set
"""

import os
import sys
from urllib.parse import urlparse

def validate_env():
    """Validate environment configuration"""
    errors = []
    warnings = []

    print("=" * 60)
    print("PopStruct Environment Validation")
    print("=" * 60)
    print()

    # Required variables
    required = {
        'DATABASE_URL': 'PostgreSQL connection string (from Neon)',
        'REDIS_URL': 'Redis connection string (from Upstash)',
        'SECRET_KEY': 'JWT secret key (min 32 characters)',
        'ALLOWED_ORIGINS': 'CORS allowed origins',
    }

    # Optional but recommended
    optional = {
        'CELERY_BROKER_URL': 'Celery broker URL (usually same as REDIS_URL)',
        'CELERY_RESULT_BACKEND': 'Celery result backend (usually same as REDIS_URL)',
        'STRIPE_SECRET_KEY': 'Stripe API key for payments',
        'SMTP_HOST': 'SMTP server for email',
    }

    # Check required variables
    print("Checking Required Variables:")
    print("-" * 60)

    for var, description in required.items():
        value = os.getenv(var)
        if not value:
            print(f"❌ {var}: MISSING")
            errors.append(f"{var} is required ({description})")
        elif value.startswith('<') or 'CHANGE' in value.upper():
            print(f"⚠️  {var}: NOT CONFIGURED")
            errors.append(f"{var} needs to be updated from template")
        else:
            print(f"✅ {var}: SET")

            # Additional validation
            if var == 'DATABASE_URL':
                if not value.startswith('postgresql://'):
                    errors.append(f"{var} should start with postgresql://")
                else:
                    parsed = urlparse(value)
                    print(f"   → Host: {parsed.hostname}")

            elif var == 'REDIS_URL':
                if not value.startswith('redis://'):
                    errors.append(f"{var} should start with redis://")
                else:
                    parsed = urlparse(value)
                    print(f"   → Host: {parsed.hostname}")

            elif var == 'SECRET_KEY':
                if len(value) < 32:
                    errors.append(f"{var} should be at least 32 characters")
                else:
                    print(f"   → Length: {len(value)} characters")

    print()

    # Check optional variables
    print("Checking Optional Variables:")
    print("-" * 60)

    for var, description in optional.items():
        value = os.getenv(var)
        if not value:
            print(f"⚠️  {var}: NOT SET ({description})")
            warnings.append(f"{var} is optional but recommended")
        else:
            print(f"✅ {var}: SET")

    print()
    print("=" * 60)

    # Summary
    if errors:
        print("❌ VALIDATION FAILED")
        print()
        print("Errors:")
        for error in errors:
            print(f"  - {error}")
        print()
        print("Please fix the errors above and try again.")
        print()
        print("Need help? Check:")
        print("  - FREE_DEPLOYMENT.md for free tier setup")
        print("  - .env.free-tier for example configuration")
        return False
    else:
        print("✅ VALIDATION PASSED")
        if warnings:
            print()
            print("Warnings (optional):")
            for warning in warnings:
                print(f"  - {warning}")
        print()
        print("Your environment is configured correctly!")
        print()
        print("Next steps:")
        print("  1. Run database migrations: alembic upgrade head")
        print("  2. Start the backend: uvicorn app.main:app --reload")
        print("  3. Start the frontend: cd frontend && npm run dev")
        return True

if __name__ == '__main__':
    # Try to load .env file
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("Loaded .env file")
        print()
    except ImportError:
        print("Note: python-dotenv not installed")
        print("Install with: pip install python-dotenv")
        print()

    success = validate_env()
    sys.exit(0 if success else 1)
