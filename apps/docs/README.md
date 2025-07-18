# 📖 Conduit Documentation

Storybook documentation site for the Conduit Portfolio UI components.

## Features

- **Component Documentation** - Interactive component playground
- **Design System** - Comprehensive design system documentation
- **Accessibility Testing** - Built-in accessibility checks
- **Visual Testing** - Screenshot testing for components

## Development

```bash
# Start Storybook development server
yarn dev

# Build Storybook for production
yarn build

# Run visual tests
yarn test

# Preview built Storybook
yarn preview
```

## Structure

- `stories/` - Component stories
- `docs/` - Documentation pages
- `.storybook/` - Storybook configuration

## Writing Stories

Create stories for components from `@conduit/ui`:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@conduit/ui'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
}

export default meta
``` 