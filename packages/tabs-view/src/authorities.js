let $authorities
let cache = {}

export const getAuthority = (path) => {
  if (cache[path]) {
    return cache[path]
  }
  if ($authorities !== undefined) {
    const authority = $authorities.find(item => (item.path === path || item.path === path.replace(/-[\d]+$/, '')))
    cache[path] = authority === undefined ? null : authority
    return cache[path]
  }
  return undefined
}

export const validateAuthority = (path, authorityCode) => {
  const authority = getAuthority(path)
  if (authority !== undefined) {
    if (!authority || !authority.buttons || authority.buttons.findIndex(button => button === authorityCode) === -1) {
      return false
    }
  }
  return true
}

export const getAuthorities = () => {
  return $authorities
}

export const setAuthorities = (authorities) => {
  cache = {}
  $authorities = authorities
}
