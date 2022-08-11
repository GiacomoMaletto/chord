import math

pitch = []
for i in range(0, 36):
    pitch.append( math.pow(2, i / 12.) * 220 )

with open("output.bat", 'w', encoding="utf8") as file:
    for i in range(0, 36):
        print("ffmpeg -f lavfi -i \"sine=frequency=" + str(pitch[i]) + ":duration=5\" " + str(i) + ".mp3", end='\n', file=file)