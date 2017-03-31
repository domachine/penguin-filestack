# penguin-filestack integration

> [Filestack](https://www.filestack.com) is an API for developers that makes it easy to add powerful file uploading capabilities to any website or mobile app.

This plugin integrates this nifty filepicker into your penguin.js based website.

## Installation

	$ npm i -S penguin-filestack

Then edit your `package.json` file to include the component and embed the middleware.

```json
{
  "scripts": {
    "serve": "penguin serve --middleware [ penguin-filestack/middleware --api-key YOUR_APP_KEY --secret YOUR_APP_SECRET ]",
    "start": "penguin run ... --middleware [ penguin-filestack/middleware --api-key YOUR_APP_KEY --secret YOUR_APP_SECRET ]"
  },
  "penguin": {
    "components": {
      "Filestack": "penguin-filestack"
    }
  }
}
```

**Note that the ellipsis in the start command doesn't belong there. It's a placeholder for your other settings**

## Usage

Now you can use this as a component. Just place it onto an `img` tag.

```html
<img data-component='Filestack' data-props='{"field":"my-image-field","defaultURL":"//placehold.it/300x300"}'>
```

### Available props

* `field` - This field is **required**. It specifies which field the image url should be saved to.
* `defaultURL` - This specifies the file url that is used if the user didn't enter a url, yet.

All other props are passed as options to the `filepicker.pick` function. [Read the docs](https://www.filestack.com/docs/javascript-api/pick).

### Extending

The behaviour of the component can be customized to match various. Check the following example which edits the background-image style of a div.

```js
import {
  mount as mountFilepicker,
  render as renderFilepicker
} from 'penguin-filestack'

export function mount (ctx, props, el) {
  if (process.env.PENGUIN_ENV === 'production') return
  props.register = fn => {
    el.addEventListener('click', () => fn())
  }
  props.callback = function callback (url) {
    el.style.backgroundImage = `url(${url})`
  }
  mountFilepicker(ctx, props, el)
}

export function render (ctx, props) {
  props.callback = url => (
    { attrs: { style: `background-url: url(${url})` } }
  )
}
```