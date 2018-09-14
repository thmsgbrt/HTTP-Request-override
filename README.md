
# HTTP Request Override for Chrome
- Replace a request made by a webpage
or
- Inject a new request while your page is loading
## Available Chrome Store
Follow the link to download the extension : [HTTP Request Override](https://chrome.google.com/webstore/detail/http-request-override-for/aphamfcacafmodcbmgkhhfgfeanjdiio)
## Screenshots
![Screenshot1](https://raw.githubusercontent.com/thmsgbrt/HTTP-Request-override/master/app/assets/img/screenshots/s1.jpg)
![Screenshot2](https://raw.githubusercontent.com/thmsgbrt/HTTP-Request-override/master/app/assets/img/screenshots/s2.jpg)
## How it works
- Create a rule by clicking on **Add Rule** button
- Select your injection choice 
	- *Override Request* : will override any requests matching the **Request Regex**
	- *Inject Code*: will create a new request with the given **URL to inject**
- *Page Regex* : The extension will either watch every requests for the corresponding URL (if you are replacing a request) or inject a new request for every pages matching the regex.
## Developing 
If you want to work on it :
 `git clone https://github.com/thmsgbrt/HTTP-Request-override`
### Chrome
1.  Enable  [Chrome Extensions Developer Mode](https://developer.chrome.com/extensions/faq#faq-dev-01)  in Chrome.
2.  In Settings > Extensions click "Load unpacked extension" and select the  `app/`  subfolder of this repository.

There is a gulp task **to compile the scss** that you can start by running `gulp` at the root of the folder.