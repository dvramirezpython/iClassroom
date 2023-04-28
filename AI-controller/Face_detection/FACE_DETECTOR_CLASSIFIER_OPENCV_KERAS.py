# TODO Implement this project as Object Oriented and modularize all these methods

import keras.models
from keras.utils import img_to_array
import cv2
import numpy as np
import CONST


class FACE_DETECTOR_CLASSIFIER_OPENCV_KERAS:
    class_labels = list(CONST.EMOTION_LIST.keys())
    frontal_face_detector = cv2.CascadeClassifier(CONST.FRONTAL_FACE_CASCADE_PATH)
    profile_face_detector = cv2.CascadeClassifier(CONST.PROFILE_FACE_CASCADE_PATH)
    upper_body_detector = cv2.CascadeClassifier(CONST.UPPER_BODY_CASCADE_PATH)
    emotion_model = keras.models.load_model(CONST.TRAINER_PATH)
    cap = cv2.VideoCapture(0)
    # cap = cv2.VideoCapture('rtsp://admin:iClassroom@192.168.1.64/1')

    def process_img(self, image):
        processed_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # processed_img = cv2.Canny(processed_img, threshold1=200, threshold2=300)
        return processed_img

    def compute_classroom_emotion(self):
        return 0

    def compute_classroom_attention(self):
        return 0

    # age_model = load_model('age_model_50epochs.h5')
    # gender_model = load_model('gender_model_50epochs.h5')

    # gender_labels = ['Male', 'Female']

    def image_processing_flow(self):
        while True:
            ret, frame = self.cap.read()
            gray = self.process_img(image=frame)

            # TODO Modularize this code too
            person_detected = self.upper_body_detector.detectMultiScale(gray, 1.3, 5,
                                                                        minSize=(int(0.01 * frame.shape[0]),
                                                                                 int(0.01 * frame.shape[1])))
            for (x, y, w, h) in person_detected:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                cv2.putText(frame, 'Upper-body', (x+w, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # print(f'{len(frontal_faces)} frontal and {len(left_profile_faces) + len(right_profile_faces)} '
            #       f'profile faces, and {len(person_detected)} upper-body detected!')

            # TODO Vectorize this block for improving the classification of many students in a classroom
            frontal_faces = self.frontal_face_detector.detectMultiScale(gray, 1.3, 5,
                                                                        minSize=(int(0.01 * frame.shape[0]),
                                                                                 int(0.01 * frame.shape[1])),
                                                                        flags=cv2.CASCADE_SCALE_IMAGE)
            all_faces_dict = self.all_faces_detector(frame=frame, gray=gray)
            for item in all_faces_dict:
                for (x, y, w, h) in all_faces_dict[item]:
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                    roi_gray = gray[y:y+h, x:x+w]
                    roi_gray = cv2.resize(roi_gray, (CONST.IMG_WIDTH, CONST.IMG_HEIGHT),
                                          interpolation=cv2.INTER_AREA)

                    # Get image ready for prediction
                    roi = roi_gray.astype('float')/255.0  # Scale
                    roi = img_to_array(roi)
                    roi = np.expand_dims(roi, axis=0)  # Expand dims to get it ready for prediction (1, 48, 48, 1)

                    preds = self.emotion_model.predict(roi)[0]  # Yields one hot encoded result for 7 classes
                    label = self.class_labels[preds.argmax()]  # Find the label
                    label_position = (x, y)
                    cv2.putText(frame, label, label_position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    label_position = (x, y + h)
                    cv2.putText(frame, item, label_position, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    # # Gender
                    # roi_color = frame[y:y+h, x:x+w]
                    # roi_color = cv2.resize(roi_color, (200, 200), interpolation=cv2.INTER_AREA)
                    # gender_predict = gender_model.predict(np.array(roi_color).reshape(-1, 200, 200, 3))
                    # gender_predict = (gender_predict>= 0.5).astype(int)[:, 0]
                    # gender_label=gender_labels[gender_predict[0]]
                    # gender_label_position=(x,y+h+50) #50 pixels below to move the label outside the face
                    # cv2.putText(frame,gender_label,gender_label_position,cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
                    #
                    # # Age
                    # age_predict = age_model.predict(np.array(roi_color).reshape(-1,200,200,3))
                    # age = round(age_predict[0,0])
                    # age_label_position=(x+h,y+h)
                    # cv2.putText(frame,"Age="+str(age),age_label_position,cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)

            cv2.imshow('Emotion Detector', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        self.cap.release()
        cv2.destroyAllWindows()
        return 0

    def face_detector(self, frame, gray, detection_model):
        faces = detection_model.detectMultiScale(gray, 1.3, 5,
                                                 minSize=(int(0.01 * frame.shape[0]),
                                                          int(0.01 * frame.shape[1])),
                                                 flags=cv2.CASCADE_SCALE_IMAGE)
        return faces

    def all_faces_detector(self, frame, gray):
        faces_dict = {}
        faces = self.face_detector(frame=frame, gray=gray, detection_model=self.frontal_face_detector)
        faces_dict['frontal'] = faces
        faces = self.face_detector(frame=frame, gray=gray, detection_model=self.profile_face_detector)
        faces_dict['right'] = faces
        faces = self.face_detector(frame=frame, gray=cv2.flip(gray, 1), detection_model=self.profile_face_detector)
        faces_dict['left'] = faces
        return faces_dict
