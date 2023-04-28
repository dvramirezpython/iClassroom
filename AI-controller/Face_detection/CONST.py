# CONST
# EMOTION_LIST = ['anger', 'happy', 'neutral', 'sad', 'surprise'] #Indian Database
# EMOTION_LIST = {'angry':0, 'disgust':1, 'fear':2, 'happy':3, 'neutral':4, 'sad':5, 'surprise':6} #Kaggle Database
EMOTION_LIST = {'Bored': 0, 'Excited': 1, 'Happy': 2, 'Sad': 3} # Valence-Arousal
FERDB_PATH = 'images/FER2013-images-database-Kaggle'
RAW_IMAGES_FILE = 'images'
RAW_DATASET_BY_EMOTION = 'data_set'
PROCESSED_DATASET = 'dataset'
TRAINER_PATH = f'face_models/emotion_detection_model_50epochs.h5'
FRONTAL_FACE_CASCADE_PATH = f'face_models/haarcascade_frontalface_default.xml'
PROFILE_FACE_CASCADE_PATH = f'face_models/haarcascade_profileface.xml'
UPPER_BODY_CASCADE_PATH = f'haarcascades_models/haarcascade_upperbody.xml'
# V_WIDTH = 640
# V_LENGTH = 420
V_WIDTH = 48
V_LENGTH = 48
IMG_HEIGHT = 48
IMG_WIDTH = 48