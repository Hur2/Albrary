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

@app.route('/test', methods=['POST'])
def test():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    dto_json = request.get_json() 
    # 실제로 할때는 dto_json => qa_dict로 변환하는 작업 필요함

    return dto_json

@app.route('/questionMaking', methods=['POST'])
def questionMaking():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    #dto_json = request.get_json() 
    # 실제로 할때는 dto_json => qa_dict로 변환하는 작업 필요함
    
    # 파이썬 기능부분 함수
    qa_dict = {
        '주인공의 이름은': "검정 거미 크룬", 
        '이야기가 발생하는 장소는': "자취방의 구석진 곳",
        '이야기의 시작은': "인간이 집을 나간 사이, 자취방에 들어와 집을 짓는다",
        '주인공이 만나는 친구는': "바퀴벌레 폴",
        '주인공이 만나는 어려움은': "집주인에게 잡혀 죽을 위험에 처함",
    }

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
        temp["page"] = i
        temp["text"] = refined_response[i]
        r_format["contents"].append(temp)

    return r_format

@app.route('/pictureMaking', methods=['POST'])
def pictureMaking():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    dto_json = request.get_json() 
    # 실제로 할때는 dto_json => response2 변환하는 작업 필요함

    response2 = []
    story = ""

    for i in response2:
        if i != "":
            story += i.split(":")[-1]

    prompt = characterMaking(story)
    response3 = openai_api(prompt, "gpt-4")
    response3 = response3.split("\n")

    char = []
    for i in response3:
        char.append(i.split(":")[-1].replace('"', '').strip())
    
    url = ""

    paths = []
    for i in char:
        payload = {
            "prompt": "1"+i+", simple background, full body",
            "negative_prompt" : "nsfw",
            "sd_model_checkpoint": "anything-v4.5.safetensors [1d1e459f9f]",
            "steps": 20
        }
        
        response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)
        
        r = response.json()
        
        image = Image.open(io.BytesIO(base64.b64decode(r['images'][0])))
        image = remove(image)

        path = f'./image/{uuid.uuid1()}.png'
        image.save(path)
        paths.append(path)

    prompt = storyToBackground(response2)
    response4 = openai_api(prompt, "gpt-4") #"gpt-3.5-turbo"
    response4 = response4.split("\n")

    bg_prompt = []
    for i in response4:
        bg_prompt.append(i.split(':')[-1].replace("'","").strip())
    bg_prompt

    with open('./asset/back_depth.jpeg', 'rb') as img:
        base64_string = base64.b64encode(img.read()).decode()

    for prompt in bg_prompt:
        payload = {
            "prompt": f"{prompt}, background, (masterpiece, best quality), no humans",
            "negative_prompt" : "person, 1girl, boy, woman, man, solo, character, humans, animals",
            "sd_model_checkpoint": "anything-v4.5.safetensors [1d1e459f9f]",
            "steps": 20,
            "width": 512,
            "height": 512,
            "alwayson_scripts": {
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
        }
        response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)
        r = response.json()
        
        image = Image.open(io.BytesIO(base64.b64decode(r['images'][0])))
        path = f'./image/{uuid.uuid1()}.png'
        image.save(path)
        paths.append(path)

    return r_format


 
if __name__ == '__name__':
    app.run('0.0.0.0',port=5000,debug=True)