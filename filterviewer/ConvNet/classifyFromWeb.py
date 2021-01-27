# from classifier import ConvNet
import torch.optim as optim
import torch.nn as nn
import torch
import numpy as np
from tqdm import tqdm
import cv2
import urllib
from classifier import ConvNet
import matplotlib.pyplot as plt



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
      featureMaps['layer' + str(layerIdx)] = layerJsonArray
   return featMapsDict



if torch.cuda.is_available():
   device = torch.device("cuda:0")
   print("Running on GPU - " + torch.cuda.get_device_name())
else:
   device = torch.device("cpu")
   print("Running on CPU")

net = ConvNet()
net.load_state_dict(torch.load("models/modelEpoch_19"))
net.eval()
net.to(device)
net.setDebugMode(True)


URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFdPGuvQ59paGYZultU9NLo3tkYG_wUQkkbA&usqp=CAU"

IMG_SIZE = 100


original = url_to_image(URL)
img = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
imgTensor = torch.from_numpy(img)
imgTensor = imgTensor.float()
imgTensor = imgTensor.view(-1, 1, IMG_SIZE, IMG_SIZE).to(device)

out = net(imgTensor)
print("Conv output = " + str(out))

def normalizeImg(img):
   vMin, vMax = np.min(img), np.max(img)
   img = ((img - vMin) / (vMax - vMin)) * 255
   img = img.astype(int)
   return img

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
         resizedFeatMaps[layerIdx][mapIdx] = cv2.resize(featMaps[layerIdx][mapIdx].astype(np.uint8), dsize=(dWidth, dHeight))
   return resizedFeatMaps

featureMaps = net.getFeatureMaps()
featureMaps = normalizeFeatureMaps(featureMaps)
resizedMaps = resizeFeatureMaps(featureMaps, 300, 300)

plt.imshow(resizedMaps[0][0])
plt.show()

plt.imshow(featureMaps[0][0])
plt.show()


# print(normalizeFeatureMaps(featureMaps))


# unnormalized = featureMaps[0][0]
# plt.imshow(unnormalized)
# plt.show()
#
#
# print(unnormalized)
# print(np.max(unnormalized))
# print(np.min(unnormalized))
# vMin, vMax = np.min(unnormalized), np.max(unnormalized)
# unnormalized = (unnormalized - vMin) / (vMax - vMin)
#
# plt.imshow(unnormalized)
# plt.show()

# serializeFeatureMaps(featureMaps)

if out[0][0] == 1:
   print("CAT: AKA a little devil")
else:
   print("DOG: look at that good boi <3")

# plt.imshow(cv2.resize(featureMaps[0][0], dsize=(500, 500), interpolation=cv2.INTER_CUBIC))
# plt.show()
#
# plt.imshow(featureMaps[0][0])
# plt.show()













