from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.core.config import settings
from app.models.user import User, SubscriptionTier
from pydantic import BaseModel
import razorpay

router = APIRouter()

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CreateOrderRequest(BaseModel):
    amount: int = settings.PREMIUM_PRICE_INR


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.get("/status")
async def get_subscription_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's subscription status and usage."""
    free_limit = 2
    jobs_remaining = max(0, free_limit - current_user.jobs_used) if current_user.subscription_tier == SubscriptionTier.FREE else -1

    return {
        "subscription_tier": current_user.subscription_tier.value,
        "jobs_used": current_user.jobs_used,
        "jobs_remaining": jobs_remaining,
        "can_create_job": current_user.subscription_tier == SubscriptionTier.PREMIUM or current_user.jobs_used < free_limit,
        "needs_upgrade": current_user.subscription_tier == SubscriptionTier.FREE and current_user.jobs_used >= free_limit
    }


@router.post("/create-order")
async def create_razorpay_order(
    request: CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a Razorpay order for premium upgrade."""
    if current_user.subscription_tier == SubscriptionTier.PREMIUM:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already on premium plan"
        )

    try:
        # Create Razorpay order
        order_data = {
            "amount": request.amount * 100,  # Convert to paise
            "currency": "INR",
            "notes": {
                "user_id": str(current_user.id),
                "email": current_user.email
            }
        }

        order = razorpay_client.order.create(data=order_data)

        # Store order ID
        current_user.razorpay_order_id = order['id']
        db.commit()

        return {
            "order_id": order['id'],
            "amount": request.amount,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}"
        )


@router.post("/verify-payment")
async def verify_payment(
    request: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Verify Razorpay payment and upgrade user to premium."""
    try:
        # Verify payment signature
        params_dict = {
            'razorpay_order_id': request.razorpay_order_id,
            'razorpay_payment_id': request.razorpay_payment_id,
            'razorpay_signature': request.razorpay_signature
        }

        razorpay_client.utility.verify_payment_signature(params_dict)

        # Payment verified, upgrade user
        current_user.subscription_tier = SubscriptionTier.PREMIUM
        current_user.razorpay_payment_id = request.razorpay_payment_id
        db.commit()

        return {
            "success": True,
            "message": "Payment verified and user upgraded to premium",
            "subscription_tier": SubscriptionTier.PREMIUM.value
        }
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment signature"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment verification failed: {str(e)}"
        )


@router.post("/increment-job-count")
async def increment_job_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Increment job count for free tier users."""
    if current_user.subscription_tier == SubscriptionTier.FREE:
        if current_user.jobs_used >= 2:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free tier limit reached. Please upgrade to premium."
            )
        current_user.jobs_used += 1
        db.commit()

    return {
        "jobs_used": current_user.jobs_used,
        "subscription_tier": current_user.subscription_tier.value
    }
