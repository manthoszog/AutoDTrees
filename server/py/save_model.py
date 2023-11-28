import sys
sys.path.insert(0,"/var/www/html/webkmeans/kclusterhub/autodtrees/.venv/lib/python3.11/site-packages")
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import json
import joblib


file_path = sys.argv[1]
checkVal = sys.argv[2].split(',') # selected columns
selectedClass = sys.argv[3]
max_depth = sys.argv[4]
if max_depth == 'None':
    max_depth = None
else:
    max_depth = int(max_depth)
min_samples_leaf = int(sys.argv[5])

dataset = pd.read_csv(file_path)
res = [sub.replace(' ', '_') for sub in dataset.columns]
dataset.columns = res   
attr = dataset[checkVal]
classlabel = dataset[selectedClass]

model_path = sys.argv[6]

model = DecisionTreeClassifier(max_depth = max_depth, min_samples_leaf = min_samples_leaf)
model.fit(attr,classlabel)
joblib.dump(model,model_path)

print(json.dumps({"message": "Model successfully saved."}))