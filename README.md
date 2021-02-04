# Koala - Static Website Generator

## About

The project aims to create simple to use, scalable and fast static website generator.

Core features:

- generated code is fast and efficient, can be deployed as a static website
- one CSS and one JS file for whole website
- required skill set should be HTML, CSS, JavaScript
- ideal for small websites and blogs

## Showcase

Example websites:

- https://vkdot.com/blog/ (author's personal blog)

## Usage

To use the Koala for your project, start by cloning the template repository at https://github.com/KoalaSpace/koala-template

Alternatively, you can run

```bash
npm i koala-webgen
```

in your project and then use commands to

- initialize the project:
  ```bash
  koala-webgen init
  ```
- start development server
  ```bash
  koala-webgen start
  ```
- build release artifacts
  ```bash
  koala-webgen build
  ```

See the template project for more details: https://github.com/KoalaSpace/koala-template

## Development

### How to run the project

You need Node.JS v12 (LTS) on your machine.

Then run the following commands to start the environment:

```bash
npm install
npm start
```

Connect to the website at http://localhost:3080/

### Release

In order to build release artifact in `dist` directory, you need to run:

```bash
npm run build
```

## Project Structure

### Themes

Themes are placed in `website/themes` directory.

Selected theme is referenced in `website/configuration.json` as `theme` key. The name corresponds to a theme folder name in `website/themes`.

Each theme folder should contain:

- `index.html` - root website template
- `style.css` - theme CSS styles
- `script.js` - theme JavaScript file (optional)
- `components/<name>.html` - components templates

Templates use Handlerbars for templating: https://handlebarsjs.com/

### Pages

Pages are used for a static content that is not a post, e.g. About page. They are placed in `website/pages` directory and named `<name>.html`. They should contain plain HTML code without heading.

You should specify page / post variables. See the section Page / Post Variables.

### Posts

Posts are used for regular content, like weekly updates or news. They are placed in `website/posts` directory and named `<name>.html`. They should contain plain HTML code without heading.

You should specify page / post variables. See the section Page / Post Variables.

### Page / Post Variables

Every page or post should specify the following variables:

- `title` - page title
- `date` - date of creation / publishing of the post in UTC timezone
- `tags` - keywords or categories of the post (optional)

Variables are defined as HTML comments:

```html
<!-- title: About -->
<!-- date: 2020-05-20 10:45:00 -->
<!-- tags: tag1,tag2,tag3 -->
```

Variable template is:

```html
<!-- NAME: VALUE -->
```

Please, note the space after colon and spaces after and before `--`.

Format is:

- `title` - any text
- `date` - `YYYY-mm-dd HH:MM:SS` (24 hour ISO format)
- `tags` - comma-separated values

## Bugs

Please, open an issue at https://github.com/KoalaSpace/koala-webgen/issues

## Questions

If you have any question, feel free to send an e-mail at app@koalaspace.com

## Long Term Goals

- Non-developer UI (e.g. Electron-based app)
- WYSIWYG editor (e.g. TinyMCE)
- Easy deploy to FTP or AWS S3 + CloudFront
- Data binding for auto-generated pages (e.g. product websites)

## Author

Voyta Krizek (Twitter [@VoytaKrizek](https://twitter.com/VoytaKrizek))
