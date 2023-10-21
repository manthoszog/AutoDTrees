import pandas as pd
from sklearn.model_selection import KFold 
from sklearn.tree import DecisionTreeClassifier
from sklearn import metrics
import sys
import json


file_path = sys.argv[1]
checkVal = sys.argv[2].split(',') # selected columns
selectedClass = sys.argv[3]
max_depth = int(sys.argv[4])
min_samples_leaf = int(sys.argv[5])

dataset = pd.read_csv(file_path)
res = [sub.replace(' ', '_') for sub in dataset.columns]
dataset.columns = res   
attr = dataset[checkVal]
classlabel = dataset[selectedClass]

k = int(sys.argv[6])
kf = KFold(n_splits = k, random_state = None)
model = DecisionTreeClassifier(max_depth = max_depth, min_samples_leaf = min_samples_leaf)

acc_score = []
prec_score = []
rec_score = []
f_score = []

for train_index , test_index in kf.split(attr):
    X_train , X_test = attr.iloc[train_index,:],attr.iloc[test_index,:]
    y_train , y_test = classlabel[train_index] , classlabel[test_index]

    model.fit(X_train,y_train)
    pred_values = model.predict(X_test)

    acc = metrics.accuracy_score(y_test, pred_values)
    acc_score.append(acc)

    precision, recall, fscore, supp = metrics.precision_recall_fscore_support(y_test, pred_values, average = 'macro')
    
    prec_score.append(precision)
    rec_score.append(recall)
    f_score.append(fscore)
     
avg_acc_score = sum(acc_score)/k
avg_acc_score = round(avg_acc_score,2)

avg_prec_score = sum(prec_score)/k
avg_prec_score = round(avg_prec_score,2)
avg_rec_score = sum(rec_score)/k
avg_rec_score = round(avg_rec_score,2)
avg_f_score = sum(f_score)/k
avg_f_score = round(avg_f_score,2)

print(json.dumps({"avg_acc_score": avg_acc_score, "avg_prec_score": avg_prec_score, "avg_rec_score": avg_rec_score, "avg_f_score": avg_f_score}))