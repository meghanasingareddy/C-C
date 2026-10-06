# Chai and Chapter - Book Cafe Website

Chai and Chapter is a frontend project for a book cafe based in Banjara Hills, Hyderabad. The website combines Indian chai culture with dedicated reading nooks, a categorized in-store menu, community events, chef spotlight, customer reviews, and a book-club newsletter. It is designed as a single-page application with smooth scroll navigation and an in-store cart ordering system.

Live site: https://chai-and-chapter.vercel.app

## Features

- Interactive categorized menu with filter tabs (Pizzas, Chai and Coffee, Sandwiches and Bites, Bakes and Desserts, Milkshakes, Pasta and Mains)
- In-store cart sidebar with item quantity tracking and order total
- Reading nook reservation form
- Login and signup modal
- Community events section with RSVP prompts
- Customer reviews section
- Newsletter subscription
- Responsive layout for desktop and mobile

## Project Structure

1. **Header / Navigation** - Logo, business name, nav links, cart button, and login button.
2. **Hero Section** - Main heading, tagline, description, hero image, and call-to-action buttons.
3. **Reading Nooks Showcase** - Four nook cards (Window, Library Corner, Garden, Couple's Table) with features and reservation links.
4. **How It Works** - Four-step process explaining how patrons pick a nook, browse books, order from the menu, and unwind.
5. **Chef Section** - Chef profile, quote, customer feedback avatars, and rating.
6. **Menu Section** - Categorized product cards with images, descriptions, prices, and add-to-cart buttons. Six categories: Pizzas, Chai and Coffee, Sandwiches and Bites, Bakes and Desserts, Milkshakes, Pasta and Mains.
7. **Reservation Section** - Form with fields for Full Name, Email, Date, and Preferred Nook.
8. **Events Section** - Three event cards (Unplugged Evening, Stories Over Chai, Chapter Conversations) with RSVP triggers.
9. **About Section** - Two-column layout with cafe story and founding philosophy.
10. **Reviews Section** - Customer review cards with star ratings.
11. **Newsletter Section** - Email subscription form for The Chapter Club.
12. **Footer** - Address, opening hours, quick links, and copyright.

## Technologies Used

- HTML5 (semantic elements: header, nav, section, form, footer)
- CSS3 (Flexbox, Grid, custom properties, media queries)
- JavaScript (DOM manipulation, cart logic, form event handling, category filtering)
- Boxicons (icon library)
- Google Fonts (Cormorant Garamond, Poppins)
- Vercel (deployment)

## File Structure

```
C-C/
├── index.html              # Main HTML file
├── style.css               # Main stylesheet
├── script.js               # JavaScript (cart, filters, modals, forms)
├── README.md               # Documentation
└── assets/
    ├── logo_new.jpg         # Cafe logo
    ├── hero.jpg             # Hero section image
    ├── chef.jpg             # Chef profile image
    ├── chai.jpg             # Masala chai product image
    ├── coffee.jpeg          # Cappuccino product image
    ├── fc.jpeg              # Filter coffee product image
    ├── pizzas.jpg           # Pizza product image
    ├── sandwich.jpg         # Sandwich product image
    ├── samosa.jpg           # Samosa / bun maska product image
    ├── cake.jpg             # Cake / brownie product image
    ├── cookies.jpeg         # Cookies product image
    ├── biscuit.jpg          # Milkshake placeholder image
    ├── iced_coffee.jpeg     # Iced caramel latte
    ├── hot_chocolate.jpeg   # Marshmallow hot chocolate
    ├── black_coffee.jpeg    # Dark roast black coffee
    ├── matcha_latte.jpeg    # Iced matcha oat latte
    ├── veggie_pizza.jpeg    # Loaded garden veggie pizza
    ├── brownie_icecream.jpeg# Warm brownie a la mode
    ├── loaded_shakes.jpeg   # Loaded oreo caramel shake
    ├── pasta.jpeg           # Arrabbiata spaghetti
    ├── window_nook.jpeg     # Window reading nook
    ├── bookshelf.jpg        # Library corner
    ├── garden_nook.jpg      # Garden nook
    ├── couple.jpeg          # Couple's reading table
    ├── sing.jpg             # Unplugged evening event
    ├── poetry.jpeg          # Stories over chai event
    ├── book-swap.jpg        # Chapter conversations event
    ├── review1.jpeg         # Customer review avatar
    ├── review2.jpeg         # Customer review avatar
    ├── review3.jpeg         # Customer review avatar
    └── bg.jpg               # Background image
```

## How to Run Locally

Open `index.html` directly in any modern web browser. No build step or server is required.

## Deployment

The site is deployed on Vercel. To redeploy after changes:

```
vercel --prod --yes --name chai-and-chapter
```

Production URL: https://chai-and-chapter.vercel.app
