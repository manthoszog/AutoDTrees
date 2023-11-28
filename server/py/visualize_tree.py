import sys
sys.path.insert(0,"/var/www/html/webkmeans/kclusterhub/autodtrees/.venv/lib/python3.11/site-packages")
import joblib
from sklearn import tree
import graphviz
import json

model_file = sys.argv[1]
tree_path = sys.argv[2]

joblib_model = joblib.load(model_file)
feat = joblib_model.feature_names_in_.tolist()
cla = joblib_model.classes_.tolist()
for i in range(len(cla)):
    cla[i] = str(cla[i])

dot_data = tree.export_graphviz(joblib_model, out_file = None, feature_names = feat, class_names = cla, filled = True, node_ids = True, rounded = True, precision = 2, max_depth = 10)
graph = graphviz.Source(dot_data, format = "png")
graph.render(filename = tree_path, cleanup = True)
print(json.dumps({"message": "Tree visualized successfully."}))