# Pug & PostCSS boilerplate with gulp

### Usage

```
npm install
gulp
open http://localhost:8080
```
### Linting

[Stylelint](https://github.com/stylelint/stylelint)
Modify you stylelint.config.js and .stylelintrc for Sublime Text

### Deploy

I'm going to add a bundler task for this - until then, you can prepare the site for deployment by making a directory with the following structure:
```bash
deploy
 ├── dist
 │   ├── css
 │   │   └── style.min.css
 │   ├── fonts
 │   ├── img
 │   └── js
 └── index.html
```

Then compress the new `deploy` directory as a `.zip` and send it off to AWS.
