import sys
import joblib
import matplotlib.pyplot as plt
from sklearn.tree import plot_tree
import json

model_file = sys.argv[1]
tree_path = sys.argv[2]

plt.figure(figsize = (100,100))

joblib_model = joblib.load(model_file)
feat = joblib_model.feature_names_in_.tolist()
cla = joblib_model.classes_.tolist()
for i in range(len(cla)):
    cla[i] = str(cla[i])

plot_tree(joblib_model, feature_names = feat, class_names = cla, filled = True, node_ids = True, rounded = True, fontsize = 30, max_depth = 5, precision = 2)
plt.savefig(tree_path)
plt.clf()

print(json.dumps({"message": "Tree visualized successfully."}))