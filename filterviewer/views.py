from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
from django.template import loader

from .ConvNet.classifier import ConvNet
import torch

################################
### On server start load CNN ###
if torch.cuda.is_available():
    device = torch.device("cuda:0")
    print("Running on GPU - " + torch.cuda.get_device_name())
else:
    device = torch.device("cpu")
    print("Running on CPU")
net = ConvNet()
net.load_state_dict(torch.load("filterviewer/ConvNet/models/modelEpoch_19"))
net.eval()
net.to(device)



def index(request):
    template = loader.get_template('filterviewer/main.html')
    context = {}
    return HttpResponse(template.render(context, request))

def layer(request, layer_id):
    from pathlib import Path
    import json
    print("Layer requested: " + str(layer_id))

    p = Path("assets", "layer" + str(layer_id) + ".json")
    with p.open() as f:
        data = json.load(f)
    return JsonResponse(data, safe=False)

def classify(request):
    template = loader.get_template('classify/classify.html')
    context = {}
    return HttpResponse(template.render(context, request))

@csrf_exempt
def endPt_classify(request):
    from .ConvNet.utils import url_to_image
    import torch
    import cv2

    IMG_SIZE = 100
    imgUrl   = request.POST['imgUrl']

    img = url_to_image(imgUrl)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    imgTensor = torch.from_numpy(img)
    imgTensor = imgTensor.float()
    imgTensor = imgTensor.view(-1, 1, IMG_SIZE, IMG_SIZE).to(device)

    out = net(imgTensor)
    print("Conv output = " + str(out))

    if out[0][0] == 1:
        data = {"class": 'cat'}
    else:
        data = {"class": 'dog'}
    print(">> Server Responded: " + data["class"])

    return JsonResponse(data, safe=False)










