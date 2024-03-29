export const routeOption = (route, key, value) => {
  return route.matched.some((m) => {
    if (process.client) {
      // Client
      return Object.values(m.components).some(
        (component) => component.options && component.options[key] === value
      )
    } else {
      // SSR
      return Object.values(m.components).some((component) =>
        Object.values(component._Ctor).some(
          (ctor) => ctor.options && ctor.options[key] === value
        )
      )
    }
  })
}

export const getMatchedComponents = (route, matches = false) => {
  return [].concat.apply(
    [],
    route.matched.map(function(m, index) {
      return Object.keys(m.components).map(function(key) {
        matches && matches.push(index)
        return m.components[key]
      })
    })
  )
}

export function normalizePath(path = '') {
  // Remove query string
  let result = path.split('?')[0]

  // Remove redundant / from the end of path
  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1)
  }

  return result
}

export default function({ route, $auth }) {
  // if (!process.client) {
  //   return
  // }
  // Disable middleware if options: { auth: false } is set on the route
  if (routeOption(route, 'auth', false)) {
    return
  }

  // Disable middleware if no route was matched to allow 404/error page
  const matches = []
  const Components = getMatchedComponents(route, matches)
  if (!Components.length) {
    return
  }

  const { login, register } = $auth.options.redirect
  const insidePage = (page) => normalizePath(route.path) === normalizePath(page)
  if ($auth.$state.loggedIn) {
    // -- Authorized --
    if (!login || insidePage(login) || !register || insidePage(register)) {
      $auth.redirect('home')
    }
  } else if (!register || !insidePage(register)) {
    $auth.redirect('login')
  }
}
