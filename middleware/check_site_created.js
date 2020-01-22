export default function({ store, redirect }) {
  if (!store.state.auth.user.site_created) {
    return redirect('/dashboard')
  }
}
