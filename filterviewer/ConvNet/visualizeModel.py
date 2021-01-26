import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import matplotlib.pyplot as plt

# net = torch.load("models/modelEpoch_9.pt")
# net = torch.load("models/dogsVScats_trained_5050_5_10e.pt")
net = torch.load("models/modelEpoch_100100_14_10e.pt")
net.cpu()

print(net.modules())

NUM_IMGS_PER_LAYER = 30
ROWS_PER_LAYER     = 2
netConvLayers = [net.conv1, net.conv2, net.conv3]

idx = 0
plt.figure("ConvLayers", figsize=(15, 7))
layerIdx = 0

print(ROWS_PER_LAYER * len(netConvLayers) + len(netConvLayers) - 1)
print()

numCols = int(NUM_IMGS_PER_LAYER/ROWS_PER_LAYER)
for layer in netConvLayers:

   for i in range(layer.weight.data.shape[0]):
      if i >= NUM_IMGS_PER_LAYER:
         continue
      # plt.subplot(len(netConvLayers), net.conv1.weight.data.shape[0] ROWS_PER_LAYER * , idx + 1)
      plt.subplot(ROWS_PER_LAYER * len(netConvLayers) + len(netConvLayers) - 1, numCols, idx + 1)

      plt.gca().set_axis_off()
      plt.subplots_adjust(top=1, bottom=0.5, right=0.4, left=0,
                          hspace=0, wspace=0.1)
      plt.margins(0, 0)
      plt.gca().xaxis.set_major_locator(plt.NullLocator())
      plt.gca().yaxis.set_major_locator(plt.NullLocator())

      # plt.axis('off')
      plt.imshow(layer.weight.data[i][0].numpy())
      idx += 1

   # if idx != NUM_IMGS_PER_LAYER * (layerIdx+1):
   #    idx = NUM_IMGS_PER_LAYER * (layerIdx+1)
   # print(idx)

   idx += int(NUM_IMGS_PER_LAYER / ROWS_PER_LAYER)

   layerIdx += 1

plt.tight_layout()
plt.show()


print(net)
print(net.conv1.weight.data.shape[0])
# print(net.conv1.weight.data[0])
# print(net.conv1.weight.data[0][0])
# plt.imshow(net.conv1.weight.data[15][0].numpy())