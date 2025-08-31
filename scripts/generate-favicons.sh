#!/bin/bash

# Favicon Generation Script
# Converts favicon.svg to all necessary formats for web compatibility
# Requires ImageMagick (convert command)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PUBLIC_DIR="$PROJECT_ROOT/public"
SOURCE_SVG="$PUBLIC_DIR/favicon.svg"

echo -e "${BLUE}🎨 Favicon Generation Script${NC}"
echo "================================="

# Check if source SVG exists
if [[ ! -f "$SOURCE_SVG" ]]; then
    echo -e "${RED}❌ Error: favicon.svg not found at $SOURCE_SVG${NC}"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ Error: ImageMagick (convert command) is not installed${NC}"
    echo "Install it with: brew install imagemagick"
    exit 1
fi

echo -e "${GREEN}✅ Found favicon.svg${NC}"
echo -e "${GREEN}✅ ImageMagick is available${NC}"
echo

# Create temporary high-resolution PNG for better conversion quality
TEMP_PNG="$PUBLIC_DIR/temp_favicon_hires.png"
echo -e "${YELLOW}🔄 Creating temporary high-resolution PNG...${NC}"
convert "$SOURCE_SVG" -resize 1024x1024 -background transparent "$TEMP_PNG"

# Function to generate favicon with specific size and filename
generate_favicon() {
    local size=$1
    local filename=$2
    local description=$3
    
    echo -e "${YELLOW}🔄 Generating $description ($size)...${NC}"
    convert "$TEMP_PNG" -resize "${size}x${size}" -background transparent "$PUBLIC_DIR/$filename"
    
    if [[ -f "$PUBLIC_DIR/$filename" ]]; then
        echo -e "${GREEN}✅ Created: $filename${NC}"
    else
        echo -e "${RED}❌ Failed to create: $filename${NC}"
    fi
}

# Generate all favicon formats
echo -e "${BLUE}Generating favicon formats...${NC}"
echo

# Standard favicon sizes
generate_favicon 16 "favicon-16x16.png" "Standard favicon 16x16"
generate_favicon 32 "favicon-32x32.png" "Standard favicon 32x32"

# Apple Touch Icons (required for iOS)
generate_favicon 180 "apple-touch-icon.png" "Apple Touch Icon 180x180"
generate_favicon 180 "apple-touch-icon-precomposed.png" "Apple Touch Icon Precomposed 180x180"

# Additional Apple Touch Icon sizes (optional but comprehensive)
generate_favicon 57 "apple-touch-icon-57x57.png" "Apple Touch Icon 57x57 (iPhone original)"
generate_favicon 60 "apple-touch-icon-60x60.png" "Apple Touch Icon 60x60 (iPhone)"
generate_favicon 72 "apple-touch-icon-72x72.png" "Apple Touch Icon 72x72 (iPad)"
generate_favicon 76 "apple-touch-icon-76x76.png" "Apple Touch Icon 76x76 (iPad)"
generate_favicon 114 "apple-touch-icon-114x114.png" "Apple Touch Icon 114x114 (iPhone Retina)"
generate_favicon 120 "apple-touch-icon-120x120.png" "Apple Touch Icon 120x120 (iPhone Retina)"
generate_favicon 144 "apple-touch-icon-144x144.png" "Apple Touch Icon 144x144 (iPad Retina)"
generate_favicon 152 "apple-touch-icon-152x152.png" "Apple Touch Icon 152x152 (iPad Retina)"

# Android/Chrome icons
generate_favicon 192 "android-chrome-192x192.png" "Android Chrome 192x192"
generate_favicon 512 "android-chrome-512x512.png" "Android Chrome 512x512"

# Microsoft Tile icons
generate_favicon 144 "mstile-144x144.png" "Microsoft Tile 144x144"
generate_favicon 150 "mstile-150x150.png" "Microsoft Tile 150x150"
generate_favicon 310 "mstile-310x150.png" "Microsoft Tile 310x150"
generate_favicon 310 "mstile-310x310.png" "Microsoft Tile 310x310"
generate_favicon 70 "mstile-70x70.png" "Microsoft Tile 70x70"

# Generate multi-size ICO file (for older browsers)
echo -e "${YELLOW}🔄 Generating favicon.ico (multi-size)...${NC}"
convert "$TEMP_PNG" \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 48x48 \) \
    \( -clone 0 -resize 64x64 \) \
    -delete 0 -alpha off -colors 256 "$PUBLIC_DIR/favicon.ico"

if [[ -f "$PUBLIC_DIR/favicon.ico" ]]; then
    echo -e "${GREEN}✅ Created: favicon.ico (multi-size)${NC}"
else
    echo -e "${RED}❌ Failed to create: favicon.ico${NC}"
fi

# Clean up temporary file
echo -e "${YELLOW}🧹 Cleaning up temporary files...${NC}"
rm -f "$TEMP_PNG"

echo
echo -e "${GREEN}🎉 Favicon generation complete!${NC}"
echo

# Generate manifest.json for PWA support
MANIFEST_FILE="$PUBLIC_DIR/site.webmanifest"
echo -e "${YELLOW}🔄 Generating site.webmanifest...${NC}"

cat > "$MANIFEST_FILE" << EOF
{
    "name": "Pete Pittawat",
    "short_name": "Pete",
    "icons": [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}
EOF

echo -e "${GREEN}✅ Created: site.webmanifest${NC}"

# Generate browserconfig.xml for Microsoft tiles
BROWSERCONFIG_FILE="$PUBLIC_DIR/browserconfig.xml"
echo -e "${YELLOW}🔄 Generating browserconfig.xml...${NC}"

cat > "$BROWSERCONFIG_FILE" << EOF
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/mstile-70x70.png"/>
            <square150x150logo src="/mstile-150x150.png"/>
            <square310x310logo src="/mstile-310x310.png"/>
            <wide310x150logo src="/mstile-310x150.png"/>
            <TileColor>#ffffff</TileColor>
        </tile>
    </msapplication>
</browserconfig>
EOF

echo -e "${GREEN}✅ Created: browserconfig.xml${NC}"

echo
echo -e "${BLUE}📋 Generated files summary:${NC}"
echo "================================="
echo "Standard favicons:"
echo "  • favicon.ico (multi-size)"
echo "  • favicon-16x16.png"
echo "  • favicon-32x32.png"
echo
echo "Apple Touch Icons:"
echo "  • apple-touch-icon.png (180x180)"
echo "  • apple-touch-icon-precomposed.png (180x180)"
echo "  • Various sizes (57-180px)"
echo
echo "Android/Chrome:"
echo "  • android-chrome-192x192.png"
echo "  • android-chrome-512x512.png"
echo
echo "Microsoft Tiles:"
echo "  • mstile-*.png (various sizes)"
echo "  • browserconfig.xml"
echo
echo "PWA Support:"
echo "  • site.webmanifest"
echo
echo -e "${GREEN}🚀 All favicon formats have been generated successfully!${NC}"
echo -e "${YELLOW}💡 Don't forget to update your HTML head section with the appropriate meta tags.${NC}"
