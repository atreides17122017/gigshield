import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

def generate_claims_data(n=10000):
    np.random.seed(42)
    freq = np.random.poisson(1, n)
    offset = np.random.exponential(120, n) # time after trigger
    zone = np.random.uniform(0.7, 1.0, n)
    platform = np.random.uniform(0.8, 1.0, n)
    trust = np.random.randint(30, 100, n)
    
    # Inject 5% outliers (fraud)
    outlier_idx = np.random.choice(n, int(n * 0.05), replace=False)
    freq[outlier_idx] = np.random.poisson(5, len(outlier_idx))
    offset[outlier_idx] = np.random.uniform(0, 10, len(outlier_idx))
    zone[outlier_idx] = np.random.uniform(0, 0.4, len(outlier_idx))
    platform[outlier_idx] = np.random.uniform(0, 0.3, len(outlier_idx))
    trust[outlier_idx] = np.random.randint(0, 30, len(outlier_idx))
    
    return pd.DataFrame({
        'claim_frequency': freq,
        'claim_timing_offset': offset,
        'zone_match_score': zone,
        'platform_activity_score': platform,
        'trust_score': trust
    })

def main():
    print("Generating synthetic claim history data...")
    X = generate_claims_data()
    
    print("Training Isolation Forest Anomaly model...")
    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(X)
    
    os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
    out_path = os.path.join(os.path.dirname(__file__), 'models', 'fraud_model.pkl')
    joblib.dump(model, out_path)
    
    print(f"Model saved to {out_path}")

if __name__ == "__main__":
    main()
