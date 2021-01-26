import numpy as np
import matplotlib.pyplot as plt
import cv2
import os

class ConvLayerViewer:
   def __init__(self):
      self.__layers = []

   def saveConvLayerResponse(self, layerResp):
      layerResp = layerResp[0]  # Only one channel
      self.__layers.append(layerResp)

   def writeToFiles(self):
      convResponsesDir = "ConvResponses"
      if not os.path.exists(convResponsesDir):
         os.mkdir(convResponsesDir)

      for layerIdx in range(len(self.__layers)):
         layerFolder = convResponsesDir + "/" + "FeatureMaps_Layer_" + str(layerIdx)
         if not os.path.exists(layerFolder):
            os.mkdir(layerFolder)
         for respIdx in range(len(self.__layers[layerIdx])):
            response = self.__layers[layerIdx][respIdx].cpu().detach().numpy()
            filename = layerFolder + "/Resp_" + str(respIdx) + ".png"

            if cv2.imwrite(filename, response):
               print("SAVED " + filename)
            else:
               print("FAILED to save file " + filename)

