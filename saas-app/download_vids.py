import os
import urllib.request
import urllib.error

urls = [
    ("https://cdn.pixabay.com/video/2022/10/24/136270-763870631_tiny.mp4", "vid1.mp4"),
    ("https://cdn.pixabay.com/video/2021/09/11/88219-603126463_large.mp4", "vid2.mp4"),
    ("https://cdn.pixabay.com/video/2020/02/24/32777-394464190_tiny.mp4", "vid3.mp4"),
    ("https://cdn.pixabay.com/video/2021/08/04/83896-584742740_large.mp4", "vid4.mp4"),
]

output_dir = r"C:\Users\axelr\Documents\AirbnbAntigravity\saas-app\public\videos"

def download_videos():
    for url, filename in urls:
        filepath = os.path.join(output_dir, filename)
        if not os.path.exists(filepath):
            print(f"Downloading {filename}...")
            try:
                req = urllib.request.Request(
                    url, 
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                )
                with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
                    out_file.write(response.read())
                print(f"Success: {filename}")
            except Exception as e:
                print(f"Error downloading {filename}: {e}")
        else:
            print(f"{filename} already exists.")

if __name__ == "__main__":
    download_videos()
