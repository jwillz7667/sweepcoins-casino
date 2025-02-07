import React from 'react';
import { render as baseRender, RenderOptions } from '@testing-library/react';
import { TestProviders, AllTheProviders } from './providers';
import type { TestContextState } from './types';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  state?: TestContextState;
}

const render = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { state, ...renderOptions } = options;
  return baseRender(ui, {
    wrapper: (props) => <TestProviders {...props} state={state} />,
    ...renderOptions,
  });
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
) => {
  return baseRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
};

export { render }; 