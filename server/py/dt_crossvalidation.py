import sys
sys.path.insert(0,"/var/www/html/webkmeans/kclusterhub/autodtrees/.venv/lib/python3.11/site-packages")
import pandas as pd
from sklearn.model_selection import KFold 
from sklearn.tree import DecisionTreeClassifier
from sklearn import metrics
import json


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

k = int(sys.argv[6])
kf = KFold(n_splits = k, random_state = None, shuffle = True)
model = DecisionTreeClassifier(max_depth = max_depth, min_samples_leaf = min_samples_leaf)

labels = classlabel.unique()

acc_class = []

arr_pre = []
arr_rec = []
arr_fsc = []

pre_per_label = []
rec_per_label = []
fsc_per_label = []

pre_class = []
rec_class = []
fsc_class = []

for train_index , test_index in kf.split(attr):
    X_train , X_test = attr.iloc[train_index,:],attr.iloc[test_index,:]
    y_train , y_test = classlabel[train_index] , classlabel[test_index]

    model.fit(X_train,y_train)
    pred_values = model.predict(X_test)

    accuracy = metrics.accuracy_score(y_test, pred_values)
    acc_class.append(accuracy)
    
    precision, recall, fscore, supp = metrics.precision_recall_fscore_support(y_test, pred_values, average = None, labels = labels)
    arr_pre.append(precision)
    arr_rec.append(recall)
    arr_fsc.append(fscore)

    precision, recall, fscore, supp = metrics.precision_recall_fscore_support(y_test, pred_values, average = 'macro', labels = labels)
    pre_class.append(precision)
    rec_class.append(recall)
    fsc_class.append(fscore)
     
avg_acc = sum(acc_class)/k
avg_acc = round(avg_acc,2)

for j in range(len(labels)):
    col = []
    for i in range(k):
        col.append(arr_pre[i][j])
    s = sum(col)/k
    s = round(s,2)
    pre_per_label.append(s)

for j in range(len(labels)):
    col = []
    for i in range(k):
        col.append(arr_rec[i][j])
    s = sum(col)/k
    s = round(s,2)
    rec_per_label.append(s)

for j in range(len(labels)):
    col = []
    for i in range(k):
        col.append(arr_fsc[i][j])
    s = sum(col)/k
    s = round(s,2)
    fsc_per_label.append(s)


avg_pre = sum(pre_class)/k
avg_pre = round(avg_pre,2)
avg_rec = sum(rec_class)/k
avg_rec = round(avg_rec,2)
avg_fsc = sum(fsc_class)/k
avg_fsc = round(avg_fsc,2)
labels = labels.tolist()
print(json.dumps({"avg_acc": avg_acc, "avg_pre": avg_pre, "avg_rec": avg_rec, "avg_fsc": avg_fsc, "pre_per_label": pre_per_label, "rec_per_label": rec_per_label, "fsc_per_label": fsc_per_label, "labels": labels}))