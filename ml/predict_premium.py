import sys, json, joblib, numpy as np
from xgboost import XGBRegressor

def predict(input_data):
    # Load trained model
    try:
        model = joblib.load('ml/models/premium_model.pkl')
    except:
        # Fallback rule-based calculation if model missing
        base = input_data['base_premium']
        zone_risk = input_data['zone_risk_score']
        seasonal = input_data['seasonal_index']
        trust = input_data['trust_score']
        
        # Higher zone risk = higher premium
        risk_multiplier = 0.8 + (zone_risk * 0.4)
        # Higher trust = lower premium (up to 20% discount)
        trust_multiplier = 1.0 - ((trust - 50) / 500)
        # Seasonal adjustment
        seasonal_multiplier = seasonal
        
        final = base * risk_multiplier * trust_multiplier * seasonal_multiplier
        final = max(base * 0.7, min(base * 1.3, final))
        final = round(final)
        
        # Generate human readable reason
        if trust >= 70:
            reason = "Lower rate — trusted rider with clean history"
        elif zone_risk > 0.7:
            reason = "Higher rate — high risk zone"
        elif seasonal > 1.0:
            reason = "Higher rate — monsoon season adjustment"
        else:
            reason = "Standard rate — new account building trust"
        
        return {
            "personalised_premium": final,
            "adjustment_reason": reason,
            "risk_level": "high" if zone_risk > 0.7 else 
                         "medium" if zone_risk > 0.4 else "low"
        }

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    result = predict(input_data)
    print(json.dumps(result))
