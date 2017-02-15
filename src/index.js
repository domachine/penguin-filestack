import { update } from 'penguin.js/actions'
import xtend from 'xtend'

const defaultRenderCallback = url => (
  { attrs: { src: url } }
)

const defaultMountCallback = (url, el) => {
  el.setAttribute('src', url)
}

const mountConfigurationScript = fn => {
  const script = document.createElement('script')
  script.setAttribute('id', 'filestack-script-config')
  script.type = 'text/javascript'
  script.async = true
  script.onload = fn
  script.src = '/filestack/script.js'
  document.getElementsByTagName('head')[0].appendChild(script)
}

const mountScript = fn => {
  const el = document.querySelector('script#filestack-script')
  if (el) return fn()
  const script = document.createElement('script')
  script.setAttribute('id', 'filestack-script')
  script.type = 'text/javascript'
  script.async = true
  script.onload = () => mountConfigurationScript(fn)
  script.src = 'https://api.filestackapi.com/filestack.js'
  document.getElementsByTagName('head')[0].appendChild(script)
}

export function render ({ field, store, callback = defaultRenderCallback }) {
  const { fields } = store.getState()
  return defaultRenderCallback(fields[field])
}

export function mount (props, el) {
  if (props.store.getState().isBuilt) return
  const {
    field,
    store,
    defaultURL,
    callback = defaultMountCallback,
    save
  } = props
  const render = url => callback(url || defaultURL || '', el)
  const nonOpts = ['defaultURL', 'callback', 'save', 'destroy']
  const opts =
    Object.keys(props)
      .filter(k => nonOpts.indexOf(k) === -1)
      .reduce((opts, k) => xtend({}, opts, { [k]: props[k] }), {})
  let { fields: { [field]: previousURL } } = store.getState()
  render(previousURL)
  store.subscribe(() => {
    const { fields: { [field]: url } } = store.getState()
    if (url !== previousURL && previousURL && previousURL.match(/filestack/)) {
      const xhr = new window.XMLHttpRequest()
      xhr.open('DELETE', `/filestack?url=${previousURL}`, true)
      xhr.send()
    }
    const oldURL = previousURL
    previousURL = url
    if (url !== oldURL) render(url)
  })
  mountScript(() => {
    el.addEventListener('click', () => {
      window.filepicker.pick(
        opts,
        ({ url }) => {
          store.dispatch(update({ [field]: url }))
          save()
        }
      )
    })
  })
}
