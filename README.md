# Sales H1 Terminal v2

Flow:
1. Guest opens the website.
2. Guest enters their personal Access Key.
3. Correct key immediately opens the pre-customized ticket.
4. Guest can only view/save the ticket.

Admin:
- Click ADMIN ACCESS on the login screen.
- Admin key: ADMIN2026
- Create/edit guest tickets.
- Example: 0807 -> dducanhlee.

IMPORTANT:
This is a static Netlify version. Admin changes are saved to browser localStorage, so they are not automatically shared to other people's devices. For a ticket to be available to everyone, put the final ticket data in STATIC_TICKETS in app.js and commit it to GitHub. A real shared admin system would require a database/backend.
