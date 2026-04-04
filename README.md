<div align="center">

# Insurix
### AI-Powered Income Protection for India's Gig Delivery Workers

> Ravi has delivered for Swiggy for 3 years. Never a fake claim. When Chennai flooded last July, he lost Rs.2,400 in 4 days with zero compensation. No safety net. No insurance. Nothing.
> Insurix exists for Ravi — and it is smart enough to know he is not the problem.

[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![MySQL](https://img.shields.io/badge/MySQL_8-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML-orange?style=flat-square)](https://xgboost.readthedocs.io)
[![DEVTrails 2026](https://img.shields.io/badge/DEVTrails_2026-Guidewire-0057A8?style=flat-square)](https://guidewire.com)

</div>

---

## The Problem

India has 15+ million gig delivery workers on platforms like Zomato and Swiggy. These workers depend entirely on being able to ride and deliver every day. But external disruptions — heavy rain, extreme heat, curfews, platform outages — regularly stop them from working.

When that happens, they lose income. No one compensates them. There is currently **no insurance product** built for this reality.

The impact is severe: **20–30% of monthly income wiped out** by events completely outside their control.

Insurix solves this by automatically detecting disruptions, raising a claim on the rider's behalf, and paying out their lost income — with zero paperwork and zero manual effort from the rider.

---

## How It Works

Insurix is a **mobile-first parametric insurance platform** built for Zomato and Swiggy delivery partners in Tier 1 and Tier 2 Indian cities.

**What is parametric insurance?**

In traditional insurance, you file a claim manually and wait weeks for approval. Parametric insurance works differently — when a verified disruption (like a flood or extreme heat) crosses a defined threshold, the payout happens **automatically**. No forms. No waiting. No human approval needed. The trigger itself is the proof.

**Important:** Insurix covers **income loss only**. Vehicle repairs, health issues, accidents, and life insurance are strictly outside the scope of this platform.

---

## Persona

The platform is built specifically for one type of user — food delivery partners on Zomato and Swiggy.

| Attribute | Detail |
|---|---|
| Who | Food Delivery Partners on Zomato / Swiggy |
| Where | Tier 1 & Tier 2 Indian cities |
| Average weekly earnings | Rs.3,000 – Rs.6,000 |
| Working hours | 8–12 hours/day, 6 days/week |
| Payout cycle | Weekly |
| Platform | Mobile-first Progressive Web App (PWA) |
| Coverage | Income loss only — no vehicles, no health, no accidents |

---

## Platform Choice

Insurix is built as a **mobile-first, PWA-style responsive web application** rather than a native app or desktop site.

Our users are Zomato and Swiggy riders working entirely on low-end Android smartphones with limited storage and unstable networks. A native app creates unnecessary friction. A mobile-first web platform runs directly in the browser — no installation needed — while still delivering a full app-like experience.

- No installation — accessible from any browser instantly
- Runs on low-end devices without high storage usage
- Optimised for slow or unstable networks
- Supports offline caching and push notifications in future phases

---

## Optimised Onboarding

The use case requires onboarding optimised for delivery partners. Insurix achieves policy activation in under 90 seconds:

- Phone OTP login — no email or password required
- Auto-detect delivery zone via GPS on signup
- Platform pre-fill via referral code (Zomato/Swiggy partner links)
- UPI ID verified via micro-deposit simulation
- AI premium quote generated instantly after zone is confirmed
- One-tap plan selection and policy activation

No unnecessary steps. No friction. Designed for a rider who is between deliveries.

---

## Parametric Triggers

Insurix monitors 5 types of disruptions every 15 minutes using real-time data APIs. When any disruption crosses its threshold, claims are automatically created for all insured riders in the affected zone. The rider does not need to do anything.

| Trigger | Threshold | Payout |
|---|---|---|
| Heavy Rainfall | More than 50mm of rain in 3 hours | 100% of daily income |
| Extreme Heat | Above 43°C for 4 or more hours | 50% of daily income |
| Severe Pollution | AQI above 300 | 50% of daily income |
| Curfew / Strike | Verified civic order active | 100% of daily income |
| Platform Outage | App downtime exceeding 2 hours | Pro-rated based on downtime |

---

## Income Loss Calculation

Insurix does not pay flat amounts. Every payout is calculated based on the rider's actual declared earnings.

**How it works:**

```
Hourly rate  =  Average daily income / Working hours per day
Payout       =  Hourly rate × Disruption duration hours
               (capped by the plan's daily and weekly limits)
```

**Example — Ravi, Premium plan, Chennai flood:**

| Input | Value |
|---|---|
| Average daily income | Rs.700 |
| Working hours/day | 10 hrs |
| Hourly rate | Rs.70/hr |
| Flood duration | 6 hours |
| Calculated payout | Rs.420 |
| Plan daily cap | Rs.500 |
| Final payout | Rs.420 (within cap) |

For full-day disruptions (curfew, severe flood), the daily income figure is paid out directly up to the plan cap.

---

## Weekly Premium Model

Gig workers earn weekly, so Insurix charges weekly — no monthly lock-ins, no long-term commitments.

Insurix uses a **Trust Score** to personalise how much each rider pays. The Trust Score (explained in the next section) reflects how long a rider has been active, their claim history, and their overall behaviour on the platform. Riders who have been consistently active with a clean record are rewarded with lower premiums and higher coverage.

| Plan | Weekly Premium | Max Daily Payout | Max Weekly Payout |
|---|---|---|---|
| Basic | Rs.49 | Rs.300 | Rs.1,500 |
| Standard | Rs.69 | Rs.400 | Rs.2,000 |
| Premium | Rs.99 | Rs.500 | Rs.2,500 |

The rider selects a plan, but the final weekly price they pay is adjusted by the AI model based on their Trust Score, zone risk, and season.

**Example:** Ravi (3 years on platform, clean record) on the Premium plan in Andheri during monsoon pays Rs.61/week. A brand new rider on the same plan in the same zone pays Rs.99/week.

---

## AI / ML Architecture

### 1. Dynamic Premium Calculation

**What it does:** Calculates a personalised weekly premium for each rider instead of charging everyone a flat rate.

**How it works:** An XGBoost regression model takes the following inputs and outputs a personalised price:

| Input | What it represents |
|---|---|
| Zone risk score | How flood/heat/rain-prone the rider's delivery area is |
| Seasonal index | Premiums go up slightly during monsoon months |
| Trust Score | Higher trust = lower premium |
| Claim history | More than 2 past claims adds a 10% surcharge |
| Weekly activity hours | More hours = more exposure = slight adjustment |

**Training data:** Synthetic dataset of 10,000 rider profiles.
**Integration:** Node.js backend calls the Python model via `child_process`.

---

### 2. Fraud Detection

Insurix uses a three-layer fraud detection system to make sure payouts only go to riders with genuine claims.

**Layer 1 — Basic Rule Checks (runs instantly)**

Before anything else, every claim is checked for:
- Is the rider actually registered in the zone where the disruption happened?
- Has this exact claim already been filed? (duplicate check)
- Does the rider's GPS location match their registered delivery zone?
- Was the rider actually active on the delivery platform that day?

**Layer 2 — Machine Learning Model**

An Isolation Forest model (an anomaly detection algorithm) analyses the claim against the rider's historical behaviour. It looks at how frequently they claim, the timing of the claim, how well their location matches the disruption zone, and whether their platform activity during the disruption makes sense.

**Layer 3 — Trust Score Override**

Riders with a high Trust Score (long tenure, clean history) get their claims fast-tracked. Riders with a low Trust Score (new accounts, suspicious history) go through all checks regardless of other signals.

**Final decision:**

| Fraud Score | Trust Level | Decision |
|---|---|---|
| Low | Any | Auto Approve |
| Medium | High trust rider | Auto Approve |
| Medium | Low trust rider | Rapid Verification (60 seconds) |
| High | Any | Auto Reject with explanation |

---

### 3. The Trust Score

The Trust Score is a number between 0 and 100 assigned to every rider. It is recalculated every Sunday night and reflects how trustworthy and consistent the rider has been on the platform.

**What goes into the Trust Score:**

| Factor | Weight | What it measures |
|---|---|---|
| Platform tenure | 25% | How long they have been delivering |
| Claim history | 30% | Whether past claims were clean and genuine |
| Activity consistency | 20% | Regular working hours, no sudden gaps |
| Zone stability | 15% | Consistent delivery area, no erratic movements |
| Verification compliance | 10% | Whether they responded correctly when asked to verify |

**Why this matters:** A fraudster cannot simply sign up and immediately access high payouts. They would need months of consistent, clean activity to build a high Trust Score. This makes fraud economically irrational.

---

### 4. Predictive Analytics

The system forecasts next week's expected claim volume by geographic zone. This is done by combining weather forecast APIs with historical claim patterns. The result is displayed on the Admin Dashboard so that the insurer can pre-fund payout wallets **before** a disruption happens — not scramble after it.

---

### 5. Platform Activity Validation

Insurix validates whether a rider was genuinely unable to work — not just whether the weather was bad.

| Method | Current Status |
|---|---|
| Mock platform webhook | Simulates Zomato/Swiggy order suspension events |
| Rider app activity signal | Checks whether the delivery app was active during disruption |
| GPS zone cross-validation | Confirms rider was in the affected zone |
| Future: Platform API partnership | Direct integration with Zomato/Swiggy order APIs |

This ensures claims are tied to actual lost work — not just adverse weather in a city.

---

## Business Viability

Insurix is designed to be financially sustainable from day one.

**Premium pool:** Across 1,000 riders paying an average of Rs.70/week, the weekly premium pool is Rs.70,000. Historical disruption data for Indian metros suggests major trigger events affect 10–20% of riders per week on average — making payouts manageable within the pool.

**Zone-based risk balancing:** Flood-prone zones (Mumbai, Chennai) are priced higher. Low-risk zones generate surplus that cross-subsidises high-risk payouts — the same model used by all parametric insurers globally.

**Fraud reduction impact:** Our Trust Score and 6-layer anti-spoofing system directly reduce false claims. A 5% reduction in fraudulent payouts on a Rs.70,000 weekly pool saves Rs.3,500/week.

**Growth path:** Platform partnerships with Zomato and Swiggy allow premium deduction directly from weekly rider payouts — zero collection friction. Reinsurance partnerships become viable at scale (10,000+ riders).

---

## Adversarial Defense & Anti-Spoofing Strategy

> **The Market Crash scenario:** 500 delivery workers in a Tier-1 city, coordinating via Telegram, used GPS-spoofing apps to fake their location inside a red-alert flood zone — triggering mass false payouts and draining the liquidity pool within hours.
>
> Here is exactly how Insurix detects and blocks this attack.

---

### Why GPS Alone Is Not Enough

A GPS-spoofing app lets any phone report any location. If Insurix only checked GPS coordinates, the 500-rider attack would have succeeded. Our system does not rely on GPS alone.

**The core principle:** A real rider caught in a flood produces consistent signals across 6 independent data sources at the same time. A fraudster using a spoofing app can only fake one of them. Faking all 6 simultaneously is practically impossible.

---

### The 6-Layer Signal Check

Every claim is evaluated across these 6 layers:

| Layer | What we check | What fraud looks like |
|---|---|---|
| GPS | Device location coordinates | Static location, no natural drift or movement |
| Network | IP address and internet provider | Home WiFi IP does not match a delivery zone cell tower |
| Motion | Accelerometer data from the phone | Zero movement even though the rider claims to be outdoors |
| Environment | Weather API data at the claimed location | No rain or heat event actually happening at that GPS point |
| Platform | Delivery app activity logs | App was open and receiving orders during the claimed disruption |
| Trust Score | Account history and tenure | Brand new account filing its very first claim |

Each layer gives a verdict — genuine, suspicious, or fraudulent. The system adds these up into a **Consistency Score**:

- Score 75–100: Genuine. Auto-approve.
- Score 40–74: Uncertain. Send for Rapid Verification (60 seconds).
- Score 0–39: Fraudulent. Auto-reject and flag the account.

---

### How The 500-Rider Attack Gets Caught

The fraud ring fails at 4 layers simultaneously:

**Network layer:** GPS-spoofing apps run at home on WiFi. The IP address shows a residential internet provider — not a delivery zone cell tower. This is an immediate red flag.

**Motion layer:** A person sitting at home has zero accelerometer movement. A real rider sheltering from a flood still moves slightly — breathing, shifting, repositioning. A perfectly still phone is a known spoofing signature.

**Platform layer:** During a genuine flood, Zomato and Swiggy suspend deliveries. Platform logs would show no order attempts. A fraudster at home would show normal app browsing — completely inconsistent with being stranded outdoors.

**Trust Score layer:** The 500-rider ring would almost certainly be made up of new or low-activity accounts — exactly the accounts our system treats with maximum scrutiny.

All 500 riders score below 39 on the Consistency Score. The entire group is frozen before a single payout is processed. **Liquidity pool: untouched.**

---

### Detecting a Coordinated Fraud Ring

Individual fraud is one problem. A coordinated ring of 500 people is another. When hundreds of people act together at the same time, they produce a statistical pattern that is impossible under natural conditions.

| Signal | What real disaster claims look like | What coordinated fraud looks like |
|---|---|---|
| Time of filing | Spread over 8–25 minutes after trigger | All filed within 60–180 seconds |
| Location spread | Random across the affected zone | Clustered in residential neighbourhoods |
| Account age | Mix of old and new accounts | Mostly brand new accounts |
| Trust Scores | Normal distribution | Heavy cluster in the 0–39 range |

Insurix runs a clustering algorithm (DBSCAN) on every batch of incoming claims after a trigger event. If a suspicious cluster of claims is detected — same location, same time, low trust scores — the entire cluster is frozen for review while genuine individual claims outside the cluster are approved normally.

```python
def detect_fraud_ring(claims, trigger_time):
    vectors = [(c.lat, c.lng, c.filed_at) for c in claims]
    clusters = DBSCAN(eps=0.5, min_samples=10).fit(vectors)

    for cluster in clusters:
        latency = max(c.filed_at for c in cluster) - trigger_time
        avg_trust = mean(c.rider.trust_score for c in cluster)

        if latency < 120 and avg_trust < 35:
            freeze_cluster_payouts(cluster)
            alert_admin_dashboard(cluster)

    approve_clean_claims(claims - flagged_clusters)
```

---

### Protecting Honest Riders Who Get Flagged

A genuine rider in a dense urban area may have poor GPS accuracy due to nearby buildings, a weak network causing an IP mismatch, or a cheap phone with an unreliable motion sensor. Insurix does not punish riders for their hardware.

When a claim is soft-flagged (Consistency Score 40–74), the rider goes through a **Rapid Verification Flow** — one single step, under 60 seconds:

```
Claim soft-flagged
        |
One verification step — chosen based on which signal was weakest:
  GPS was weak?      Tap your location on a map
  Motion was zero?   Record a 3-second video of your surroundings
  Network mismatch?  Confirm your delivery zone from a dropdown
        |
Decision made in under 30 seconds
        |
Approved → Instant payout
Rejected → Plain explanation in the rider's language + one-tap appeal
```

Riders with a high Trust Score never reach this step — their history speaks for itself and their claims are auto-approved even if one signal is slightly off.

**Grace window for new accounts:**

| Account age | Treatment on first flag |
|---|---|
| Less than 30 days | Auto-approve with background monitoring |
| 30 to 180 days | Rapid Verification required |
| Over 180 days, clean history | Auto-approve, silent background audit |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 + Vite | Builds the user interface |
| TailwindCSS | Handles all styling |
| React Router v6 | Manages navigation between pages |
| Zustand | Manages app-wide state |
| TanStack React Query | Handles data fetching and caching |
| Recharts | Renders all charts and graphs |
| React Leaflet | Displays the live trigger zone map |
| Axios | Makes HTTP requests to the backend |

### Backend

| Technology | Purpose |
|---|---|
| Node.js 20 + Express.js | Runs the REST API server |
| MySQL 8 | Stores all application data |
| Sequelize ORM | Manages database models and queries |
| node-cron | Runs trigger monitoring every 15 minutes and recalculates Trust Scores weekly |
| JWT + bcrypt | Handles authentication and password security |
| Redis | Caches real-time trigger data for speed |

### AI / ML

| Technology | Purpose |
|---|---|
| Python 3.11 | Runs all machine learning models |
| XGBoost | Predicts personalised weekly premiums |
| scikit-learn | Runs fraud detection and ring clustering |
| joblib | Saves and loads trained models |

---

## External APIs

| Service | What it provides | Mode |
|---|---|---|
| OpenWeatherMap | Rainfall and temperature data | Free tier |
| AQICN | Air Quality Index data | Free tier |
| Civic Alert Feed | Curfew and strike information | Mock JSON |
| Platform Webhook | Delivery app outage detection | Mock |
| Razorpay | UPI payout processing | Test mode |

---

## Database Schema

| Table | Fields |
|---|---|
| users | id, phone, name, zone_id, platform, weekly_hours, upi_id, trust_score, tenure_days |
| zones | id, city, area_name, risk_score, lat, lng |
| policies | id, user_id, plan_tier, weekly_premium, start_date, end_date, status |
| claims | id, policy_id, trigger_type, trigger_value, status, amount, consistency_score, fraud_risk_score |
| payouts | id, claim_id, amount, method, transaction_id, status |
| triggers_log | id, zone_id, trigger_type, value, recorded_at |
| trust_history | id, user_id, score, recalc_date, factors_json |
| fraud_clusters | id, trigger_id, cluster_id, member_count, avg_trust, action_taken |

---

## Application Workflow

### How a rider uses Insurix

**Step 1 — Sign up**
The rider enters their phone number, receives an OTP, sets up their profile, selects their delivery zone, and adds their UPI ID.

**Step 2 — Buy a policy**
The rider picks a plan (Basic, Standard, or Premium). Insurix's AI calculates their personalised weekly premium based on their Trust Score, zone, and season. They make a mock payment and their policy goes live.

**Step 3 — Disruption happens (automatic)**
The background job detects a disruption in the rider's zone. A claim is automatically created. It passes through the 6-layer check, Trust Score evaluation, and fraud detection. If approved, the payout is sent to the rider's UPI. The rider receives a push notification. They did not need to do anything.

**Step 4 — Manual fallback**
If a rider wants to report a disruption manually, they tap "I couldn't work today." The system cross-validates their report against real-time API data and either approves or rejects the claim with a plain-language explanation.

---

## Claim Lifecycle

```
AUTO_INITIATED
      |
6-LAYER CONSISTENCY CHECK
      |
CLUSTER ANALYSIS (ring detection)
      |
TRUST SCORE EVALUATION
      |
FRAUD ML CHECK
      |
RISK SCORE ENGINE
      |
APPROVED / RAPID VERIFY / REJECTED
      |
PAYOUT PROCESSING
      |
PAYOUT SUCCESS
      |
Push Notification to Rider
```

---

## Trigger Monitor Architecture

```
node-cron runs every 15 minutes
      |
      ├── OpenWeatherMap  →  checks rain and temperature
      ├── AQICN           →  checks air quality index
      ├── Mock Civic Feed →  checks for curfews and strikes
      └── Mock Platform   →  checks for app outages
      |
Did any threshold get crossed?
      |
Yes → Auto-create claims for all insured riders in the affected zone
      |
Run 6-layer check + cluster analysis + Trust Score + fraud ML
      |
Approved → Razorpay payout → Push notification to rider
```

---

## Development Timeline

| Phase | Dates | Theme | Deliverables |
|---|---|---|---|
| Phase 1 — Seed | Mar 4 – Mar 20 | Ideation & Foundation | README, DB schema, Trust Score design, onboarding UI, premium calculator |
| Phase 2 — Scale | Mar 21 – Apr 4 | Automation & Protection | Authentication, policy management, ML pricing live, trigger monitors, Trust Score engine |
| Phase 3 — Soar | Apr 5 – Apr 17 | Scale & Optimize | Full fraud pipeline, DBSCAN ring detection, payout simulation, dashboards, pitch deck |

---

## Dashboards

**Rider Dashboard**
Shows the rider their Trust Score and progress toward the next tier, how much of their weekly income is protected, their active policy details, their claims history with plain-language status updates, and a weather risk forecast for their zone for the week ahead.

**Admin / Insurer Dashboard**
Shows a live map of active trigger zones with fraud cluster heatmaps overlaid, a loss ratio gauge, a breakdown of claims by trigger type and zone, a fraud alert queue for manual review, a predictive claims forecast for the coming week, and a distribution of Trust Scores across the entire rider base.

---

## Getting Started

### Prerequisites
- Node.js version 20 or above
- Python version 3.11 or above
- MySQL version 8 or above
- Redis

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/insurix.git
cd insurix

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Install Python ML dependencies
cd ../ml && pip install xgboost scikit-learn joblib

# Set up environment variables
cp .env.example server/.env
# Open server/.env and fill in your values

# Create and seed the database
mysql -u root -p -e "CREATE DATABASE insurix;"
cd server && node sync.js && node seeds/zones.js
```

### Run the App

```bash
# Start the backend (runs on port 5000)
cd server && npm run dev

# Start the frontend (runs on port 5173)
cd client && npm run dev
```

Open in your browser: `http://localhost:5173`

---

## Environment Variables

```env
PORT=5000
DB_HOST=localhost
DB_NAME=insurix
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_key
AQI_API_KEY=your_key
RAZORPAY_TEST_KEY=your_key
RAZORPAY_TEST_SECRET=your_secret
```



<div align="center">

**Insurix — Built for the rider who never cheated the system.**

*Guidewire DEVTrails 2026 — Seed. Scale. Soar.*

</div>
