from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader


def index(request):
    template = loader.get_template('filterviewer/main.html')
    context = {}
    return HttpResponse(template.render(context, request))


def layer(request, layer_id):
    from pathlib import Path
    import json

    p = Path("assets", "layer" + str(layer_id) + ".json")
    with p.open() as f:
        data = json.load(f)

    return JsonResponse(data, safe=False)
