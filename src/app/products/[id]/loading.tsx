import StatusMessage from '../../../components/StatusMessage.tsx'
import { pageIntroClass } from '../../../components/page-intro-classes.ts'

export default function ProductLoading() {
  return (
    <section className={pageIntroClass}>
      <StatusMessage kind="loading" message="Loading product..." />
    </section>
  )
}
