import sys
import pandas as pd
import joblib
import json


file_path = sys.argv[1]
checkVal = sys.argv[2].split(',') # selected columns
model_path = sys.argv[3]
save_path = sys.argv[4]

dataset = pd.read_csv(file_path)
res = [sub.replace(' ', '_') for sub in dataset.columns]
dataset.columns = res   
attr = dataset[checkVal]

model = joblib.load(model_path)
pred_values = model.predict(attr)

dataset["predicted"] = pred_values
cols = checkVal
cols.append("predicted")
dataset[cols].to_csv(save_path, index = False, encoding = 'utf-8')

columns = dataset[cols].columns.to_list()
rows = dataset[cols].values.tolist()
data = []
data.append(columns)
for i in range(len(rows)):
    data.append(rows[i])

data2 = []
for i in range(11):
    data2.append(data[i])
print(json.dumps({"dataset": data2}))