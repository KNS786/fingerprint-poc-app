import cv2
from PIL import Image
import imagehash
import face_recognition
from flask import Flask,request,jsonify
import time
import json
import os
import base64
from io import BytesIO
from flask_cors import CORS
import numpy as np


# Create a Flask application
app = Flask(__name__)
CORS(app)
CORS(app, origins='http://localhost:3000', methods=['GET', 'POST'], allow_headers=['Content-Type'])

@app.route("/")
def home():
    return {'msg':True}


def convert_base64_to_image(folderPath,imgWithExtn):
    imgData = request.json.get('image_data')

    _, encoded_data = imgData.split(',', 1)
    image_bytes = base64.b64decode(encoded_data)

    # Create a PIL Image object from the decoded bytes
    image = Image.open(BytesIO(image_bytes))
   

    image.save(folderPath+imgWithExtn,'PNG')
    
    return True

def croppedFaceInImage(folder_path,read_file_name,face_filename):
    try:
        image = cv2.imread(folder_path+read_file_name)

        # Load the pre-trained face detection model provided by OpenCV
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Convert the image to grayscale for face detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detect faces in the grayscale image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Assuming there is only one face in the image, extract the coordinates of the face region
        (x, y, w, h) = faces[0]
        # Crop the face region from the original image
        face_image = image[y:y+h, x:x+w]

        # Save the cropped face as a PNG file
        output_file= face_filename
        # Create the custom folder if it doesn't exist
        os.makedirs(folder_path, exist_ok=True)
        file_path = os.path.join(folder_path,output_file)
        # Save the cropped face as a PNG file in the custom folder path
        write_faceImage = cv2.imwrite(file_path,face_image)
        print("cropped file ::",file_path)
        return write_faceImage
    except Exception as e:
        return False

    

@app.route('/register',methods=['POST'])
def register():
    folder_path = '/home/navani/Desktop/test/'

    # Check if the folder exists
    if os.path.exists(folder_path):
        file_list = os.listdir(folder_path)
        # Check if the folder has files
        if file_list:
            # Delete the files
            for file_name in file_list:
                file_path = os.path.join(folder_path,file_name)
                os.remove(file_path)
            print('Files deleted successfully')
        else:
            print('No files found in the folder')
    else:
        print('folder does not exists')
        
    convertBase64ToFile = convert_base64_to_image(folder_path,'register.png')
    result = croppedFaceInImage(folder_path,'register.png','register_face.png')
    print("result ::",result)
    
    if result :
        return jsonify({'msg':'register faceid successfully'})
    else:
        return jsonify({'msg':'No file selected'}),400

@app.route('/login',methods=['POST'])
def login():
    folder_path = '/home/navani/Desktop/test/'
    if os.path.exists(folder_path):
        file_list = os.listdir(folder_path)
        if file_list:
            for file_name in file_list:
                file_path = os.path.join(folder_path,file_name)
                if file_name == 'login.png':
                    os.remove(file_path)
                    print("deleted file successfully")
        else:
            print('No files found in the folder')
    else:
        print('folder does not exists')
    
    result = convert_base64_to_image(folder_path,'login.png')
    if result :
        return jsonify({'msg':'login faceid uploaded'})
    else:
        return jsonify({'msg':'No file selected'}),400





@app.route('/verify')
def verifyFace():
    folder_path = '/home/navani/Desktop/test/'
    loginJpg=False
    registerJpg=False
    if os.path.exists(folder_path):
        file_list = os.listdir(folder_path)
        if file_list:
            for file_name in file_list:
                file_path = os.path.join(folder_path,file_name)
                print('file_name ::',file_name)
                if file_name == 'login.png':
                    loginJpg=True
                elif file_name == 'register.png':
                    registerJpg=True
        else:
            print('file list not found')
    else:
        print('no file found')

    if loginJpg and registerJpg:
        # Load the two input images
        image1 = face_recognition.load_image_file(folder_path+'register.png')
        image2 = face_recognition.load_image_file(folder_path+'login.png')
        # Find and encode the face in image 1
        face_locations1 = face_recognition.face_locations(image1)
        face_encodings1 = face_recognition.face_encodings(image1, face_locations1)

        # Find and encode the face in image 2
        face_locations2 = face_recognition.face_locations(image2)
        face_encodings2 = face_recognition.face_encodings(image2, face_locations2)
       
        # Compare the face encodings
        if len(face_encodings1) > 0 and len(face_encodings2) > 0:
            match_results = face_recognition.compare_faces(face_encodings1, face_encodings2[0])
            match_percentage = sum(match_results) / len(match_results) * 100
        else:
            match_percentage = 0.0
    
        time.sleep(3)
        result = 'Your Face Matched' if abs(match_percentage) > 60 else 'Your Face Not Matched'
        data = {
            'faceMatched':  abs(match_percentage) > 60,
            'accuracy': match_percentage,
            'msg': result
        }

        # Print the match percentage
        print("images Matched ::",{abs(match_percentage) > 60})
        print(f"Image match percentage: {match_percentage}%")
        json_data = json.dumps(data,default=str)
        return json_data
    else:
        return jsonify({'msg':'cannot verified picture, because login and register image not found'})

   

  

    

# Run the application
if __name__ == '__main__':
    app.run()

