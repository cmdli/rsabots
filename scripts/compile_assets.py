#!/usr/bin/python3


import json
import os
import base64

def explore_path(path: str):
    for filename in os.listdir(path):
        filepath = os.path.join(path, filename)
        if os.path.isdir(filepath):
            for end_path in explore_path(filepath):
                yield end_path
        elif os.path.isfile(filepath):
            yield filepath

def main():
    files = dict()
    for path in explore_path('./static/botparts'):
        parts = path.split('/')
        filename = parts[-1]
        color = parts[-2]
        part_type = parts[-3]
        if filename.endswith('.svg'):
            with open(path, 'r') as file:
                text = file.read()
                b64encoded = base64.b64encode(text.encode('utf-8'))
                data_url = 'data:image/svg+xml;base64,' + b64encoded.decode('utf-8')
                files[f"/botparts/{part_type}/{color}/{filename}"] = data_url
    export_filepath = './static/assets.json'
    if os.path.exists(export_filepath):
        with open(export_filepath,'w') as file:
            file.write(json.dumps(files))
    else:
        with open(export_filepath,'w') as file:
            file.write(json.dumps(files))

if __name__ == "__main__":
    main()