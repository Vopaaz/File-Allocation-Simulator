import random
import datetime
import sys
import os
import string
import pandas as pd


class InstructionsCreator(object):
    def __init__(self, f, chaos=False):
        self.f = f
        self.chaos = chaos  # Not supported yet

    def generate_random_string(self):
        length = random.randint(3, 6)
        return ''.join([random.choice(string.ascii_letters) for _ in range(length)])

    def generate_random_oprand(self, avoid=[]):
        while True:
            op = random.choice(["R", "W", "C", "D"]*7 + ["D"])
            # Make "D" slightly more than "C" to avoid overflow
            if op not in avoid:
                return op

    def generate_random_dir(self):
        return_root = random.randint(0, 2)

        root: str = "root" if self.files.empty else self.files.sample(
            1).iloc[0].dir
        if return_root == 1 or len(root.split("/")) > 3:
            return root
        else:
            full_dir = "/".join([root, *[self.generate_random_string()
                                         for _ in range(random.randint(1, 2))]])
            return full_dir

    def generate_instructions(self, row_number):
        self.files = pd.DataFrame(None, columns=["dir", "file", "block"])

        for _ in range(row_number):
            if self.files.empty:
                self.create_file()
            else:
                op = self.generate_random_oprand()
                if op == "C":
                    self.create_file()
                elif op == "R":
                    self.read_file()
                elif op == "W":
                    self.write_file()
                else:
                    self.delete_file()

    def append_file(self, l):
        l_df = pd.DataFrame({
            "dir": l[0],
            "file": l[1],
            "block": l[2]
        }, index=[0])
        self.files = pd.concat(
            [self.files, l_df], axis=0).reset_index(drop=True)

    def create_file(self):
        dir_ = self.generate_random_dir()
        filename = self.generate_random_string()
        block = random.randint(5, 30)
        op = "C"
        self.append_file([dir_, filename, block])
        self.f.write(",".join([dir_, filename, str(block), op]) + "\n")

    def read_file(self):
        root_file = self.files.sample(1).iloc[0]
        self.f.write(",".join(
            [root_file.dir, root_file.file, str(random.randint(1, root_file.block)), "R"]) + "\n")

    def write_file(self):
        root_file = self.files.sample(1).iloc[0]
        self.f.write(",".join(
            [root_file.dir, root_file.file, str(random.randint(1, root_file.block)), "W"]) + "\n")

    def delete_file(self):
        if self.files.empty:
            pass
        else:
            to_pop = self.files.sample(1).iloc[0]
            self.files.drop(axis=0, index=to_pop.name, inplace=True)
            self.f.write(",".join(
                [to_pop.dir, to_pop.file, str(to_pop.block), "D"]) + "\n")


if __name__ == "__main__":
    row_num = int(sys.argv[1]) if len(sys.argv) == 2 else 20

    with open(os.path.join("test\\assets\\random-tests", datetime.datetime.now().strftime(r"%m%d-%H%M%S.txt")), "w") as f:
        InstructionsCreator(f).generate_instructions(row_num)
