
import openai
import io
import base64
from PIL import Image
import requests


def questionMaking(age, num, qa_dict):
    type = ""
    world_view = ""
    
    for i in range(num):
        type += f"{i+1}번: ({i+1}번 질문) '+' '(답변 예시)','(답변 예시)','(답변 예시)' \n"
    for key, value in qa_dict.items():
        world_view += f"- {key} {value} \n"
    
    prompt = f'''
당신은 대한민국의 {age}살 동화 작가와 대화하고 있습니다. 
보기의 세계관을 참고하여, 동화 내용에 대한 적절한 질문을 하시오.

질문은 무조건 {num}개만 할 수 있고, 한번에 하나의 질문만 해야합니다.
질문은 동화를 스토리를 위해서 창의성이 있어야 합니다.
질문은 보기와 관련없어도 됩니다.
작가는 {age}살이므로, 질문은 나이 수준을 고려해야 합니다.
반드시 정확한 캐릭터 이름을 사용하시오.

다음의 형식을 따라 질문하세요.
질문 번호가 커질수록, 스토리의 후반부 질문을 하시요.
{type}
보기(세계관):
{world_view}
'''
    print(prompt)
    return prompt
    # 이걸 gpt api로 보내고 받은 결과물을 반환해주면 될듯


def storyMaking_prompt(num, qa_dict):

    type = ""
    world_view = ""
    
    for i in range(num):
        type += f"문단{i+1}: (내용) \n"
    for key, value in qa_dict.items():
        world_view += f"- {key} {value} \n"
    
    prompt = f'''
당신은 대한민국의 최고의 동화 작가입니다.
아래의 세계관을 참고하여서 동화책을 작성하시오.

이야기가 매끄럽게 이어지지 않는다면, 세계관을 추가해도 됩니다.
동화책은 반드시 답변의 형식에 맞게 작성하시오.
한 문단은 3문장 이내입니다. 
한 문단은 반드시 하나의 장면만 묘사하시오.
동화는 구체적이고 창의적으로 써야합니다.
답변은 반드시 동화의 스토리만 다루시오.

세계관:
{world_view}
다음의 형식을 따라 답변하시오.
{type}

'''
    print(prompt)
    return prompt


def characterMaking(world_view):
    
    prompt = f'''
당신은 이 동화에서 캐릭터를 추출해야 합니다.
스토리를 참고하여, 캐릭터를 일반명사로 쓰시오. 고유명사는 빼고 쓰시오.
캐릭터의 이름이 아닌, 종(species) 이름을 쓰시오.
인간인 경우는 성별을 포함하여 쓰시오.
단수형으로 쓰시오.
캐릭터는 최대 5명까지만 쓰시오.

스토리
{world_view}

다음의 형식을 따라 영어로 답변하세요.
등장인물1: "(영어 일반명사)"
등장인물2: "(영어 일반명사)"
등장인물3: "(영어 일반명사)"
등장인물4: "(영어 일반명사)"
등장인물5: "(영어 일반명사)"

'''
    print(prompt)
    return prompt
    # 이걸 gpt api로 보내고 받은 결과물을 반환해주면 될듯


def storyToBackground_prompt(stories):

    story = ""
    type = ""
    for i in stories:
        story += i+'\n'
    for i in range(len(stories)):
        type += f"문단{i+1}:'(배경 설명)'\n"

    
    
    prompt = f'''
보기의 스토리를 참고하여, 각 문단마다 장소 정보를 추출하시오.
등장 캐릭터을 있는 장소에 대해서 영어로 5단어 이내로 서술하시오.

[스토리]
{story}
아래 형식에 맞게 답변하시오.
{type}
'''
    print(prompt)
    return prompt


def openai_api(prompt, model_name):
    openai.api_key = "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" #api key 입력해야 함

    response = openai.ChatCompletion.create(
    model=model_name,
    messages=[
        {"role": "system", "content": prompt}
      ]
    )
    output_text = response["choices"][0]["message"]["content"]
    return output_text

def story_generate(dto_json):
    qa_dict = {}

    for i in dto_json:
        question = i['question']['question']
        options = i['option']
        qa_dict[question] = options

    prompt = storyMaking_prompt(9, qa_dict)
    response = openai_api(prompt, "gpt-4-1106-preview")
    response = response.split("\n")
    refined_response = [i for i in response if i != '']

    return refined_response

def background_generate(refined_response):
    url = ""

    prompt = storyToBackground_prompt(refined_response)
    bg_response = openai_api(prompt, "gpt-4-1106-preview") #"gpt-3.5-turbo"
    bg_response = bg_response.split("\n")

    #걍 전처리
    bg_prompt = []
    for i in bg_response:
        bg_prompt.append(i.split(':')[-1].replace("'","").strip())

    #sd 요청 payload
    with open('./asset/back_depth.jpeg', 'rb') as img:
        base64_string = base64.b64encode(img.read()).decode()
    
    payload = {
        "width": 512,
        "height": 512,
        "negative_prompt" : "nsfw",
        "sd_model_checkpoint": "anything-v4.5.safetensors [1d1e459f9f]",
        "steps": 20,
        "alwayson_scripts" : {
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

    total_image = []
    
    #sd 생성
    for prompt in bg_prompt:
        payload["prompt"] = f"{prompt}, background, (masterpiece, best quality), no humans"
        response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)
        r = response.json()
        total_image.append(r['images'][0])
    
    return total_image