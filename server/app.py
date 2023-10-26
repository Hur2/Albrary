from flask import Flask, request
import json
from funcs import *

import json
import requests
import io
import base64
from PIL import Image
from rembg import remove
import uuid


app = Flask(__name__)

@app.route('/')
def home():
	return "home"

@app.route('/questionMaking', methods=['POST'])
def questionMaking():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    dto_json = request.get_json() 
    qa_dict = {}

    for i in dto_json: 
        a = i["question"]
        b = i["answer"]
        qa_dict[a] = b

    # openapi처리 부분
    age = 5
    question_num = 5

    prompt = questionMaking(age, question_num, qa_dict)
    response = openai_api(prompt, "gpt-4")
    response = response.split("\n")
	
    refined_response = [i.split(":")[1:] for i in response if i != ''] ##엔터 구분이 없는 경우 예외처리
    
    #후처리 단
    r_format = {
        "questionData": []
    }

    for i in refined_response:
        q, a = i[0].split("'+'")
        a = a.split("','")

        temp = [q] + a
        temp = [i.replace("'", "").strip() for i in temp]            

        one_qa = {
            "question": temp[0],
            "options": temp[1:]
        }

        if len(one_qa["options"]) == 1:
            one_qa["options"] = one_qa["options"][0].split(',')

        r_format["questionData"].append(one_qa)

    return r_format

@app.route('/storyMaking', methods=['POST'])
def storyMaking():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    dto_json = request.get_json() 

    qa_dict = {}

    for i in dto_json["questionData"]:
        question = i['question']
        options = i['options']
        qa_dict[question] = options

    prompt = storyMaking(9, qa_dict)
    response = openai_api(prompt, "gpt-4")
    response = response.split("\n")
    refined_response = [i for i in response if i != '']

    r_format = {
        "contents": []
    }
    for i in range(len(refined_response)):
        temp = {}
        temp["page"] = i + 1
        temp["text"] = refined_response[i]
        r_format["contents"].append(temp)

    return r_format

@app.route('/pictureMaking', methods=['POST'])
def pictureMaking():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    dto_json = request.get_json() 
    # 실제로 할때는 dto_json => response2 변환하는 작업 필요함

    url = ""

    story_total = []
    for i in dto_json["contents"]:
        story_total.append(i['text'])

    story = ""
    for i in story_total:
        if i != "":
            story += i.split(":")[-1]

    #gpt api
    prompt = characterMaking(story)
    response3 = openai_api(prompt, "gpt-4")
    response3 = response3.split("\n")

    prompt = storyToBackground(story_total)
    response4 = openai_api(prompt, "gpt-4") #"gpt-3.5-turbo"
    response4 = response4.split("\n")

    #걍 전처리
    char = []
    for i in response3:
        char.append(i.split(":")[-1].replace('"', '').strip())

    bg_prompt = []
    for i in response4:
        bg_prompt.append(i.split(':')[-1].replace("'","").strip())

    with open('./asset/back_depth.jpeg', 'rb') as img:
        base64_string = base64.b64encode(img.read()).decode()
    
    # 캐릭터 이미지 생성
    payload = {
        "width": 512,
        "height": 512,
        "negative_prompt" : "nsfw",
        "sd_model_checkpoint": "anything-v4.5.safetensors [1d1e459f9f]",
        "steps": 20
    }

    dto_json["char"] = []
    for i in char:
        payload["prompt"] = "1"+i+", simple background, full body"
        path = sd_image_processing(requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload))
        temp_dict = {
            "name" : i,
            "url" : path       
        }
        dto_json["char"].append(temp_dict)

    # 배경 이미지 생성
    payload["alwayson_scripts"] = {
                "controlnet": {
                "args": [
                    {
                        "input_image": base64_string,
                        "module" : "depth_midas",
                        "model"  : "control_v11f1p_sd15_depth [cfd03158]",
                        "weight" : 0.5,
                    }
                    ]
                }
            }
    for num, prompt in enumerate(bg_prompt):
        payload["prompt"] = f"{prompt}, background, (masterpiece, best quality), no humans"
        path = sd_image_processing(requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload))
        dto_json["contents"][num]["url"] = path

    return dto_json


 
if __name__ == '__name__':
    app.run('0.0.0.0',port=5000,debug=True)