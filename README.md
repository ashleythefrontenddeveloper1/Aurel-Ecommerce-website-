# AUREL — The Art of Everyday Elegance

A complete multi-page premium fashion storefront built with **HTML, CSS and vanilla JavaScript only**. No React, build tools, frameworks or package installation required.

## Open the website
1. Extract `AUREL-Website.zip`.
2. Open the extracted `AUREL` folder in VS Code for the Web (`https://vscode.dev/`).
3. Open `index.html`.
4. To preview it, use a browser preview/live server if available, or open `index.html` from the Chromebook Files app. Some browser security restrictions can affect local file previews.

## Pages
- `index.html` — Home / editorial landing page
- `shop.html` — Product catalogue, category filters, sorting and search query
- `product.html?id=1` — Product detail page, gallery, size and colour selection
- `collections.html` — Collection landing page
- `about.html` — Brand story
- `contact.html` — Contact form demo
- `cart.html` — Shopping bag and quantity controls
- `wishlist.html` — Saved products
- `checkout.html` — Demo checkout
- `success.html` — Demo order confirmation
- `404.html` — Not-found page

## Features
- Responsive desktop, tablet and mobile navigation
- Product catalogue with categories and price sorting
- Search overlay with live suggestions
- Product details with size/colour choices
- Add to bag, quantity updates, remove item and shipping calculation
- Wishlist saved in browser storage
- Cart and wishlist persist using `localStorage`
- Demo checkout with required-field validation and confirmation
- Newsletter and contact form front-end interactions
- Accessible labels, buttons and responsive layouts

## Important notes
- This is a front-end portfolio demonstration. Checkout does **not** take payments, create real shipments, send emails, or store customer data on a server.
- Cart, wishlist and demo order information are stored only in the visitor's browser.
- Product photography and Google Fonts load from external services, so an internet connection is needed for those assets. If an image URL stops working, replace it in `js/products.js` with a working image URL.
- Replace example contact details and social links before publishing.
- For a real store, add a secure backend, inventory, customer accounts, order management and a trusted payment provider. Never collect or store card details in front-end JavaScript.
