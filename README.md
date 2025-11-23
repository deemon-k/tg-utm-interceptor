# Docker-based URL Params Interceptor for Telegram Bots

This lightweight service lets you pass URL parameters (like UTM tags) through Telegram deep links, making it easier to track clicks from ads or campaigns.

---

### Installation

1. Make sure **Docker** is installed on your VPS.  
2. Clone the repository:  
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```
3. Start the service using Docker Compose:
   ```bash
   docker-compose up -d
   ```
4. Configure an Nginx reverse proxy to forward traffic to the service, which runs on port 3010.

### Usage

1. Use a URL like: `https://yourdomain.com/yourbotname`
   Add it to Facebook Ads or any other platform. You can include any UTM parameters you need.
2. On the bot side:
   - Handle the `/start` command payload
   - You will recieve a __unique hash__ for each click
3. To retrieve the captured query parameters, send a GET request to:
   `https://yourdomain.com/api/params/<hash>`
### Example Response
```json
{
	"timestamp": "1763909108631", //when the service handled the click
	"queryParams": {
		"utm_source": "google",
		"utm_medium": "cpc",
		"utm_campaign": "black_friday_2025",
		"fbclid": "FB1234567890",
		"gclid": "GCL987654321",
		"ref": "newsletter",
		"promo": "holiday50",
		"lang": "en®ion=EU",
		"session_id": "abc123xyz456"
	}
}
```
