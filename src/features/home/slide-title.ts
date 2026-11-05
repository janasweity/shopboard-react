// Presentation-only line metadata preserves the protected source slide titles.
export const slideTitleLines: Record<
  string,
  readonly {
    readonly id: string
    readonly text: string
    readonly emphasis?: boolean
  }[]
> = {
  living: [
    { id: 'living-gather', text: 'Space to gather.' },
    { id: 'living-breathe', text: 'Room to breathe.', emphasis: true },
  ],
  burgundy: [
    { id: 'burgundy-textures', text: 'Rich textures.' },
    { id: 'burgundy-contrasts', text: 'Soft contrasts.' },
    { id: 'burgundy-living', text: 'Considered living.', emphasis: true },
  ],
  kitchen: [
    { id: 'kitchen-materials', text: 'Warm materials.' },
    { id: 'kitchen-company', text: 'Good company.' },
    { id: 'kitchen-rituals', text: 'Everyday rituals.', emphasis: true },
  ],
}
