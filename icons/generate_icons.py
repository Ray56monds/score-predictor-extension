from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    img = Image.new('RGB', (size, size), color='#27ae60')
    draw = ImageDraw.Draw(img)
    
    # Draw soccer ball emoji-style circle
    padding = size // 8
    draw.ellipse([padding, padding, size-padding, size-padding], fill='white', outline='#27ae60', width=max(1, size//16))
    
    # Draw simple pentagon pattern
    center = size // 2
    radius = size // 4
    draw.ellipse([center-radius//3, center-radius//3, center+radius//3, center+radius//3], fill='#27ae60')
    
    img.save(filename, 'PNG')
    print(f"Created {filename}")

create_icon(16, 'icon16.png')
create_icon(48, 'icon48.png')
create_icon(128, 'icon128.png')
print("All icons generated successfully!")
