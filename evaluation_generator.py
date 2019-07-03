import numpy as np

time_easy = np.array([222,175,222,250,115,183])
time_medium = np.array([462,458,551,355,431,370])
time_hard = np.array([594,510,561,413,502,425])

clicks_easy = np.array([41,31,43,44,17,31])
clicks_medium = np.array([149,124,119,106,121,114])
clicks_hard = np.array([198,137,130,120,135,125])

correctness_easy = np.array([2,2,2,1.5,1.5,1.5])
correctness_medium = np.array([2,1.5,1.5,1,1.5,1])
correctness_hard = np.array([1,1.5,1,1,0.5,1])


#Calculating mean and std.

#avgs

print(f'Time_easy_avg: {time_easy.mean()}')
print(f'Time_medium_avg: {time_medium.mean()}')
print(f'Time_hard_avg: {time_hard.mean()}')

print(f'Clicks_easy_avg: {clicks_easy.mean()}')
print(f'Clicks_medium_avg: {clicks_medium.mean()}')
print(f'Clicks_hard_avg: {clicks_hard.mean()}')

print(f'Correctness_easy_avg: {correctness_easy.mean()}')
print(f'Correctness_medium_avg: {correctness_medium.mean()}')
print(f'Correctness_hard_avg: {correctness_hard.mean()}')

#STD

print(f'Time_easy_std: {time_easy.std()}')
print(f'Time_medium_std: {time_medium.std()}')
print(f'Time_hard_std: {time_hard.std()}')

print(f'Clicks_easy_std: {clicks_easy.std()}')
print(f'Clicks_medium_std: {clicks_medium.std()}')
print(f'Clicks_hard_std: {clicks_hard.std()}')

print(f'Correctness_easy_std: {correctness_easy.std()}')
print(f'Correctness_medium_std: {correctness_medium.std()}')
print(f'Correctness_hard_std: {correctness_hard.std()}')










