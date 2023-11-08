import sys
import joblib
import json

model_file = sys.argv[1]
joblib_model = joblib.load(model_file)
columns = joblib_model.feature_names_in_.tolist()
print(json.dumps({"columns": columns}))