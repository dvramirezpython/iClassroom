#from old_codes import ModelDefinitionAndTraining, ClassifyingFaceEmotions
import FACE_DETECTOR_CLASSIFIER_OPENCV_KERAS
import FACE_EMOTION_TRAINER_KERAS
import os
import CONST

# if len(os.listdir(f'{CONST.RAW_DATASET_BY_EMOTION}/{CONST.EMOTION_LIST[0]}')) == 0:
#     imp = PreprocessingImages.import_images_by_emotion(source=CONST.RAW_IMAGES_FILE,
#                                                        destiny=CONST.RAW_DATASET_BY_EMOTION,
#                                                        emotion_list=CONST.EMOTION_LIST)
# if len(os.listdir(CONST.PROCESSED_DATASET)) == 0:
#     PreprocessingImages.removing_face_backgroung(source=CONST.RAW_DATASET_BY_EMOTION,
#                                                  destiny=CONST.PROCESSED_DATASET,
#                                                  emotion_list=CONST.EMOTION_LIST)

if not os.path.exists('face_models'):
    os.mkdir('face_models')
if not os.path.exists(CONST.TRAINER_PATH):
    keras_face_emotion_trainer = FACE_EMOTION_TRAINER_KERAS.FACE_EMOTION_TRAINER_KERAS()
    keras_face_emotion_trainer.trainer_full_process()

face_processor = FACE_DETECTOR_CLASSIFIER_OPENCV_KERAS.FACE_DETECTOR_CLASSIFIER_OPENCV_KERAS()
face_processor.image_processing_flow()

