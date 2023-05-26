import cv2
from PIL import Image
import imagehash
import face_recognition
from flask import Flask,request,jsonify
import time
import json
import os

# Create a Flask application
app = Flask(__name__)

@app.route("/")
def home():
    return {'msg':True}

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
        
    if 'file' not in request.files:
        return "No file selected", 400
    
    file = request.files['file']

    if file.filename == '':
        return 'No file selected',400
    
    if file:
        file.save(folder_path+file.filename)
    return jsonify({'msg':'register faceid successfully'})

@app.route('/login',methods=['POST'])
def login():
    folder_path = '/home/navani/Desktop/test/'
    if os.path.exists(folder_path):
        file_list = os.listdir(folder_path)
        if file_list:
            for file_name in file_list:
                file_path = os.path.join(folder_path,file_name)
                if file_name == 'login.jpg':
                    os.remove(file_path)
                    print("deleted file successfully")
        else:
            print('No files found in the folder')
    else:
        print('folder does not exists')
    
    if 'file' not in request.files:
        return 'No file selected',400
    
    file = request.files['file']

    if file.filename == '':
        return 'No file selected',400
    
    if file:
        file.save(folder_path+file.filename)
    return jsonify({'msg':'login faceid uploaded'})




@app.route('/verify')
def verifyFace():
    folder_path = '/home/navani/Desktop/images/'
    loginJpg=False
    registerJpg=False
    if os.path.exists(folder_path):
        file_list = os.listdir(folder_path)
        if file_list:
            for file_name in file_list:
                file_path = os.path.join(folder_path,file_name)
                print('file_name ::',file_name)
                if file_name == 'login.jpg':
                    loginJpg=True
                elif file_name == 'register.jpg':
                    registerJpg=True
        else:
            print('file list not found')
    else:
        print('no file found')

    if loginJpg and registerJpg:
        # Load the two input images
        image1 = face_recognition.load_image_file(folder_path+'register.jpg')
        image2 = face_recognition.load_image_file(folder_path+'login.jpg')
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
        data = {
            'faceMatched':  abs(match_percentage) > 60
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

