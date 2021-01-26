import torch
import torch.nn as nn
import torch.nn.functional as F

# from ConvLayerViewer import ConvLayerViewer
import matplotlib.pyplot as plt

class ConvNet(nn.Module):
   def __init__(self):
      super().__init__()
      # self.__layerViewer = ConvLayerViewer()
      self.__isInDebugMode = False

      self.conv1 = nn.Conv2d(1, 32, 5)
      self.conv2 = nn.Conv2d(32, 64, 5)
      self.conv3 = nn.Conv2d(64, 128, 5)

      # self.conv1 = nn.Conv2d(1,  32,  5)
      # self.conv2 = nn.Conv2d(32, 64,  5)
      # self.conv3 = nn.Conv2d(64, 128, 5)

      x = torch.randn(100, 100).view(-1, 1, 100, 100)
      self.__to_linear = None
      self.convs(x)

      self.fc1 = nn.Linear(self.__to_linear, 512)
      self.fc2 = nn.Linear(512, 2)

   def convs(self, x):
      layerResp = self.conv1(x)
      # if self.__isInDebugMode:
      #    self.__layerViewer.saveConvLayerResponse(layerResp)
      x = F.max_pool2d(F.relu(layerResp), (2, 2))

      layerResp = self.conv2(x)
      # if self.__isInDebugMode:
      #    self.__layerViewer.saveConvLayerResponse(layerResp)
      x = F.max_pool2d(F.relu(layerResp), (2, 2))

      layerResp = self.conv3(x)
      # if self.__isInDebugMode:
      #    self.__layerViewer.saveConvLayerResponse(layerResp)
      x = F.max_pool2d(F.relu(layerResp), (2, 2))

      # if self.__isInDebugMode:
      #    self.__layerViewer.writeToFiles()

      if self.__to_linear is None:
         self.__to_linear = x[0].shape[0] * x[0].shape[1] * x[0].shape[2]
      return x

   def forward(self, x):
      x = self.convs(x)
      x = x.view(-1, self.__to_linear)
      x = F.relu(self.fc1(x))
      x = self.fc2(x)
      return F.softmax(x, dim=1)

   def setDebugMode(self, isInDebugMode):
      print("Debug " + str(isInDebugMode))
      self.__isInDebugMode = isInDebugMode



if __name__ == "__main__":
   net = ConvNet()
   print(net)