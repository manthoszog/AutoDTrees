import sys
sys.path.insert(0,"/var/www/html/webkmeans/kclusterhub/autodtrees/.venv/lib/python3.11/site-packages")
import joblib
import json

model_file = sys.argv[1]
joblib_model = joblib.load(model_file)
columns = joblib_model.feature_names_in_.tolist()
print(json.dumps({"columns": columns}))