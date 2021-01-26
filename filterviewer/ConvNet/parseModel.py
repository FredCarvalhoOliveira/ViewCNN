import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import matplotlib.pyplot as plt
import json


# test  = np.array([[1, 2, 2], [3, 3, 4]])
# test2 = np.array([[1, 2, 2], [3, 3, 4]])
#
# print(test.shape)
# jsonDict1 = {}
# jsonDict1['data']  = test.flatten().tolist()
# jsonDict1['width'] = test.shape[1]
#
# jsonDict2 = {}
# jsonDict2['data']  = test2.flatten().tolist()
# jsonDict2['width'] = test2.shape[1]
#
# layerDict = {}
# layerDict["layer1"] = jsonDict1
# layerDict["layer2"] = jsonDict2
#
# print(json.dumps(layerDict))
#
#
#
#
#
#
#
net = torch.load("models/modelEpoch_100100_14_10e.pt")
net.cpu()
print(net)
#
#
# layers = list(net.children())
# fMin, fMax = torch.min(layers[0].weight), torch.max(layers[0].weight)
# filters = (layers[0].weight.data - fMin) / (fMax - fMin)


# print(layers[0].weight)
# print(torch.max(layers[0].weight))
# print(torch.min(layers[0].weight))
# print(filters)
# print(layers[0].weight.data[0][0].numpy())
# print(layers[0].weight.data[0][0].numpy().tolist())

# print(type(layers[0]) == nn.Conv2d)

# l = [module for module in net.modules() if type(module) != nn.Sequential]


def modelToJson(model):
   modelDict = {}

   layers = list(model.children())
   print(layers)

   for i in range(len(layers)):
      if type(layers[i]) == nn.Conv2d: # Temporary, in the future it will parse every layer type

         #Normalize kernels to range 0 to 1
         # fMin, fMax = torch.min(layers[i].weight), torch.max(layers[i].weight)
         # kernels = (layers[i].weight.data - fMin) / (fMax - fMin)

         kernels = layers[i].weight.data

         layerJsonArray = ["" for i in range(len(kernels))]
         for j in range(len(kernels)):
            kernelDict = {}
            kernel     = kernels[j][0] # index 0 because theres an extra useless dimension in kernel
            # print(kernel)

            fMin, fMax = torch.min(kernel), torch.max(kernel)
            kernel = (kernel - fMin) / (fMax - fMin)

            # print(kernel)




            # kernel     = kernels[j][0].detach().numpy() # index 0 because theres an extra useless dimension in kernel


            kernelDict['id']    = str(j)
            kernelDict['data']  = kernel.flatten().tolist()
            kernelDict['width'] = kernel.shape[1]
            layerJsonArray[j]   = kernelDict

         modelDict['layer' + str(i)] = layerJsonArray
   return modelDict





modelJson = modelToJson(net)
# print(json.dumps(modelJson))