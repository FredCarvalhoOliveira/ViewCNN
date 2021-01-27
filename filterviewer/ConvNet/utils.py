import numpy as np
import urllib.request
import cv2
import torch


def url_to_image(url):
   """
      Fetches image from given image url
      >> Parameters
      url : str (desired image url)
      >> Returns
      image as a 2d numpy array : 2d NumpyArray
   """
   resp  = urllib.request.urlopen(url)
   image = np.asarray(bytearray(resp.read()), dtype="uint8")
   image = cv2.imdecode(image, cv2.IMREAD_COLOR)
   return image

def normalizeImg(img):
   vMin, vMax = np.min(img), np.max(img)
   img = ((img - vMin) / (vMax - vMin)) * 255
   return img.astype(int)

def normalizeFeatureMaps(featMaps):
   featMaps = featMaps.copy()
   for layerIdx in range(len(featMaps)):
      featMaps[layerIdx] = featMaps[layerIdx].astype(int)
      for mapIdx in range(len(featMaps[layerIdx])):
         featMaps[layerIdx][mapIdx] = normalizeImg(featMaps[layerIdx][mapIdx])
   return featMaps

def resizeFeatureMaps(featMaps, dWidth, dHeight):
   featMaps = featMaps.copy()
   resizedFeatMaps = featMaps.copy()

   for layerIdx in range(len(featMaps)):
      resizedFeatMaps[layerIdx] = np.zeros((featMaps[layerIdx].shape[0],dHeight ,dWidth), dtype=np.uint8)

      for mapIdx in range(len(featMaps[layerIdx])):
         resizedFeatMaps[layerIdx][mapIdx] = cv2.resize(featMaps[layerIdx][mapIdx].astype(np.uint8), dsize=(dWidth, dHeight), interpolation=cv2.INTER_CUBIC)
   return resizedFeatMaps

def serializeFeatureMaps(featureMaps):
   featMapsDict = {}
   for layerIdx in range(len(featureMaps)):
      layer = featureMaps[layerIdx]
      layerJsonArray = ["" for i in range(len(layer))]
      for kernelIdx in range(len(layer)):
         featMapDict = {}
         featureMap = layer[kernelIdx]

         featMapDict['id']         = str(kernelIdx)
         featMapDict['data']       = featureMap.flatten().tolist()
         featMapDict['width']      = featureMap.shape[1]
         layerJsonArray[kernelIdx] = featMapDict
      featMapsDict['layer' + str(layerIdx)] = layerJsonArray
   return featMapsDict


if __name__ == "__main__":
   pass