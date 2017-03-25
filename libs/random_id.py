from random import SystemRandom

def get_random_id():
    return SystemRandom().randint(00000000, 99999999)
