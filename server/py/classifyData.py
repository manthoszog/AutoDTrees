import sys
import pandas as pd
import joblib
import json
from sklearn import metrics


file_path = sys.argv[1]
checkVal = sys.argv[2].split(',') # selected columns
model_path = sys.argv[3]
save_path = sys.argv[4]
className = sys.argv[5]
if className == 'None':
    className = None

dataset = pd.read_csv(file_path)
res = [sub.replace(' ', '_') for sub in dataset.columns]
dataset.columns = res   
attr = dataset[checkVal]

model = joblib.load(model_path)
pred_values = model.predict(attr)

labels = None
acc = None
pre_per_label = None
rec_per_label = None
fsc_per_label = None
avg_pre = None
avg_rec = None
avg_fsc = None

if className != None:
    classlabel = dataset[className]
    labels = classlabel.unique()
    
    acc = metrics.accuracy_score(classlabel, pred_values)
    acc = round(acc,2)

    pre_per_label, rec_per_label, fsc_per_label, supp = metrics.precision_recall_fscore_support(classlabel, pred_values, average = None, labels = labels)
    for i in range(len(pre_per_label)):
        pre_per_label[i] = round(pre_per_label[i],2)
    
    for i in range(len(rec_per_label)):
        rec_per_label[i] = round(rec_per_label[i],2)

    for i in range(len(fsc_per_label)):
        fsc_per_label[i] = round(fsc_per_label[i],2)

    avg_pre, avg_rec, avg_fsc, supp = metrics.precision_recall_fscore_support(classlabel, pred_values, average = 'macro', labels = labels)
    avg_pre = round(avg_pre,2)
    avg_rec = round(avg_rec,2)
    avg_fsc = round(avg_fsc,2)
    labels = labels.tolist()
    pre_per_label = pre_per_label.tolist()
    rec_per_label = rec_per_label.tolist()
    fsc_per_label = fsc_per_label.tolist()


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

print(json.dumps({"dataset": data, "acc": acc, "avg_pre": avg_pre, "avg_rec": avg_rec, "avg_fsc": avg_fsc, "pre_per_label": pre_per_label, "rec_per_label": rec_per_label, "fsc_per_label": fsc_per_label, "labels": labels}))