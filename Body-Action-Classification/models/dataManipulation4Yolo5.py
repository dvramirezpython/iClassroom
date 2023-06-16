from os import walk
import shutil

source_files_path = '/home/jetson/Documents/PythonProjects/Action-classification-Yolov5/runs/detect/'
action_list = ['Active', 'Bored', 'Rising_hand', 'Sleeping', 'Talking', 'Walking', 'With_laptop', 'Writing']

def load_files():
    for action in action_list:
        label_files_path = f'{source_files_path}exp{action}/labels'
        f = [filename for filename in walk(label_files_path)]
        counter =  1
        for label_file in f[0][2]:
            shutil.copy2(f'{source_files_path}exp{action}/labels/{label_file}', 
                         f'/home/jetson/Documents/PythonProjects/datasets/labels/{action}-{counter}.txt')
            image_file_name = str(label_file.split('.')[0]) + '.jpg'
            shutil.copy2(f'/home/jetson/Documents/PythonProjects/datasets/coco128-actions/{action}/{image_file_name}', 
                         f'/home/jetson/Documents/PythonProjects/datasets/images/{action}-{counter}.jpg')
            counter += 1
        print(f'Action {action} {counter} images copied!')
    return 0

def create_train_file():
    files = [ files for files in walk('/home/jetson/Documents/PythonProjects/datasets/images')]
    with open('/home/jetson/Documents/PythonProjects/datasets/train2017', 'w') as f:
        for line in files[0][2]:
            f.write(f'../datasets/coco128/images/{line}\n')
    return 0

def find_error():
    files = [files for files in walk('/home/jetson/Documents/PythonProjects/datasets/coco128/labels')]
    for file_to_open in files[0][2]:
        with open(f'/home/jetson/Documents/PythonProjects/datasets/coco128/labels/{file_to_open}', 'r') as f:
            content = f.read()
            if '51 ' in content:
                print(file_to_open)
    return 0

# create_train_file()
# load_files()
find_error()