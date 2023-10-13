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
attr = dataset[checkVal]
classlabel = dataset[selectedClass]

k = 5
kf = KFold(n_splits = k, random_state = None)
model = DecisionTreeClassifier(max_depth = max_depth, min_samples_leaf = min_samples_leaf)

acc_score = []

for train_index , test_index in kf.split(attr):
    X_train , X_test = attr.iloc[train_index,:],attr.iloc[test_index,:]
    y_train , y_test = classlabel[train_index] , classlabel[test_index]
     
    model.fit(X_train,y_train)
    pred_values = model.predict(X_test)
     
    acc = metrics.accuracy_score(pred_values , y_test)
    acc_score.append(acc)
     
avg_acc_score = sum(acc_score)/k
 
print(json.dumps({"kfold_acc_score": acc_score, "avg_acc_score": avg_acc_score}))