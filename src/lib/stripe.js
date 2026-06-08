import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    'seeker_pro': 'price_1Tfy9kRxZHPalCoFACHczqH9',
    'seeker_premium': 'price_1Tg7lVRxZHPalCoFVdKYa2Ml',
    'recruiter_growth': 'price_1Tg892RxZHPalCoFTAD1t0J5',
    'recruiter_enterprise': 'price_1Tg8A4RxZHPalCoFw1rS43QA'
}
