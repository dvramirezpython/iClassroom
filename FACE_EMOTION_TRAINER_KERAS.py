from keras.preprocessing import image
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
import os
from matplotlib import pyplot as plt
import numpy as np
import CONST
from keras.models import load_model
import random


class FACE_EMOTION_TRAINER_KERAS:
    batch_size = 32

    train_data_dir = f'{CONST.FERDB_PATH}/train/'
    validation_data_dir = f'{CONST.FERDB_PATH}/test/'

    def image_preprocessing(self):
        train_datagen = image.ImageDataGenerator(rescale=1. / 255,
                                                 rotation_range=30,
                                                 shear_range=0.3,
                                                 zoom_range=0.3,
                                                 horizontal_flip=True,
                                                 fill_mode='nearest')

        validation_datagen = image.ImageDataGenerator(rescale=1. / 255)

        train_generator = train_datagen.flow_from_directory(self.train_data_dir, color_mode='grayscale',
                                                            target_size=(CONST.IMG_HEIGHT, CONST.IMG_WIDTH),
                                                            batch_size=self.batch_size,
                                                            class_mode='categorical',
                                                            shuffle=True)

        validation_generator = validation_datagen.flow_from_directory(self.validation_data_dir,
                                                                      color_mode='grayscale',
                                                                      target_size=(CONST.IMG_HEIGHT, CONST.IMG_WIDTH),
                                                                      batch_size=self.batch_size,
                                                                      class_mode='categorical',
                                                                      shuffle=True)
        return train_generator, validation_generator

    # This method verify the image generator by plotting a few faces and their corresponding labels
    def visualize_generated_image(self, train_generator):
        class_labels = list(CONST.EMOTION_LIST.keys())
        img, label = train_generator.__next__()
        i = random.randint(0, (img.shape[0]) - 1)
        image = img[i]
        labl = class_labels[label[i].argmax()]
        plt.imshow(image[:, :, 0], cmap='gray')
        plt.title(labl)
        plt.show()

    # This method set up a network with 4 CNN layers, 3 pool layers,2 and fully connected layers.
    # Input 48 by 48 images
    # Output 4 categories [Bored, Excited, Happy, Sad]
    # Joined classes Excited = (Angry, Disgust, Fear, Surprise) Happy = (Happy), Sad = (Sad), Bored = (Sleepy, Neutral)
    # For Valence-Arousal relationship
    def model_configurer(self):
        model = Sequential()
        model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48, 48, 1)))
        model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.1))
        model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.1))
        model.add(Conv2D(256, kernel_size=(3, 3), activation='relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.1))
        model.add(Flatten())
        model.add(Dense(512, activation='relu'))
        model.add(Dropout(0.2))
        model.add(Dense(4, activation='softmax'))
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        print(model.summary())
        return model

    def accuracy_plotter(self, acc, epochs, val_acc):
        plt.plot(epochs, acc, 'y', label='Training acc')
        plt.plot(epochs, val_acc, 'r', label='Validation acc')
        plt.title('Training and validation accuracy')
        plt.xlabel('Epochs')
        plt.ylabel('Accuracy')
        plt.legend()
        plt.show()
        return 0

    def loss_plotter(self, epochs, loss, val_loss):
        plt.plot(epochs, loss, 'y', label='Training loss')
        plt.plot(epochs, val_loss, 'r', label='Validation loss')
        plt.title('Training and validation loss')
        plt.xlabel('Epochs')
        plt.ylabel('Loss')
        plt.legend()
        plt.show()
        return 0

    def model_trainer(self, model, train_generator, validation_generator):
        train_path = f'{CONST.FERDB_PATH}/train'
        test_path = f'{CONST.FERDB_PATH}/test'

        num_train_images = 0
        for root, dirs, files in os.walk(train_path):
            num_train_images += len(files)

        num_test_images = 0
        for root, dirs, files in os.walk(test_path):
            num_test_images += len(files)

        epochs = 50

        history = model.fit(train_generator, steps_per_epoch=num_train_images // self.batch_size,
                            epochs=epochs, validation_data=validation_generator,
                            validation_steps=num_test_images // self.batch_size)

        model.save(CONST.TRAINER_PATH)

        # plot the training and validation accuracy and loss at each epoch
        loss = history.history['loss']
        epochs = range(1, len(loss) + 1)
        self.loss_plotter(epochs=epochs,
                          loss=loss,
                          val_loss=history.history['val_loss'])
        self.accuracy_plotter(acc=history.history['accuracy'],
                              epochs=epochs,
                              val_acc=history.history['val_accuracy'])
        return 0

    # Test the model
    def model_tester(self, validation_generator):
        from sklearn.metrics import confusion_matrix
        from sklearn import metrics
        import seaborn as sns
        my_model = load_model(CONST.TRAINER_PATH, compile=False)
        # Generate a batch of images
        test_img, test_lbl = validation_generator.__next__()
        predictions = my_model.predict(test_img)
        predictions = np.argmax(predictions, axis=1)
        test_labels = np.argmax(test_lbl, axis=1)
        print("Accuracy = ", metrics.accuracy_score(test_labels, predictions))
        # Confusion Matrix - verify accuracy of each class
        cm = confusion_matrix(test_labels, predictions)
        sns.heatmap(cm, annot=True)
        class_labels = list(CONST.EMOTION_LIST.keys())
        # Check results on a few select images
        n = random.randint(0, test_img.shape[0] - 1)
        _image = test_img[n]
        orig_label = class_labels[test_labels[n]]
        pred_label = class_labels[predictions[n]]
        plt.imshow(_image[:, :, 0], cmap='gray')
        plt.title("Original label is:" + orig_label + " Predicted is: " + pred_label)
        plt.show()
        return 0

    def trainer_full_process(self):
        train_generator, validation_generator = self.image_preprocessing()
        self.visualize_generated_image(train_generator=train_generator)
        model = self.model_configurer()
        self.model_trainer(model=model,
                           train_generator=train_generator,
                           validation_generator=validation_generator)
        self.model_tester(validation_generator=validation_generator)
        return 0