# Ceramics Website

A simple, beautiful website for showcasing ceramic pottery and artwork.

## File Structure

```
stardi/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styles and layout
├── js/
│   └── script.js       # JavaScript functionality
├── images/             # Place your pottery images here
└── README.md           # This file
```

## Getting Started

1. **Add your images**: Place your pottery photos in the `images/` folder
   - Name them: `pottery1.jpg`, `pottery2.jpg`, `pottery3.jpg`, etc.
   - Recommended size: 600x400 pixels or larger

2. **Customize content**: Edit `index.html` to update:
   - Studio name
   - Description text
   - Contact information

3. **View your website**: Open `index.html` in your web browser

## Features

- Responsive design (works on mobile and desktop)
- Smooth scrolling navigation
- Gallery section for pottery showcase
- Contact section
- Clean, professional appearance

## Customization Tips

### Colors
The main colors used are:
- Brown (`#8B4513`) - Headers and navigation
- Tan (`#D2B48C`) - Accent color
- White (`#fff`) - Background sections

To change colors, edit the CSS file (`css/style.css`).

### Adding More Gallery Items
In `index.html`, copy this structure inside the `gallery-grid` div:

```html
<div class="gallery-item">
    <img src="images/your-image.jpg" alt="Description">
    <h3>Item Name</h3>
</div>
```

### Fonts
Currently uses Arial. To use different fonts:
1. Add Google Fonts link to HTML head section
2. Update `font-family` in CSS

## Next Steps

1. Take photos of your ceramics
2. Replace placeholder text with your content
3. Add more pages (workshops, pricing, etc.)
4. Consider hosting on GitHub Pages or Netlify (free options)

## Need Help?

- **HTML/CSS Tutorial**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn)
- **Free Images**: [Unsplash](https://unsplash.com) (for background/placeholder images)
- **Color Palette Tools**: [Coolors.co](https://coolors.co)

Good luck with your ceramics website! 🏺