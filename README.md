# Aibrary: AI-Assisted Storybook Creation for Kids

Aibrary is a platform that combines children's creativity with AI assistance for creating personalized storybooks.

## How It Works

1. **Interactive Storytelling**
   - Children create unique stories through a choice-based game powered by an LLM (e.g., GPT-4).
   - The AI guides the narrative by providing options at each step.

2. **Background Generation**
   - An image generation model analyzes the story and generates relevant background scenes.

3. **Character Illustration**
   - Children illustrate the characters on the AI-generated backgrounds, bringing their stories to life.

## Features

- Interactive storytelling with AI guidance
- AI-generated contextual backgrounds
- Children's creative character illustrations
- Seamless AI integration

## Benefits

- Fosters creativity and self-expression
- Engaging and fun learning experience
- Personalized storybooks
- Collaboration with AI technologies

Aibrary aims to provide a delightful and educational platform for children to develop their storytelling abilities, artistic skills, and familiarity with AI in an engaging way.



## Usage
### Starting the ML Server

To start the ML server, follow these steps:

1. Navigate to the `ml_server` directory:
   ```
   cd ml_server
   ```

2. Create a new Python virtual environment named `aibrary` with Python 3.8:
   ```
   conda create -n aibrary python=3.8
   ```

3. Activate the virtual environment:
   ```
   conda activate aibrary
   ```

4. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
5. Run Server:
   ```
   flask run
   ```

The ML server should now be running and ready to serve AI models.

### Starting the Frontend

To start the frontend, follow these steps:

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Start the Nginx web server:
   ```
   sudo systemctl start nginx
   ```


### Starting the Backend Server

To start the backend server, follow these steps:

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Build the Gradle project:
   ```
   gradlew build
   ```

3. Run the JAR file:
   ```
   java -jar backend-0.0.1-SNAPSHOT.jar
   ```

The backend server should now be up and running, handling requests from the frontend and interacting with the ML server.

## Manual
<img src="./docs/proposal/AIbrary 매뉴얼_pages-to-jpg-0002.jpg">
<img src="./docs/proposal/AIbrary 매뉴얼_pages-to-jpg-0003.jpg">
<img src="./docs/proposal/AIbrary 매뉴얼_pages-to-jpg-0004.jpg">
<img src="./docs/proposal/AIbrary 매뉴얼_pages-to-jpg-0005.jpg">
<img src="./docs/proposal/AIbrary 매뉴얼_pages-to-jpg-0006.jpg">
<img src="./docs/proposal/AIbrary 매뉴얼_pages-to-jpg-0007.jpg">
<img src="./docs/proposal/AIbrary 매뉴얼_pages-to-jpg-0008.jpg">

