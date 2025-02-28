import torch

def inspect_pth_file(pth_file_path):
    try:
        # Load the .pth file
        data = torch.load(pth_file_path)
        
        # Print the keys and details about each key's content
        print("Keys in the .pth file:", data.keys())
        
        for key, value in data.items():
            print(f"\nKey: {key}")
            if isinstance(value, dict):
                print("Content type: Dictionary")
                print(f"Sub-keys: {list(value.keys())[:10]}")  # Print first 10 sub-keys if it's a large dict
            elif isinstance(value, list):
                print("Content type: List")
                print(f"First 10 items: {value[:10]}")
            elif isinstance(value, torch.Tensor):
                print("Content type: Tensor")
                print(f"Tensor shape: {value.shape}")
            else:
                print(f"Content type: {type(value)}")
                print(f"Value preview: {str(value)[:500]}")  # Print first 500 chars for long values
    except Exception as e:
        print(f"Error loading speaker file: {str(e)}")

if __name__ == "__main__":
    pth_file_path = "/home/theeseus/.local/share/tts/tts_models--multilingual--multi-dataset--xtts_v2/speakers_xtts.pth"  # Replace with the correct path
    inspect_pth_file(pth_file_path)

