import cv2
from PIL import Image
import imagehash
import face_recognition

# Load the two input images
image1 = face_recognition.load_image_file('../../images/register.jpg')
image2 = face_recognition.load_image_file('../../images/register.jpg')


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

# Print the match percentage
print(f"Image match percentage: {match_percentage}%")

