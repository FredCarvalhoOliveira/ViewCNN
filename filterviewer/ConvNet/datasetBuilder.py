import os
import cv2
import numpy as np
from tqdm import tqdm



class DogsVsCats:
   IMG_SIZE = 100
   CATS = "PetImages/Cat"
   DOGS = "PetImages/Dog"
   LABELS = {CATS:0, DOGS:1}

   training_data = []
   catCount = 0
   dogCount = 0

   def make_training_data(self):
      for label in self.LABELS:
         print(label)

         for fileName in tqdm(os.listdir(label)):
            if "jpg" in fileName:
               try:
                  path = os.path.join(label, fileName)
                  img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
                  img = cv2.resize(img, (self.IMG_SIZE, self.IMG_SIZE))
                  self.training_data.append([np.array(img), np.eye(2)[self.LABELS[label]]]) # truque para criar one hot vectors np.eye(2)[self.LABELS[label]

                  if label == self.CATS:
                     self.catCount += 1
                  elif label == self.DOGS:
                     self.dogCount += 1

               except Exception as e:
                  # print(str(e)) # some images are currupted
                  pass

      np.random.shuffle(self.training_data)
      np.save("training_data.npy", self.training_data)

      print("CatCount: ", self.catCount)
      print("DogCount: ", self.dogCount)

if __name__ == "__main__":
   REBUILD_DATA = False

   if REBUILD_DATA:
      DogsVsCats().make_training_data()

   training_data = np.load("training_data.npy", allow_pickle=True)

   import matplotlib.pyplot as plt
   plt.imshow(training_data[1250][0])
   plt.show()