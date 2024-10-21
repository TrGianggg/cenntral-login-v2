const modules = import.meta.globEager('./**/*.js')
const locale_en = {}
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  for (const key in mod) {
    if (mod.hasOwnProperty(key)) {
      locale_en[key] = mod[key]
    }
  }
})

export default locale_en
