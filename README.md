# Daily Activity Log

Vue 3 SPA for YLP student daily check-in, activity logging, and end-of-day review.

## Served at
`portal.ourmoon.org/portal/`

## Features
- **Day Starter** — morning intentions, mood check-in
- **Activity Checklist** — tasks with subtasks, move to tomorrow
- **Biblical & General Comprehension** — reading reflection entries
- **Fitness Log** — physical activity records
- **Day Finisher** — review and close out the day
- **History** — 14-day activity history

## Linked Frappe DocTypes (in scholars-portal app)
- `YLP Daily Log` — parent per student per day (links to `Student`)
- `YLP Activity` — tasks and subtasks linked to the daily log
- `YLP Comprehension` — biblical and general reading entries
- `YLP Fitness Log` — physical activity records

## Roles
- `YLP Student` — create/read own records
- `YLP Coordinator` — read all, mark activities
- `System Manager` / `OME Admin` — full access

## Setup
```bash
npm install
npm run dev      # dev server at localhost:5174/portal/
npm run build    # production build to dist/
```

## Nginx
Served via a dedicated Nginx server block on port 8183, proxied from `/portal/`.
Add to `ourmoon-platforms.conf`:
```nginx
server {
    listen 127.0.0.1:8183;
    location / {
        root /home/azureuser/frappe/dailyactivitylog/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store";
    }
}
# In the main server:
location /portal/ {
    proxy_pass http://127.0.0.1:8183/;
    proxy_set_header Host $host;
}
```

## Cross-app links
- CareerPath sidebar → `/portal/` 
- Scholar Directory nav → `/portal/`
- Frappe Desk → Student record → Daily Activity Log tab
