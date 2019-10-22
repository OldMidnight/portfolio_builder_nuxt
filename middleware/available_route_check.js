export default function({ store, redirect }) {
  if (store.state.creator.is_subdomain) {
    redirect('/')
  }
}
