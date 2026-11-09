'use client'

import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  readonly children: ReactNode
  // Renders the error state. retry clears the error and renders children again.
  readonly fallback: (error: unknown, retry: () => void) => ReactNode
  // Runs before a retry, for example to forget a failed request.
  readonly onRetry?: () => void
  // When this value changes (for example the page), the error is cleared and
  // children render again, as after a retry.
  readonly resetKey?: string
}

type State =
  | { readonly failed: false }
  | { readonly failed: true; readonly error: unknown }

// React has no hook for catching render errors, so this is a class component.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(error: unknown): State {
    return { failed: true, error }
  }

  retry = (): void => {
    this.props.onRetry?.()
    this.setState({ failed: false })
  }

  componentDidUpdate(previous: Props): void {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.retry()
    }
  }

  render(): ReactNode {
    if (this.state.failed) {
      return this.props.fallback(this.state.error, this.retry)
    }
    return this.props.children
  }
}
