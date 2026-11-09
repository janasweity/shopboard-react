import StatusMessage from '../../../components/StatusMessage.tsx'

export default function ProductLoading() {
  return (
    <section className="page-intro">
      <StatusMessage kind="loading" message="Loading product..." />
    </section>
  )
}
