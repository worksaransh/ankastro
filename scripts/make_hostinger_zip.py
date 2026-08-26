import os
import zipfile

def create_clean_hostinger_zip():
    source_dir = "d:/CODE/ANK NEW/xampp_package"
    output_zip = "d:/CODE/ANK NEW/hostinger_public_html.zip"
    
    # Remove existing zip if any
    if os.path.exists(output_zip):
        os.remove(output_zip)
        
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Compute relative archive path
                arcname = os.path.relpath(file_path, start=source_dir).replace('\\', '/')
                zipf.write(file_path, arcname)
                
    print(f"Created standard clean ZIP at {output_zip} with all subfolders preserved.")

if __name__ == "__main__":
    create_clean_hostinger_zip()
