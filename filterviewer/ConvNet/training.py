from classifier import ConvNet
import torch.optim as optim
import torch.nn as nn
import torch
import numpy as np
from tqdm import tqdm

if torch.cuda.is_available():
   device = torch.device("cuda:0")
   print("Running on GPU - " + torch.cuda.get_device_name())
else:
   device = torch.device("cpu")
   print("Running on CPU")


def train(net, epochs, batchSize, trainImgs, trainLabels):
   print("Training for " + str(epochs) + " Epochs, Batch size: " + str(batchSize))
   for epoch in range(epochs):
       for i in tqdm(range(0, len(trainImgs), batchSize)): # from 0, to the len of x, stepping batchSize at a time. [:50] ..for now just to dev
           #print(f"{i}:{i+BATCH_SIZE}")

           batch_imgs   = trainImgs[i:i+batchSize].view(-1, 1, trainImgs.shape[1], trainImgs.shape[2])
           batch_labels = trainLabels[i:i+batchSize]

           batch_imgs, batch_labels = batch_imgs.to(device), batch_labels.to(device)

           net.zero_grad()

           outputs = net(batch_imgs)
           loss = lossFunction(outputs, batch_labels)
           loss.backward()
           optimizer.step()    # Does the update

       print(f"Epoch: {epoch}. Loss: {loss}")
       # torch.save(net,'models/modelEpoch_' + str(epoch) + '.pt')
       torch.save(net.state_dict(), 'models/modelEpoch_' + str(epoch))

def test(net, batchSize, testImgs, testLabels):
   print("Testing...")
   correct = 0
   total = 0
   for i in tqdm(range(0, len(testImgs), batchSize)):

      batch_X = testImgs[i:i + batchSize].view(-1, 1, testImgs.shape[1], testImgs.shape[2]).to(device)
      batch_y = testLabels[i:i + batchSize].to(device)
      batch_out = net(batch_X)

      out_maxes    = [torch.argmax(i) for i in batch_out]
      target_maxes = [torch.argmax(i) for i in batch_y]
      for pred, target in zip(out_maxes, target_maxes):
         if pred == target:
            correct += 1
         total += 1
   print("Accuracy: ", round(correct / total, 3))


net = ConvNet().to(device)
optimizer    = optim.Adam(net.parameters(), lr=0.001)
lossFunction = nn.MSELoss() # Mean Squared Error


training_data = np.load("training_data.npy", allow_pickle=True)

# Separating data and labels
images = torch.Tensor([i[0] for i in training_data]).view(-1, 100, 100)
images = images / 255.0
labels = torch.Tensor([i[1] for i in training_data])

# Separate training data and test data
VAL_PCT  = 0.1  # lets reserve 10% of our data for validation
val_size = int(len(images)*VAL_PCT)
train_imgs   = images[:-val_size]
train_labels = labels[:-val_size]
test_imgs    = images[-val_size:]
test_labels  = labels[-val_size:]


train(net=net, epochs=20, batchSize=100, trainImgs=train_imgs, trainLabels=train_labels)
test(net=net, batchSize=100, testImgs=test_imgs, testLabels=test_labels)