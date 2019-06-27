import random
import datetime
import sys
import os
import string

paths = ["root"]

def generate_random_string():
    length = random.randint(3, 6)
    return ''.join([random.choice(string.ascii_letters) for _ in range(length)])


def generate_random_path():
    return_root = random.randint(0, 2)
    root:str = random.choice(paths)
    if return_root == 0 or len(root.split("/")) > 8:
        return root
    else:
        full_dir = "/".join([root, *[generate_random_string() for _ in range(random.randint(1, 3))]])
        paths.append(full_dir)
        return full_dir


def random_oprand():
    return random.choice(["R", "W", "C", "D"])


if __name__ == "__main__":
    row_num = int(sys.argv[1])

    lines = [(",".join([
        generate_random_path(),
        generate_random_string(),
        str(random.randint(1, 200)),
        random_oprand()
    ]) + "\n") for _ in range(row_num)]

    with open(os.path.join("test\\assets\\random-tests", datetime.datetime.now().strftime(r"%m%d-%H%M%S.txt")), "w") as f:
        f.writelines(lines)
