const modules = import.meta.globEager('./**/*.js')
const locale_vi = {}
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  for (const key in mod) {
    if (mod.hasOwnProperty(key)) {
      locale_vi[key] = mod[key]
    }
  }
})

export default locale_vi
