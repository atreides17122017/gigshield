import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os

def generate_data(n=10000):
    np.random.seed(42)
    zone_risk = np.random.uniform(0.1, 1.0, n)
    seasonal = np.random.choice([0.8, 1.0, 1.05, 1.15], n, p=[0.2, 0.4, 0.2, 0.2])
    trust = np.random.randint(0, 100, n)
    claims = np.random.poisson(0.5, n)
    hours = np.random.normal(40, 10, n).clip(10, 80)
    
    # Premium multiplier formula target
    target = 1.0 + (zone_risk * 0.3) + ((seasonal - 1) * 0.4) + (claims * 0.15)
    target -= (trust / 100) * 0.2
    target = np.clip(target, 0.7, 1.8)
    
    return pd.DataFrame({
        'zone_risk_score': zone_risk,
        'seasonal_index': seasonal,
        'trust_score': trust,
        'claim_history_count': claims,
        'weekly_activity_hours': hours
    }), target

def main():
    print("Generating 10,000 synthetic rider profiles...")
    X, y = generate_data()
    
    print("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.1)
    model.fit(X, y)
    
    os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
    out_path = os.path.join(os.path.dirname(__file__), 'models', 'premium_model.pkl')
    joblib.dump(model, out_path)
    
    print(f"Model saved to {out_path}")

if __name__ == "__main__":
    main()
