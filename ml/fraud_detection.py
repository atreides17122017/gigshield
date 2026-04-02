import sys
import json
import os
import joblib
import pandas as pd
from sklearn.cluster import DBSCAN
import numpy as np

def detect_fraud_ring(claims):
    # claims = list of dict: { lat, lng, filed_at, trust_score }
    if len(claims) < 10:
        return []

    # Format data for DBSCAN
    X = []
    for c in claims:
        X.append([c['lat'], c['lng'], c['filed_at']])
    
    X = np.array(X)
    db = DBSCAN(eps=0.5, min_samples=10).fit(X)
    
    # Analyze clusters
    labels = db.labels_
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    
    flagged_clusters = []
    
    for i in range(n_clusters):
        cluster_mask = (labels == i)
        cluster_claims = [c for idx, c in enumerate(claims) if cluster_mask[idx]]
        
        # Check avg trust and timing
        avg_trust = sum([c['trust_score'] for c in cluster_claims]) / len(cluster_claims)
        
        latest = max(c['filed_at'] for c in cluster_claims)
        earliest = min(c['filed_at'] for c in cluster_claims)
        latency = latest - earliest
        
        if latency < 120 and avg_trust < 35:
            flagged_clusters.append({
                "cluster_id": i,
                "size": len(cluster_claims),
                "avg_trust": avg_trust,
                "action": "frozen"
            })
            
    return flagged_clusters

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            return
            
        data = json.loads(input_data)
        
        action = data.get("action", "predict")
        
        if action == "predict":
            # predict single claim fraud probability
            claim_frequency = float(data.get("claim_frequency", 0))
            claim_timing_offset = float(data.get("claim_timing_offset", 0))
            zone_match_score = float(data.get("zone_match_score", 1.0))
            platform_activity_score = float(data.get("platform_activity_score", 1.0))
            trust_score = float(data.get("trust_score", 50))
            
            model_path = os.path.join(os.path.dirname(__file__), 'models', 'fraud_model.pkl')
            
            try:
                if os.path.exists(model_path):
                    model = joblib.load(model_path)
                    features = pd.DataFrame([{
                        'claim_frequency': claim_frequency,
                        'claim_timing_offset': claim_timing_offset,
                        'zone_match_score': zone_match_score,
                        'platform_activity_score': platform_activity_score,
                        'trust_score': trust_score
                    }])
                    # Isolation forest returns 1 for inliers, -1 for outliers.
                    # Output pseudo-probability
                    pred = int(model.predict(features)[0])
                    prob = 0.9 if pred == -1 else 0.1
                else:
                    raise FileNotFoundError()
            except Exception:
                # Rule-based fallback
                prob = 0.1
                if claim_timing_offset < 10 and trust_score < 40:
                    prob += 0.4
                if zone_match_score < 0.5:
                    prob += 0.5
                    
            print(json.dumps({"fraud_probability": min(1.0, prob)}))

        elif action == "detect_ring":
            clusters = detect_fraud_ring(data.get("claims", []))
            print(json.dumps({"flagged_clusters": clusters}))

    except Exception as e:
        print(json.dumps({"fraud_probability": 0.5, "error": str(e)}))

if __name__ == "__main__":
    main()
