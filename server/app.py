from flask import Flask, request
from funcs import *


app = Flask(__name__)

@app.route('/')
def home():
	return "home"

@app.route('/questionMaking', methods=['POST'])
def api_questionMaking():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    dto_json = request.get_json() 
    qa_dict = {}

    for i in dto_json: 
        a = i["baseQuestion"]
        b = i["baseAnswer"]
        qa_dict[a] = b

    # openapi처리 부분
    age = 5
    question_num = 5

    prompt = questionMaking(age, question_num, qa_dict)
    response = openai_api(prompt, "gpt-4-1106-preview")
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
def api_storyMaking():
	# 스프링에서 넘어온 json 데이터를 변수에 저장합니다.
    dto_json = request.get_json() 
    refined_response = story_generate(dto_json, 7)
    total_image = background_generate(refined_response)

    r_format = {
        "contents": []
    }
    for i in range(len(refined_response)):
        temp = {}
        temp["page"] = i + 1
        temp["text"] = refined_response[i][4:].strip().split('. ')
        temp["base64"] = total_image[i]
        r_format["contents"].append(temp)

    return r_format

@app.route('/initQuest', methods=['GET'])
def make_initQuest():
    return making_init_question()

@app.route('/makeLineart', methods=['POST'])
def make_lineart():
    dto_json = request.get_json() 
    keyword = dto_json['keyword']
    keyword = deepl_trans(keyword, "EN-US")

    image = generate_lineart(keyword)
    dto_json['image'] = image

    return dto_json


if __name__ == '__name__':
    app.run('0.0.0.0',port=5000,debug=True)