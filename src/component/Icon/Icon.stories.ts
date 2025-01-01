import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Icon from './index';

const meta = {
  title: 'Example/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',

  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: {type: 'text'},defaultValue: 'tabler:edit', description: 'name of icon' },
    fontSize: {
      description: 'fontsize of icon',
      defaultValue: '20px',
      control: {type: 'text'}
    }
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Primary: Story = {
  args: {
    fontSize: '18px',
    icon: 'tabler:edit',
  },
};
